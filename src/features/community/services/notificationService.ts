/**
 * Notification Service
 * API calls cho notifications
 */

import { auth } from '@/config/firebase';
import { API_ENDPOINTS } from '@/src/config/api';
import { fetchWithRetry } from '@/src/utils/fetchWithRetry';
import { notificationEmitter } from '../contexts/NotificationContext';
import { Notification, PaginatedResponse } from '../models';

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const notificationService = {
  // API: GET /api/notifications - Lấy danh sách notifications với phân trang
  /**
   * @param page - Số trang (mặc định: 1)
   * @param limit - Số items mỗi trang (mặc định: 20)
   * @returns PaginatedResponse<Notification>
   */
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Notification>> {
    try {
      const headers = await getAuthHeader();
      const response = await fetchWithRetry(`${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout: 15000,
        retries: 2,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result: any = await response.json();
      
      // Map backend data to frontend model
      const notifications: Notification[] = (result.data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        user: {
          id: item.user?.id || '',
          name: item.user?.name || 'Unknown',
          avatar: item.user?.avatar || '',
        },
        postId: item.postId,
        commentId: item.commentId,
        createdAt: item.createdAt,
        isRead: item.isRead || false,
        data: item.data,
      }));

      return {
        data: notifications,
        pagination: result.pagination || {
          page,
          limit,
          total: notifications.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Note: Notifications được tạo tự động từ backend khi có like/comment
  // Client không cần gọi createLikeNotification nữa
  async createLikeNotification(postId: string, postTitle: string, userName: string, userId: string): Promise<Notification> {
    console.log('[notificationService] Like notifications are created automatically by backend');
    // Backend sẽ tự động tạo notification khi user like post
    return {} as Notification;
  },

  async createCommentNotification(
    postId: string, 
    postTitle: string, 
    userName: string, 
    userId: string,
    commentId: string,
    commentContent: string
  ): Promise<Notification> {
    console.log('[notificationService] Comment notifications are created automatically by backend');
    return {} as Notification;
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
    console.log('[notificationService] Reply notifications are created automatically by backend');
    return {} as Notification;
  },

  // API: POST /api/notifications/{notificationId}/read - Đánh dấu notification đã đọc
  /**
   * @param notificationId - ID của notification
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      console.log('Marked notification as read:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // API: POST /api/notifications/mark-all-read - Đánh dấu tất cả notifications đã đọc
  async markAllAsRead(): Promise<void> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      console.log('Marked all notifications as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Note: Backend chưa có API xóa notification - giữ mock tạm thời
  async deleteNotification(notificationId: string): Promise<void> {
    console.log('[notificationService] Delete notification not implemented in backend yet');
    // TODO: Implement DELETE /api/notifications/{id} in backend
  },

  // Lấy số lượng notifications chưa đọc từ data đã fetch
  async getUnreadCount(): Promise<number> {
    try {
      // Fetch page 1 với limit nhỏ để đếm unread
      const result = await this.getNotifications(1, 50);
      const unreadCount = result.data.filter(n => !n.isRead).length;
      return unreadCount;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  async createReportNotification(
    reporterId: string,
    reporterName: string,
    reportedUserId: string,
    reportedUserName: string,
    commentId: string,
    commentContent: string,
    postId: string,
    reason?: string
  ): Promise<Notification> {
    console.log('[notificationService] Report notifications should be handled by backend/admin');
    // TODO: Implement report system in backend
    return {} as Notification;
  }
};
