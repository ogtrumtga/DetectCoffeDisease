/**
 * Community Feature Colors
 * Màu sắc riêng cho tính năng Community
 */

import { BaseColors, SemanticColors } from './';

export const CommunityColors = {
  // Background Colors
  screenBackground: '#F8F9FA',
  cardBackground: BaseColors.white,
  headerBackground: BaseColors.white, // Đổi thành màu trắng
  inputBackground: BaseColors.white,
  replyBackground: '#FAFAFA',

  // Text Colors
  titleText: BaseColors.gray[900],
  bodyText: BaseColors.gray[700],
  captionText: BaseColors.gray[500],
  linkText: BaseColors.primary[500],
  authorName: BaseColors.primary[500],
  timeText: BaseColors.gray[500],

  // Action Colors
  likeButton: '#1800ad',
  likeButtonActive: '#FF6B6B',
  commentButton: BaseColors.gray[500],
  shareButton: BaseColors.gray[500],

  // Border Colors
  borderLight: '#E5E7EB',
  borderMedium: '#D1D5DB',
  borderDark: BaseColors.gray[400],

  // Status Colors
  success: SemanticColors.success[500],
  error: SemanticColors.error[500],
  warning: SemanticColors.warning[500],
  info: SemanticColors.info[500],

  // Notification Colors
  notificationBadge: SemanticColors.error[500],
  notificationBackground: BaseColors.white,

  // Shadow Colors
  shadowColor: BaseColors.black,
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)'
} as const;