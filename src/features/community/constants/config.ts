/**
 * Feature Config
 * Cấu hình cho community feature
 */

export const COMMUNITY_CONFIG = {
  // UI Configuration
  POST_PREVIEW_LENGTH: 100, // Số ký tự hiển thị trước khi "Xem thêm"
  POST_DETAIL_PREVIEW_LENGTH: 200, // Số ký tự hiển thị trong detail view
  
  // Auto-refresh intervals (milliseconds)
  NOTIFICATION_REFRESH_INTERVAL: 30000, // 30 seconds
  POST_REFRESH_INTERVAL: 60000, // 1 minute
  
  // Image configuration
  IMAGE_QUALITY: 0.8,
  IMAGE_ASPECT_RATIO: [16, 9] as [number, number],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Animation durations (milliseconds)
  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  
  // Debounce delays (milliseconds)
  SEARCH_DEBOUNCE: 500,
  LIKE_DEBOUNCE: 300,
  
  // Retry configuration
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  REPLY: 'reply',
  MENTION: 'mention',
  FOLLOW: 'follow',
} as const;

export const POST_ACTIONS = {
  LIKE: 'like',
  COMMENT: 'comment',
  SHARE: 'share',
} as const;