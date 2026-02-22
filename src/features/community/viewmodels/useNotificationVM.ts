/**
 * Notification ViewModel
 * Logic cho màn hình notifications
 */

import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Notification } from '../models';
import { notificationService } from '../services';
import { notificationEmitter } from '../contexts/NotificationContext';

export const useNotificationVM = () => {
  // State management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications khi component mount
  useEffect(() => {
    loadNotifications(true);
    loadUnreadCount();
  }, []);

  const loadNotifications = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await notificationService.getNotifications(currentPage, 20);
      
      if (reset) {
        setNotifications(response.data);
        setPage(2);
      } else {
        setNotifications(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Lỗi', 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await Promise.all([
      loadNotifications(true),
      loadUnreadCount()
    ]);
    setRefreshing(false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadNotifications(false);
    }
  }, [hasMore, loading]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Emit event để cập nhật context
      notificationEmitter.emit('notification-read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Lỗi', 'Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
      
      // Reset unread count
      setUnreadCount(0);
      
      // Emit event để cập nhật context
      notificationEmitter.emit('notification-read');
      
      Alert.alert('Thành công', 'Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Lỗi', 'Không thể đánh dấu tất cả đã đọc');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count if deleted notification was unread
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        // Emit event để cập nhật context
        notificationEmitter.emit('notification-read');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Lỗi', 'Không thể xóa thông báo');
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    // This will be handled in the View layer
    return {
      type: notification.type,
      postId: notification.postId,
      commentId: notification.commentId
    };
  };

  return {
    // State
    notifications,
    loading,
    refreshing,
    hasMore,
    unreadCount,

    // Actions
    handleRefresh,
    handleLoadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleNotificationPress,
    loadUnreadCount
  };
};