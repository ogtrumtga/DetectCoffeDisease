/**
 * Post Model
 * Định nghĩa cấu trúc dữ liệu Post
 */

import { User } from './User';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  tags?: string[];
  isLiked?: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: string;
  tags?: string[];
}