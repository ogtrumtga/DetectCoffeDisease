/**
 * Comment Service
 * API calls cho comments và replies
 */

import { Comment, CreateCommentRequest, PaginatedResponse } from '../models';

// Mock data để test UI
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    content: 'Tôi nghĩ bạn nên kiểm tra độ ẩm đất và ánh sáng. Có thể cây đang thiếu nước hoặc ánh sáng.',
    author: {
      id: 'user1',
      name: 'Minh Đức',
      avatar: 'https://via.placeholder.com/40'
    },
    createdAt: '2025-01-11T10:30:00Z',
    likes: 3,
    isLiked: false,
    replyCount: 1,
    replies: [
      {
        id: '2',
        postId: '1',
        parentId: '1',
        content: 'Cảm ơn bạn, mình sẽ thử xem!',
        author: {
          id: 'user2',
          name: 'Đăng Vinh',
          avatar: 'https://via.placeholder.com/40'
        },
        createdAt: '2025-01-11T11:00:00Z',
        likes: 1,
        isLiked: false,
        replyCount: 0
      }
    ]
  }
];

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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments?page=${page}&limit=${limit}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch comments');
      // }
      // 
      // const result: ApiResponse<PaginatedResponse<Comment>> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const postComments = mockComments.filter(comment => comment.postId === postId);
          resolve({
            data: postComments,
            pagination: {
              page,
              limit,
              total: postComments.length,
              totalPages: Math.ceil(postComments.length / limit)
            }
          });
        }, 300);
      });
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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts/${commentData.postId}/comments`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify({
      //     content: commentData.content,
      //     parentId: commentData.parentId
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create comment');
      // }
      // 
      // const result: ApiResponse<Comment> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const newComment: Comment = {
            id: Date.now().toString(),
            postId: commentData.postId,
            parentId: commentData.parentId,
            content: commentData.content,
            author: {
              id: 'current-user',
              name: 'Minh Đức',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            replyCount: 0
          };
          
          if (commentData.parentId) {
            // Đây là reply - thêm vào replies của parent comment
            const parentComment = mockComments.find(c => c.id === commentData.parentId);
            if (parentComment) {
              if (!parentComment.replies) parentComment.replies = [];
              parentComment.replies.push(newComment);
              parentComment.replyCount = (parentComment.replyCount || 0) + 1;
            }
          } else {
            // Đây là top-level comment
            mockComments.push(newComment);
          }
          
          console.log('Created comment:', newComment.id, 'for post:', commentData.postId);
          
          resolve(newComment);
        }, 500);
      });
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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/comments/${commentId}/like`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to toggle comment like');
      // }
      // 
      // const result: ApiResponse<{ isLiked: boolean; likesCount: number }> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const comment = mockComments.find(c => c.id === commentId);
          if (comment) {
            comment.isLiked = !comment.isLiked;
            comment.likes = (comment.likes || 0) + (comment.isLiked ? 1 : -1);
            resolve({
              isLiked: comment.isLiked,
              likesCount: comment.likes || 0
            });
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
};