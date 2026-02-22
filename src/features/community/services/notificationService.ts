/**
 * Notification Service
 * API calls cho notifications
 */

import { Notification, PaginatedResponse } from '../models';
import { notificationEmitter } from '../contexts/NotificationContext';

// Mock data để test UI - bắt đầu với mảng rỗng
const mockNotifications: Notification[] = [];

// Helper để tạo notification ID unique
let notificationIdCounter = 1;

export const notificationService = {
  // API: GET /notifications - Lấy danh sách notifications với phân trang
  /**
   * @param page - Số trang (mặc định: 1)
   * @param limit - Số items mỗi trang (mặc định: 20)
   * @returns PaginatedResponse<Notification>
   */
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Notification>> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch notifications');
      // }
      // 
      // const result: ApiResponse<PaginatedResponse<Notification>> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          // Sắp xếp theo thời gian mới nhất
          const sortedNotifications = [...mockNotifications].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const paginatedNotifications = sortedNotifications.slice(startIndex, endIndex);
          
          resolve({
            data: paginatedNotifications,
            pagination: {
              page,
              limit,
              total: mockNotifications.length,
              totalPages: Math.ceil(mockNotifications.length / limit)
            }
          });
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // API: POST /notifications - Tạo notification mới khi có like (hoặc tự động từ server)
  /**
   * Note: Có thể được tạo tự động từ server-side thay vì client call
   * @param postId - ID của post
   * @param postTitle - Tiêu đề post
   * @param userName - Tên user thực hiện like
   * @param userId - ID user thực hiện like
   * @returns Notification
   */
  async createLikeNotification(postId: string, postTitle: string, userName: string, userId: string): Promise<Notification> {
    // TODO: Backend - Có thể implement API endpoint hoặc tạo tự động từ server
    // const response = await fetch(`${API_BASE_URL}/notifications`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({
    //     type: 'like',
    //     postId,
    //     targetUserId: 'post-author-id' // ID của user bị like post
    //   })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to create notification');
    // }
    // 
    // const result: ApiResponse<Notification> = await response.json();
    // return result.data;

    // Mock implementation
    const newNotification: Notification = {
      id: `notif-${notificationIdCounter++}`,
      type: 'like',
      title: 'Bài viết được thích',
      message: `${userName} đã thích bài viết của bạn`,
      user: {
        id: userId,
        name: userName,
        avatar: 'https://via.placeholder.com/40'
      },
      postId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    mockNotifications.unshift(newNotification);
    console.log('Created like notification:', newNotification);
    
    // Emit event để cập nhật badge
    notificationEmitter.emit('notification-created');
    
    return newNotification;
  },

  // API: POST /notifications - Tạo notification mới khi có comment (hoặc tự động từ server)
  /**
   * Note: Có thể được tạo tự động từ server-side thay vì client call
   * @param postId - ID của post
   * @param postTitle - Tiêu đề post
   * @param userName - Tên user thực hiện comment
   * @param userId - ID user thực hiện comment
   * @param commentId - ID của comment
   * @param commentContent - Nội dung comment
   * @returns Notification
   */
  async createCommentNotification(
    postId: string, 
    postTitle: string, 
    userName: string, 
    userId: string,
    commentId: string,
    commentContent: string
  ): Promise<Notification> {
    // TODO: Backend - Có thể implement API endpoint hoặc tạo tự động từ server
    // const response = await fetch(`${API_BASE_URL}/notifications`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({
    //     type: 'comment',
    //     postId,
    //     commentId,
    //     targetUserId: 'post-author-id' // ID của user bị comment vào post
    //   })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to create notification');
    // }
    // 
    // const result: ApiResponse<Notification> = await response.json();
    // return result.data;

    // Mock implementation
    const newNotification: Notification = {
      id: `notif-${notificationIdCounter++}`,
      type: 'comment',
      title: 'Bình luận mới',
      message: `${userName} đã bình luận: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
      user: {
        id: userId,
        name: userName,
        avatar: 'https://via.placeholder.com/40'
      },
      postId,
      commentId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    mockNotifications.unshift(newNotification);
    console.log('Created comment notification:', newNotification);
    
    // Emit event để cập nhật badge
    notificationEmitter.emit('notification-created');
    
    return newNotification;
  },

  // API: POST /notifications - Tạo notification mới khi có reply (hoặc tự động từ server)
  /**
   * Note: Có thể được tạo tự động từ server-side thay vì client call
   * @param postId - ID của post
   * @param userName - Tên user thực hiện reply
   * @param userId - ID user thực hiện reply
   * @param commentId - ID của comment bị reply
   * @param replyContent - Nội dung reply
   * @returns Notification
   */
  async createReplyNotification(
    postId: string,
    userName: string,
    userId: string,
    commentId: string,
    replyContent: string
  ): Promise<Notification> {
    // TODO: Backend - Có thể implement API endpoint hoặc tạo tự động từ server
    // const response = await fetch(`${API_BASE_URL}/notifications`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({
    //     type: 'reply',
    //     postId,
    //     commentId,
    //     targetUserId: 'comment-author-id' // ID của user bị reply comment
    //   })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to create notification');
    // }
    // 
    // const result: ApiResponse<Notification> = await response.json();
    // return result.data;

    // Mock implementation
    const newNotification: Notification = {
      id: `notif-${notificationIdCounter++}`,
      type: 'reply',
      title: 'Phản hồi mới',
      message: `${userName} đã phản hồi bình luận của bạn: "${replyContent.substring(0, 50)}${replyContent.length > 50 ? '...' : ''}"`,
      user: {
        id: userId,
        name: userName,
        avatar: 'https://via.placeholder.com/40'
      },
      postId,
      commentId,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    mockNotifications.unshift(newNotification);
    console.log('Created reply notification:', newNotification);
    
    // Emit event để cập nhật badge
    notificationEmitter.emit('notification-created');
    
    return newNotification;
  },

  // API: PUT /notifications/{notificationId}/read - Đánh dấu notification đã đọc
  /**
   * @param notificationId - ID của notification
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to mark notification as read');
      // }

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const notification = mockNotifications.find(n => n.id === notificationId);
          if (notification) {
            notification.isRead = true;
            console.log('Marked notification as read:', notificationId);
          }
          resolve();
        }, 200);
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // API: PUT /notifications/read-all - Đánh dấu tất cả notifications đã đọc
  async markAllAsRead(): Promise<void> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to mark all notifications as read');
      // }

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          mockNotifications.forEach(notification => {
            notification.isRead = true;
          });
          console.log('Marked all notifications as read');
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // API: DELETE /notifications/{notificationId} - Xóa notification
  /**
   * @param notificationId - ID của notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to delete notification');
      // }

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockNotifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            mockNotifications.splice(index, 1);
            console.log('Deleted notification:', notificationId);
          }
          resolve();
        }, 200);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // API: GET /notifications/unread-count - Lấy số lượng notifications chưa đọc
  /**
   * @returns number
   */
  async getUnreadCount(): Promise<number> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to get unread count');
      // }
      // 
      // const result: ApiResponse<{ count: number }> = await response.json();
      // return result.data.count;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const unreadCount = mockNotifications.filter(n => !n.isRead).length;
          resolve(unreadCount);
        }, 100);
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
};