/**
 * API Configuration
 *
 * QUAN TRỌNG: Thay YOUR_IP bằng IP máy tính thật
 * Chạy: ipconfig → Tìm IPv4 Address
 * Ví dụ: http://192.168.1.100:8000
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://YOUR_IP:8000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,

  // Diagnosis (bao gồm cả lịch sử chẩn đoán)
  DIAGNOSIS_UPLOAD: `${API_BASE_URL}/api/diagnosis/upload-image`,
  DIAGNOSIS_PREDICT: `${API_BASE_URL}/api/diagnosis/predict`,
  DIAGNOSIS_LIST: `${API_BASE_URL}/api/diagnosis`,
  DIAGNOSIS_DETAIL: (id: string) => `${API_BASE_URL}/api/diagnosis/${id}`,
  DIAGNOSIS_DELETE: (id: string) => `${API_BASE_URL}/api/diagnosis/${id}`,
  DIAGNOSIS_DELETE_ALL: `${API_BASE_URL}/api/diagnosis`,
  DIAGNOSIS_STATISTICS: `${API_BASE_URL}/api/diagnosis/statistics`,
  DIAGNOSIS_DISEASE_INFO: (id: string) => `${API_BASE_URL}/api/diagnosis/diseases/${id}`,
  DIAGNOSIS_SUPPORTED_DISEASES: `${API_BASE_URL}/api/diagnosis/supported-diseases`,

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
