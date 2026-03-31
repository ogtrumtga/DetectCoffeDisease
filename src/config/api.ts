/**
 * API Configuration
 * 
 * QUAN TRỌNG: Thay YOUR_IP bằng IP máy tính thật
 * Chạy: ipconfig → Tìm IPv4 Address
 * 
 * Ví dụ: http://192.168.1.100:8000
 */

// Thay YOUR_IP bằng IP máy tính của bạn
const API_BASE_URL = 'http://YOUR_IP:8000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // History
  HISTORY: `${API_BASE_URL}/api/history`,
  HISTORY_DETAIL: (id: string) => `${API_BASE_URL}/api/history/${id}`,
  
  // Community
  POSTS: `${API_BASE_URL}/api/community/posts`,
  POST_DETAIL: (id: string) => `${API_BASE_URL}/api/community/posts/${id}`,
  POST_LIKE: (id: string) => `${API_BASE_URL}/api/community/posts/${id}/like`,
  POST_COMMENTS: (id: string) => `${API_BASE_URL}/api/community/posts/${id}/comments`,
  POSTS_SEARCH: `${API_BASE_URL}/api/community/posts/search`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  NOTIFICATION_READ: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,
  NOTIFICATIONS_MARK_ALL_READ: `${API_BASE_URL}/api/notifications/mark-all-read`,
};

export default API_BASE_URL;
