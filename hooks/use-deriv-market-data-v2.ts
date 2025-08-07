import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  autoSubscribeSymbols?: string[]; // Renamed to avoid dependency issues
}

export function useDerivMarketDataV2(options: UseDerivMarketDataOptions = {}) {
  const { enabled = true } = options;
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const mountedRef = useRef(true);

  // Memoize auto-subscribe symbols to prevent dependency changes
  const autoSubscribeSymbols = useMemo(() => 
    options.autoSubscribeSymbols || [], 
    [options.autoSubscribeSymbols?.join(',')]
  );

  const [state, setState] = useState<MarketDataState>({
    prices: {},
    isConnected: false,
    isConnecting: false,
    error: null,
    apiConnected: false,
    activeSymbols: [],
    subscribedSymbols: []
  });

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    reconnectAttempts.current = 0;
    
    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        subscribedSymbols: []
      }));
    }
  }, []);

  // Connect function with stable dependencies
  const connect = useCallback(() => {
    if (!enabled || !mountedRef.current || state.isConnecting || state.isConnected) {
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('🚫 Max market data reconnection attempts reached');
      if (mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          error: 'Maximum reconnection attempts exceeded',
          isConnecting: false 
        }));
      }
      return;
    }

    try {
      console.log('🔗 Connecting to market data WebSocket...');
      
      if (mountedRef.current) {
        setState(prev => ({ ...prev, isConnecting: true, error: null }));
      }

      // Connect to market data namespace
      const socket = io('http://localhost:3002/market-data', {
        auth: {
          token: session?.accessToken
        },
        query: {
          token: session?.accessToken
        },
        transports: ['websocket', 'polling'],
        forceNew: true,
        timeout: 10000
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Connected to market data WebSocket');
        reconnectAttempts.current = 0;
        
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null
          }));

          // Auto-subscribe to symbols if provided
          if (autoSubscribeSymbols.length > 0) {
            console.log('📊 Auto-subscribing to symbols:', autoSubscribeSymbols);
            socket.emit('subscribe_symbols', { symbols: autoSubscribeSymbols });
          }

          // Get active symbols
          socket.emit('get_active_symbols');
          socket.emit('get_recommended_symbols');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Market data WebSocket disconnected:', reason);
        
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false
          }));

          // Auto-reconnect only if disconnect wasn't intentional and component is still mounted
          if (enabled && reason !== 'io client disconnect') {
            reconnectAttempts.current++;
            const delay = Math.min(3000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current) {
                console.log('🔄 Attempting market data reconnection...');
                connect();
              }
            }, delay);
          }
        }
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Market data connection error:', error);
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            error: 'Connection failed',
            isConnecting: false
          }));
        }
      });

      // Market data events
      socket.on('price_update', (data: { type: string; data: MarketDataTick }) => {
        if (!mountedRef.current) return;
        
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
        if (!mountedRef.current) return;
        
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
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            apiConnected: data.connected
          }));
        }
      });

      socket.on('active_symbols', (data: { symbols: DerivSymbolInfo[] }) => {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            activeSymbols: data.symbols
          }));
        }
      });

      socket.on('subscribed', (data: { symbols: string[]; message: string }) => {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            subscribedSymbols: [...new Set([...prev.subscribedSymbols, ...data.symbols])]
          }));
        }
        console.log('📊 Subscribed to symbols:', data.symbols);
      });

      socket.on('unsubscribed', (data: { symbols: string[]; message: string }) => {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            subscribedSymbols: prev.subscribedSymbols.filter(s => !data.symbols.includes(s))
          }));
        }
        console.log('🚫 Unsubscribed from symbols:', data.symbols);
      });

      socket.on('error', (data: { message: string }) => {
        console.error('❌ Market data error:', data.message);
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            error: data.message
          }));
        }
      });

    } catch (error) {
      console.error('❌ Failed to connect to market data:', error);
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: 'Failed to establish connection',
          isConnecting: false
        }));
      }
    }
  }, [enabled, session?.accessToken, autoSubscribeSymbols]);

  // Manual subscription functions
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

  // Helper functions
  const getSymbolPrice = useCallback((symbol: string): MarketDataTick | null => {
    return state.prices[symbol] || null;
  }, [state.prices]);

  const getSymbolsByCategory = useCallback((category: string): DerivSymbolInfo[] => {
    return state.activeSymbols.filter(symbol => symbol.category === category);
  }, [state.activeSymbols]);

  const formatSymbolDisplay = useCallback((symbol: string): string => {
    if (symbol.startsWith('frx')) {
      return symbol.replace('frx', '').replace(/(\w{3})(\w{3})/, '$1/$2');
    }
    if (symbol.startsWith('cry')) {
      return symbol.replace('cry', '').replace(/(\w{3})(\w{3})/, '$1/$2');
    }
    return symbol;
  }, []);

  // Connection effect with stable dependencies
  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      connect();
    } else {
      cleanup();
    }

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [enabled, connect, cleanup]);

  // Auto-subscribe effect
  useEffect(() => {
    if (state.isConnected && autoSubscribeSymbols.length > 0) {
      subscribeToSymbols(autoSubscribeSymbols);
    }
  }, [state.isConnected, autoSubscribeSymbols, subscribeToSymbols]);

  return {
    // State
    ...state,
    
    // Actions
    connect,
    disconnect: cleanup,
    subscribeToSymbols,
    unsubscribeFromSymbols,
    
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