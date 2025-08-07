import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface WebSocketNotificationsState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  notifications: any[];
}

interface UseWebSocketNotificationsOptions {
  enabled?: boolean;
}

export function useWebSocketNotifications(
  options: UseWebSocketNotificationsOptions = {}
) {
  const { enabled = true } = options;
  const { data: session, status } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const [state, setState] = useState<WebSocketNotificationsState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    notifications: [],
  });

  const connect = () => {
    // Don't connect if session is still loading or user is not authenticated
    if (status === 'loading' || !session?.accessToken || !enabled) return;

    // Prevent multiple simultaneous connection attempts
    if (state.isConnecting || state.isConnected) return;

    // Stop if we've exceeded max reconnection attempts
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('🚫 Max WebSocket reconnection attempts reached');
      setState(prev => ({ 
        ...prev, 
        error: 'Maximum reconnection attempts exceeded',
        isConnecting: false 
      }));
      return;
    }

    try {
      // Use pure WebSocket instead of Socket.IO to avoid URL placeholder issues
      const wsUrl = `ws://localhost:3002/ws/notifications?token=${session.accessToken}`;
      
      console.log('🔗 Connecting to WebSocket:', wsUrl, 'Attempt:', reconnectAttempts.current + 1);
      
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        reconnectAttempts.current = 0; // Reset attempts on successful connection
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false,
          error: null 
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 WebSocket message received:', data);
          
          if (data.type === 'notification') {
            setState(prev => ({
              ...prev,
              notifications: [data.notification, ...prev.notifications.slice(0, 49)]
            }));
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'WebSocket connection error',
          isConnecting: false 
        }));
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false 
        }));
        
        // Auto-reconnect with exponential backoff, but only if enabled and authenticated
        if (enabled && session?.accessToken && status === 'authenticated') {
          reconnectAttempts.current++;
          const delay = Math.min(3000 * Math.pow(2, reconnectAttempts.current - 1), 30000); // Max 30 seconds
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting WebSocket reconnection...');
            connect();
          }, delay);
        }
      };

    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to establish WebSocket connection',
        isConnecting: false 
      }));
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    reconnectAttempts.current = 0;
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isConnecting: false 
    }));
  };

  useEffect(() => {
    // Only connect when session is authenticated and stable
    if (enabled && status === 'authenticated' && session?.accessToken) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, status, session?.accessToken]); // Depend on status instead of just session

  return {
    ...state,
    connect,
    disconnect,
  };
} 