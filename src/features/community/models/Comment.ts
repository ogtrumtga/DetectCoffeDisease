/**
 * Comment Model
 * Định nghĩa cấu trúc dữ liệu Comment
 */

import { User } from './User';

export interface Comment {
  id: string;
  postId: string;
  parentId?: string; // null = top-level comment, có giá trị = reply
  content: string;
  author: User;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[]; // Nested replies
  replyCount?: number; // Số lượng replies
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string; // Để tạo reply
}