import { api } from './api';
import { Notification, NotificationsResponse } from '../types/notification';

export async function getNotifications(options?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}): Promise<NotificationsResponse> {
  const params = new URLSearchParams();
  
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());
  if (options?.unreadOnly) params.append('unreadOnly', 'true');

  const response = await api.get(`/notifications?${params}`);
  return response.data;
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const response = await api.get('/notifications/unread-count');
  return response.data;
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
}

export async function markAllAsRead(): Promise<{ message: string }> {
  const response = await api.patch('/notifications/mark-all-read');
  return response.data;
}

export async function deleteNotification(notificationId: string): Promise<{ message: string }> {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
} 