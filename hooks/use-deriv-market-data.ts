import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

export interface MarketDataTick {
  symbol: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: Date;
  volume?: string;
}

export interface DerivSymbolInfo {
  symbol: string;
  displayName: string;
  category: 'forex' | 'crypto' | 'stocks' | 'indices' | 'commodities' | 'synthetic';
  isActive: boolean;
}

interface MarketDataState {
  prices: Record<string, MarketDataTick>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  apiConnected: boolean;
  activeSymbols: DerivSymbolInfo[];
  subscribedSymbols: string[];
}

interface UseDerivMarketDataOptions {
  enabled?: boolean;
  autoSubscribe?: string[];
}

export function useDerivMarketData(options: UseDerivMarketDataOptions = {}) {
  const { enabled = true, autoSubscribe = [] } = options;
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const [state, setState] = useState<MarketDataState>({
    prices: {},
    isConnected: false,
    isConnecting: false,
    error: null,
    apiConnected: false,
    activeSymbols: [],
    subscribedSymbols: []
  });

  const connect = useCallback(() => {
    if (!enabled || state.isConnecting || state.isConnected) return;

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('🚫 Max market data reconnection attempts reached');
      setState(prev => ({ 
        ...prev, 
        error: 'Maximum reconnection attempts exceeded',
        isConnecting: false 
      }));
      return;
    }

    try {
      console.log('🔗 Connecting to market data WebSocket...');
      
      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Connect to market data namespace
      const socket = io('http://localhost:3002/market-data', {
        auth: {
          token: session?.accessToken
        },
        query: {
          token: session?.accessToken
        },
        transports: ['websocket', 'polling'],
        forceNew: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Connected to market data WebSocket');
        reconnectAttempts.current = 0;
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null
        }));

        // Auto-subscribe to symbols if provided
        if (autoSubscribe.length > 0) {
          subscribeToSymbols(autoSubscribe);
        }

        // Get active symbols
        socket.emit('get_active_symbols');
        socket.emit('get_recommended_symbols');
      });

      socket.on('disconnect', () => {
        console.log('🔌 Market data WebSocket disconnected');
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false
        }));

        // Auto-reconnect with exponential backoff
        if (enabled) {
          reconnectAttempts.current++;
          const delay = Math.min(3000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting market data reconnection...');
            connect();
          }, delay);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Market data connection error:', error);
        setState(prev => ({
          ...prev,
          error: 'Connection failed',
          isConnecting: false
        }));
      });

      // Market data events
      socket.on('price_update', (data: { type: string; data: MarketDataTick }) => {
        const marketData = data.data;
        setState(prev => ({
          ...prev,
          prices: {
            ...prev.prices,
            [marketData.symbol]: {
              ...marketData,
              timestamp: new Date(marketData.timestamp)
            }
          }
        }));
      });

      socket.on('initial_market_data', (data: { prices: MarketDataTick[] }) => {
        const pricesMap: Record<string, MarketDataTick> = {};
        data.prices.forEach(price => {
          pricesMap[price.symbol] = {
            ...price,
            timestamp: new Date(price.timestamp)
          };
        });
        
        setState(prev => ({
          ...prev,
          prices: { ...prev.prices, ...pricesMap }
        }));
      });

      socket.on('api_status', (data: { connected: boolean; timestamp: string }) => {
        setState(prev => ({
          ...prev,
          apiConnected: data.connected
        }));
      });

      socket.on('active_symbols', (data: { symbols: DerivSymbolInfo[] }) => {
        setState(prev => ({
          ...prev,
          activeSymbols: data.symbols
        }));
      });

      socket.on('subscribed', (data: { symbols: string[]; message: string }) => {
        setState(prev => ({
          ...prev,
          subscribedSymbols: [...new Set([...prev.subscribedSymbols, ...data.symbols])]
        }));
        console.log('📊 Subscribed to symbols:', data.symbols);
      });

      socket.on('unsubscribed', (data: { symbols: string[]; message: string }) => {
        setState(prev => ({
          ...prev,
          subscribedSymbols: prev.subscribedSymbols.filter(s => !data.symbols.includes(s))
        }));
        console.log('🚫 Unsubscribed from symbols:', data.symbols);
      });

      socket.on('error', (data: { message: string }) => {
        console.error('❌ Market data error:', data.message);
        setState(prev => ({
          ...prev,
          error: data.message
        }));
      });

    } catch (error) {
      console.error('❌ Failed to connect to market data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to establish connection',
        isConnecting: false
      }));
    }
  }, [enabled, session?.accessToken]); // Removed autoSubscribe to prevent infinite loops

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    reconnectAttempts.current = 0;
    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      subscribedSymbols: []
    }));
  }, []);

  const subscribeToSymbols = useCallback((symbols: string[]) => {
    if (!socketRef.current?.connected) {
      console.warn('Cannot subscribe: not connected to market data');
      return;
    }

    socketRef.current.emit('subscribe_symbols', { symbols });
  }, []);

  const unsubscribeFromSymbols = useCallback((symbols: string[]) => {
    if (!socketRef.current?.connected) {
      console.warn('Cannot unsubscribe: not connected to market data');
      return;
    }

    socketRef.current.emit('unsubscribe_symbols', { symbols });
  }, []);

  const getRecommendedSymbols = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('get_recommended_symbols');
  }, []);

  const getCurrentPrices = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('get_current_prices');
  }, []);

  // Connect when enabled and session is available
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled]); // Removed connect/disconnect to prevent infinite loops

  // Helper functions
  const getSymbolPrice = useCallback((symbol: string): MarketDataTick | null => {
    return state.prices[symbol] || null;
  }, [state.prices]);

  const getSymbolsByCategory = useCallback((category: string): DerivSymbolInfo[] => {
    return state.activeSymbols.filter(symbol => symbol.category === category);
  }, [state.activeSymbols]);

  const formatSymbolDisplay = useCallback((symbol: string): string => {
    // Convert Deriv symbols to display format
    if (symbol.startsWith('frx')) {
      return symbol.replace('frx', '').replace(/(\w{3})(\w{3})/, '$1/$2');
    }
    if (symbol.startsWith('cry')) {
      return symbol.replace('cry', '').replace(/(\w{3})(\w{3})/, '$1/$2');
    }
    return symbol;
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    connect,
    disconnect,
    subscribeToSymbols,
    unsubscribeFromSymbols,
    getRecommendedSymbols,
    getCurrentPrices,
    
    // Helpers
    getSymbolPrice,
    getSymbolsByCategory,
    formatSymbolDisplay,
    
    // Computed values
    connectedSymbolCount: state.subscribedSymbols.length,
    totalPriceUpdates: Object.keys(state.prices).length,
    connectionStatus: state.isConnected ? 'connected' : 
                    state.isConnecting ? 'connecting' : 
                    state.error ? 'error' : 'disconnected'
  };
}