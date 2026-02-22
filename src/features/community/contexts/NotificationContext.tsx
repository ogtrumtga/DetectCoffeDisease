/**
 * Notification Context
 * Context để share unread notification count giữa các màn hình
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationService } from '../services';

// Tạo simple event emitter cho React Native
class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(...args));
  }
}

// Tạo event emitter cho notification events
const notificationEmitter = new SimpleEventEmitter();

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count khi app khởi động
  useEffect(() => {
    refreshUnreadCount();
    
    // Auto refresh mỗi 30 giây
    const interval = setInterval(refreshUnreadCount, 30000);
    
    // Lắng nghe event khi có notification mới
    const handleNotificationCreated = () => {
      refreshUnreadCount();
    };
    
    // Lắng nghe event khi đánh dấu đã đọc
    const handleNotificationRead = () => {
      refreshUnreadCount();
    };
    
    notificationEmitter.on('notification-created', handleNotificationCreated);
    notificationEmitter.on('notification-read', handleNotificationRead);
    
    return () => {
      clearInterval(interval);
      notificationEmitter.off('notification-created', handleNotificationCreated);
      notificationEmitter.off('notification-read', handleNotificationRead);
    };
  }, []);

  const refreshUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  };

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        incrementUnreadCount,
        decrementUnreadCount,
        resetUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}

// Export emitter để các service có thể emit events
export { notificationEmitter };
