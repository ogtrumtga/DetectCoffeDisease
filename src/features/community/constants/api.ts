/**
 * API Constants
 * Các hằng số liên quan đến API
 */

export const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com/api/v1',
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    // Posts
    POSTS: '/community/posts',
    POST_DETAIL: (id: string) => `/community/posts/${id}`,
    POST_LIKE: (id: string) => `/community/posts/${id}/like`,
    POST_SEARCH: '/community/posts/search',
    
    // Comments
    COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
    COMMENT_LIKE: (id: string) => `/community/comments/${id}/like`,
    
    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
    NOTIFICATION_READ_ALL: '/notifications/read-all',
    NOTIFICATION_DELETE: (id: string) => `/notifications/${id}`,
    NOTIFICATION_UNREAD_COUNT: '/notifications/unread-count',
  }
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  COMMENTS_PAGE_SIZE: 20,
  NOTIFICATIONS_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50
} as const;