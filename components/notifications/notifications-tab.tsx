"use client"

import { useState } from 'react';
import { Bell, Check, CheckCircle, X, ExternalLink, AlertCircle, Info, TrendingUp, UserCheck, RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import { getNotifications } from '@/lib/notifications-api';
import { Notification, NotificationType, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow, format } from 'date-fns';

const ITEMS_PER_PAGE = 20;

interface NotificationsTabProps {
  className?: string;
}

export function NotificationsTab({ className }: NotificationsTabProps) {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    lastFetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications({
    enableRealTime: true,
    pollingInterval: 15000,
    enableWebSocket: false, // Disabled - using dedicated useWebSocketNotifications hook instead
  });

  // Use notifications from hook and merge with loaded pages
  const displayNotifications = allNotifications.length > 0 ? allNotifications : notifications;

  const loadMoreNotifications = async () => {
    setIsLoadingMore(true);
    try {
      const response = await getNotifications({ 
        offset: currentPage * 20, 
        limit: 20,
        unreadOnly: filterStatus === 'unread' ? true : undefined,
      });
      
      setAllNotifications(prev => [...prev, ...response.notifications]);
      setCurrentPage(prev => prev + 1);
      setHasMore(response.notifications.length === 20);
    } catch (error) {
      console.error('Failed to load more notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load more notifications',
        description: 'Please try again.',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFilterChange = async () => {
    setAllNotifications([]);
    setCurrentPage(1);
    setHasMore(true);
    
    try {
      const response = await getNotifications({ 
        offset: 0, 
        limit: 20,
        unreadOnly: filterStatus === 'unread' ? true : undefined,
      });
      
      setAllNotifications(response.notifications);
      setHasMore(response.notifications.length === 20);
    } catch (error) {
      console.error('Failed to filter notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to filter notifications',
        description: 'Please try again.',
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      toast({
        title: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to mark notification as read',
        description: 'Please try again.',
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('http')) {
        window.open(notification.actionUrl, '_blank');
      } else {
        window.location.href = notification.actionUrl;
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      if (allNotifications.length > 0) {
        setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
      toast({
        title: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to mark notifications as read',
        description: 'Please try again.',
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      if (allNotifications.length > 0) {
        setAllNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
      toast({
        title: 'Notification deleted',
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete notification',
        description: 'Please try again.',
      });
    }
  };

  const handleRefresh = () => {
    setAllNotifications([]);
    setCurrentPage(1);
    setHasMore(true);
    refresh();
    toast({
      title: 'Refreshing notifications...',
    });
  };

  const getNotificationIcon = (type: NotificationType, priority: NotificationPriority) => {
    switch (type) {
      case NotificationType.SIGNAL_CREATED:
      case NotificationType.SIGNAL_CLOSED:
        return <TrendingUp className="h-5 w-5" />;
      case NotificationType.SUBSCRIPTION_APPROVED:
      case NotificationType.CHALLENGE_APPROVED:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case NotificationType.SUBSCRIPTION_REJECTED:
      case NotificationType.CHALLENGE_REJECTED:
        return <X className="h-5 w-5 text-red-600" />;
      case NotificationType.ACCOUNT_UPDATED:
        return <UserCheck className="h-5 w-5" />;
      case NotificationType.SYSTEM_ANNOUNCEMENT:
        return priority === NotificationPriority.URGENT ? 
          <AlertCircle className="h-5 w-5 text-red-600" /> : 
          <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'border-l-4 border-l-red-500';
      case NotificationPriority.HIGH:
        return 'border-l-4 border-l-orange-500';
      case NotificationPriority.MEDIUM:
        return 'border-l-4 border-l-blue-500';
      case NotificationPriority.LOW:
        return 'border-l-4 border-l-gray-500';
      default:
        return 'border-l-4 border-l-gray-500';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SIGNAL_CREATED:
        return 'Signal Created';
      case NotificationType.SIGNAL_CLOSED:
        return 'Signal Closed';
      case NotificationType.SUBSCRIPTION_APPROVED:
        return 'Subscription Approved';
      case NotificationType.SUBSCRIPTION_REJECTED:
        return 'Subscription Rejected';
      case NotificationType.CHALLENGE_APPROVED:
        return 'Challenge Approved';
      case NotificationType.CHALLENGE_REJECTED:
        return 'Challenge Rejected';
      case NotificationType.ACCOUNT_UPDATED:
        return 'Account Updated';
      case NotificationType.SYSTEM_ANNOUNCEMENT:
        return 'System Announcement';
      default:
        return 'Notification';
    }
  };

  const totalPages = Math.ceil(allNotifications.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest activities and announcements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          )}
          
          <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <Separator />
              <SelectItem value={NotificationType.SIGNAL_CREATED}>Trading Signals</SelectItem>
              <SelectItem value={NotificationType.SUBSCRIPTION_APPROVED}>Subscriptions</SelectItem>
              <SelectItem value={NotificationType.CHALLENGE_APPROVED}>Challenges</SelectItem>
              <SelectItem value={NotificationType.SYSTEM_ANNOUNCEMENT}>Announcements</SelectItem>
            </SelectContent>
          </Select>
          
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {filterType === 'unread' ? 
                "You're all caught up! No unread notifications." :
                "We'll notify you here when there are updates to your account, new signals, or important announcements."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md group ${
                !notification.isRead ? 'bg-blue-50/50' : ''
              } ${getPriorityColor(notification.priority)}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    notification.priority === NotificationPriority.URGENT ? 'bg-red-100' :
                    notification.priority === NotificationPriority.HIGH ? 'bg-orange-100' :
                    notification.priority === NotificationPriority.MEDIUM ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{format(new Date(notification.createdAt), 'MMM dd, yyyy')}</span>
                          <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {notification.priority === NotificationPriority.URGENT && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        
                        {notification.actionUrl && (
                          <div className="flex items-center gap-1 mt-3 text-blue-600">
                            <ExternalLink className="h-4 w-4" />
                            <span className="text-sm font-medium">Click to view details</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allNotifications.length)} of {allNotifications.length} notifications
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 