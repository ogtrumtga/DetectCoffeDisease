/**
 * Post Styles
 * Styles cho các component liên quan đến Post
 */

import { StyleSheet } from 'react-native';
import { 
  CommunityColors, 
  Margins, 
  Paddings, 
  FontSizes, 
  FontWeights,
  BorderRadius,
  CommunityShadows,
  ComponentSizes
} from '../design-system';

export const postStyles = StyleSheet.create({
  // Post Card styles
  postCard: {
    marginHorizontal: Margins.lg, // Thêm lại margin 2 bên như mẫu
    marginBottom: Margins.lg, // Khoảng cách giữa các post
    borderRadius: BorderRadius.community.card, // Thêm lại border radius
    overflow: 'hidden',
    backgroundColor: CommunityColors.cardBackground,
    ...CommunityShadows.postCard,
  },

  postImage: {
    width: '100%',
    height: ComponentSizes.community.postImageHeight,
    backgroundColor: CommunityColors.borderLight,
    borderTopLeftRadius: BorderRadius.community.card,
    borderTopRightRadius: BorderRadius.community.card,
  },

  postDetailImage: {
    width: '100%',
    height: ComponentSizes.community.postDetailImageHeight,
    marginBottom: Margins.lg,
    backgroundColor: CommunityColors.borderLight,
  },

  postContent: {
    padding: Paddings.lg, // Đổi lại thành padding đều
  },

  postTextContent: {
    paddingHorizontal: Paddings.lg,
    paddingTop: Paddings.md,
  },

  // Header styles
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Margins.md,
    paddingLeft: Paddings.xs, // Thêm padding trái để avatar không sát mép
  },

  avatar: {
    width: ComponentSizes.avatar.lg,
    height: ComponentSizes.avatar.lg,
    borderRadius: ComponentSizes.avatar.lg / 2,
    backgroundColor: CommunityColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Margins.md,
  },

  avatarSmall: {
    width: ComponentSizes.avatar.md,
    height: ComponentSizes.avatar.md,
    borderRadius: ComponentSizes.avatar.md / 2,
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semiBold,
    marginBottom: 2,
    color: CommunityColors.linkText,
  },

  timeAgo: {
    fontSize: FontSizes.caption,
    color: CommunityColors.captionText,
  },

  // Content styles
  postTitle: {
    fontSize: FontSizes.postTitle,
    fontWeight: FontWeights.bold,
    marginBottom: Margins.sm,
    lineHeight: 24,
    color: CommunityColors.titleText,
  },

  postTitleDetail: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.bold,
    marginBottom: Margins.sm,
    lineHeight: 28,
    color: CommunityColors.titleText,
  },

  postDescription: {
    fontSize: FontSizes.postContent,
    lineHeight: 20,
    marginBottom: 4,
    color: CommunityColors.bodyText,
  },

  postDescriptionDetail: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    marginBottom: 4,
    color: CommunityColors.bodyText,
  },

  seeMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },

  seeMoreText: {
    fontSize: FontSizes.postContent,
    fontWeight: FontWeights.medium,
    textDecorationLine: 'underline',
    color: CommunityColors.bodyText,
  },

  seeMoreTextDetail: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    textDecorationLine: 'underline',
    color: CommunityColors.bodyText,
  },

  // Actions styles
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Margins.xxl,
    marginTop: Margins.md,
    paddingTop: Margins.sm,
  },

  postActionsDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Margins.xxl,
    paddingVertical: Margins.md,
    marginTop: Margins.lg,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Margins.xs + 2,
    paddingVertical: Margins.xs,
    paddingHorizontal: Margins.xs,
    minHeight: 32,
  },

  actionButtonDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Margins.sm,
    paddingVertical: Margins.sm,
    paddingHorizontal: Margins.sm,
    minHeight: 36,
  },

  actionText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: CommunityColors.captionText,
  },

  actionTextDetail: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: CommunityColors.captionText,
  },

  // Create Post Button (FAB)
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Paddings.xl,
    paddingVertical: Paddings.md,
    borderRadius: BorderRadius.community.button,
    backgroundColor: CommunityColors.likeButton,
    ...CommunityShadows.fab,
  },

  fabIcon: {
    marginRight: Margins.sm,
  },

  fabText: {
    color: CommunityColors.cardBackground,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
  },
});