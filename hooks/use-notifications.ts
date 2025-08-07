import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '@/lib/notifications-api';
import { Notification } from '@/types/notification';
import { useWebSocketNotifications } from './use-websocket-notifications';

interface UseNotificationsOptions {
  enableRealTime?: boolean;
  pollingInterval?: number;
  enableWebSocket?: boolean;
  maxRetries?: number;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  lastFetch: Date | null;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    enableRealTime = true,
    pollingInterval = 15000, // Default 15 seconds
    enableWebSocket = false, // Keep disabled - using the dedicated useWebSocketNotifications hook instead
    maxRetries = 3
  } = options;

  const { data: session } = useSession();
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isConnected: false,
    lastFetch: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isUnmountedRef = useRef(false);

  // WebSocket integration
  const {
    isConnected: wsConnected,
  } = useWebSocketNotifications({
    enabled: enableWebSocket,
  });

  // Adaptive polling based on user activity
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const fetchNotifications = useCallback(async (showLoading = false) => {
    if (!session?.accessToken || isUnmountedRef.current) return;

    if (showLoading) {
      setState(prev => ({ ...prev, isLoading: true }));
    }

    try {
      const [notificationsData, unreadData] = await Promise.all([
        getNotifications({ limit: 50 }),
        getUnreadCount(),
      ]);

      if (!isUnmountedRef.current) {
        setState(prev => ({
          ...prev,
          notifications: notificationsData.notifications,
          unreadCount: unreadData.count,
          isLoading: false,
          isConnected: enableWebSocket ? wsConnected : true,
          lastFetch: new Date(),
        }));
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      if (!isUnmountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isConnected: false,
        }));
        retryCountRef.current++;
      }
    }
  }, [session?.accessToken]);

  // Setup polling
  const startPolling = useCallback(() => {
    if (!enableRealTime || pollingRef.current) return;

    const poll = () => {
      // Adaptive polling based on user activity
      let interval = pollingInterval;
      
      if (!isVisible || !isActive) {
        interval = pollingInterval * 4; // Slow down when inactive
      }
      
      if (retryCountRef.current > 0) {
        interval = Math.min(pollingInterval * (retryCountRef.current + 1), 60000); // Max 1 minute
      }

      fetchNotifications();
      
      pollingRef.current = setTimeout(poll, interval);
    };

    poll();
  }, [enableRealTime, pollingInterval, isVisible, isActive, fetchNotifications]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Initialize connections
  useEffect(() => {
    if (!session?.accessToken) return;

    isUnmountedRef.current = false;
    
    // Initial fetch
    fetchNotifications(true);

    // Setup real-time updates - only use polling if WebSocket is disabled
    if (!enableWebSocket) {
      startPolling();
    }

    return () => {
      isUnmountedRef.current = true;
      stopPolling();
    };
  }, [session?.accessToken, enableWebSocket, startPolling, stopPolling, fetchNotifications]);

  // Restart polling when visibility/activity changes
  useEffect(() => {
    if (!enableWebSocket && enableRealTime) {
      stopPolling();
      startPolling();
    }
  }, [isVisible, isActive, enableWebSocket, enableRealTime, startPolling, stopPolling]);

  // API methods with optimistic updates
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call the API to mark notification as read
      await markAsRead(notificationId);

      // Update local state
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [markAsRead]);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call the API to mark all notifications as read
      await markAllAsRead();

      // Update local state
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [markAllAsRead]);

  const deleteNotificationById = useCallback(async (notificationId: string) => {
    const notification = state.notifications.find(n => n.id === notificationId);
    
    // Optimistic update
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId),
      unreadCount: notification && !notification.isRead 
        ? Math.max(0, prev.unreadCount - 1) 
        : prev.unreadCount,
    }));

    try {
      await deleteNotification(notificationId);
    } catch (error) {
      // Revert optimistic update on error
      if (notification) {
        setState(prev => ({
          ...prev,
          notifications: [...prev.notifications, notification].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
          unreadCount: !notification.isRead 
            ? prev.unreadCount + 1 
            : prev.unreadCount,
        }));
      }
      throw error;
    }
  }, [state.notifications]);

  const refresh = useCallback(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  return {
    ...state,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteNotificationById,
    refresh,
  };
} 