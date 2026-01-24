// Types cho Community feature
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image?: string; // Thêm field cho hình ảnh
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  tags?: string[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string; // null = top-level comment, có giá trị = reply
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
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

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: string; // Thêm field cho hình ảnh
  tags?: string[];
}

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}