export enum NotificationType {
  SIGNAL_CREATED = 'signal_created',
  SIGNAL_CLOSED = 'signal_closed',
  SUBSCRIPTION_APPROVED = 'subscription_approved',
  SUBSCRIPTION_REJECTED = 'subscription_rejected',
  CHALLENGE_APPROVED = 'challenge_approved',
  CHALLENGE_REJECTED = 'challenge_rejected',
  ACCOUNT_UPDATED = 'account_updated',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  metadata?: Record<string, any>;
  actionUrl?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
} 