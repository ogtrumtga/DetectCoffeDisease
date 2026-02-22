/**
 * Notification Item Component
 * Hiển thị một notification
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Notification } from '../models';
import { notificationStyles } from '../styles';
import { CommunityColors, ComponentSizes } from '../design-system';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const [timeAgo, setTimeAgo] = useState('');

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
  };

  // Cập nhật thời gian khi component mount và mỗi phút
  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatTimeAgo(notification.createdAt));
    };

    // Cập nhật ngay lập tức
    updateTime();

    // Cập nhật mỗi 60 giây
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [notification.createdAt]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return 'heart.fill';
      case 'comment':
        return 'bubble.left.fill';
      case 'reply':
        return 'arrowshape.turn.up.left.fill';
      case 'mention':
        return 'at';
      case 'follow':
        return 'person.badge.plus';
      default:
        return 'bell.fill';
    }
  };

  const handlePress = () => {
    onPress(notification);
  };

  return (
    <TouchableOpacity
      style={[
        notificationStyles.notificationItem,
        !notification.isRead && notificationStyles.notificationItemUnread
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={notificationStyles.notificationAvatar}>
        {notification.user?.avatar ? (
          <IconSymbol 
            name="person.fill" 
            size={ComponentSizes.icon.md} 
            color={CommunityColors.captionText}
          />
        ) : (
          <IconSymbol 
            name={getNotificationIcon(notification.type)} 
            size={ComponentSizes.icon.md} 
            color={CommunityColors.likeButton}
          />
        )}
      </View>

      {/* Content */}
      <View style={notificationStyles.notificationContent}>
        <Text style={notificationStyles.notificationTitle}>
          {notification.title}
        </Text>
        <Text style={notificationStyles.notificationMessage}>
          {notification.message}
        </Text>
        <Text style={notificationStyles.notificationTime}>
          {timeAgo}
        </Text>
      </View>

      {/* Unread indicator */}
      {!notification.isRead && (
        <View style={notificationStyles.notificationUnreadDot} />
      )}
    </TouchableOpacity>
  );
}