/**
 * Notification Model
 * Định nghĩa cấu trúc dữ liệu Notification
 */

import { User } from './User';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'reply' | 'mention' | 'follow' | 'report';
  title: string;
  message: string;
  user?: User; // Người thực hiện hành động
  postId?: string; // ID bài viết liên quan
  commentId?: string; // ID comment liên quan
  createdAt: string;
  isRead: boolean;
  data?: Record<string, any>; // Dữ liệu bổ sung (ví dụ: reportedUser, reportReason)
}