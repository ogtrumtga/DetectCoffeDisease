/**
 * Swipeable Notification Item Component
 * Notification item với khả năng swipe để xóa
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Notification } from '../models';
import { NotificationItem } from './NotificationItem';

interface SwipeableNotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onDelete: (notificationId: string) => void;
}

export function SwipeableNotificationItem({ 
  notification, 
  onPress, 
  onDelete 
}: SwipeableNotificationItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    // Đóng swipeable trước khi xóa
    swipeableRef.current?.close();
    
    // Delay một chút để animation mượt hơn
    setTimeout(() => {
      onDelete(notification.id);
    }, 200);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View style={[styles.deleteButton, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.deleteButtonTouchable}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name="trash" 
              size={24} 
              color="#FFFFFF"
            />
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <NotificationItem 
        notification={notification} 
        onPress={onPress}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
