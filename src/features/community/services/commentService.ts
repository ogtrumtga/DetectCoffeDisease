/**
 * Comment Service
 * API calls cho comments và replies
 */

import { auth } from '@/config/firebase';
import { API_ENDPOINTS } from '@/src/config/api';
import { fetchWithRetry } from '@/src/utils/fetchWithRetry';
import { Comment, CreateCommentRequest, PaginatedResponse } from '../models';

type BackendComment = {
  id: string;
  postId: string;
  parentId?: string;
  content: string;
  createdAt?: string;
  likes?: number;
  isLiked?: boolean;
  author?: {
    id?: string;
    displayName?: string;
    photoURL?: string;
  };
};

const toIso = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  return new Date(value).toISOString();
};

const mapComment = (item: BackendComment): Comment => ({
  id: item.id,
  postId: item.postId,
  parentId: item.parentId,
  content: item.content || '',
  author: {
    id: item.author?.id || '',
    name: item.author?.displayName || 'Unknown',
    avatar: item.author?.photoURL || '',
  },
  createdAt: toIso(item.createdAt),
  likes: item.likes || 0,
  isLiked: !!item.isLiked,
  replyCount: 0,
  replies: [],
});

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

const commentLikeState = new Map<string, { isLiked: boolean; likesCount: number }>();

export const commentService = {
  // API: GET /community/posts/{postId}/comments - Lấy danh sách comments của một post
  /**
   * @param postId - ID của post
   * @param page - Số trang (mặc định: 1)
   * @param limit - Số items mỗi trang (mặc định: 20)
   * @returns PaginatedResponse<Comment>
   */
  async getComments(postId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await fetchWithRetry(`${API_ENDPOINTS.POST_COMMENTS(postId)}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
        retries: 2,
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const result: any = await response.json();
      const mapped = (result.data || []).map((item: BackendComment) => mapComment(item));
      return {
        data: mapped,
        pagination: {
          page,
          limit,
          total: mapped.length,
          totalPages: mapped.length < limit ? page : page + 1,
        },
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // API: POST /community/posts/{postId}/comments - Tạo comment mới hoặc reply
  /**
   * @param commentData - Dữ liệu comment (postId, content, parentId)
   * @returns Comment
   */
  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    try {
      const headers = await getAuthHeader();
      const response = await fetchWithRetry(API_ENDPOINTS.POST_COMMENTS(commentData.postId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ content: commentData.content }),
        timeout: 15000,
        retries: 1,
      });
      if (!response.ok) throw new Error('Failed to create comment');

      // Backend hiện chưa hỗ trợ parentId và trả detail comment.
      // Sau khi tạo xong, trả về local optimistic comment để hiển thị ngay.
      const currentUser = auth.currentUser;
      return {
        id: Date.now().toString(),
        postId: commentData.postId,
        parentId: commentData.parentId,
        content: commentData.content,
        author: {
          id: currentUser?.uid || '',
          name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Bạn',
          avatar: currentUser?.photoURL || '',
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replyCount: 0,
        replies: [],
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // API: POST /community/comments/{commentId}/like - Like hoặc Unlike một comment
  /**
   * @param commentId - ID của comment
   * @returns { isLiked, likesCount }
   */
  async toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    try {
      // Backend hiện chưa có endpoint like comment, giữ local toggle cho UI.
      const current = commentLikeState.get(commentId) || { isLiked: false, likesCount: 0 };
      const next = {
        isLiked: !current.isLiked,
        likesCount: Math.max(0, current.likesCount + (current.isLiked ? -1 : 1)),
      };
      commentLikeState.set(commentId, next);
      return next;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
};