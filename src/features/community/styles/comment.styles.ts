/**
 * Comment Styles
 * Styles cho các component liên quan đến Comment
 */

import { StyleSheet } from 'react-native';
import { 
  CommunityColors, 
  Margins, 
  Paddings, 
  FontSizes, 
  FontWeights,
  BorderRadius,
  ComponentSizes,
  CommunityShadows
} from '../design-system';

export const commentStyles = StyleSheet.create({
  // Comment Item styles
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    alignItems: 'flex-start',
  },

  commentHighlighted: {
    backgroundColor: CommunityColors.likeButton + '15', // 15% opacity màu xanh
  },

  replyContainer: {
    paddingLeft: ComponentSizes.community.commentIndent,
    position: 'relative',
    backgroundColor: CommunityColors.replyBackground,
  },

  replyLine: {
    position: 'absolute',
    left: 40,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: CommunityColors.borderMedium,
  },

  commentAvatar: {
    width: ComponentSizes.avatar.md,
    height: ComponentSizes.avatar.md,
    borderRadius: ComponentSizes.avatar.md / 2,
    backgroundColor: CommunityColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Margins.md,
  },
  commentAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },

  replyAvatar: {
    width: ComponentSizes.avatar.sm,
    height: ComponentSizes.avatar.sm,
    borderRadius: ComponentSizes.avatar.sm / 2,
  },

  commentContent: {
    flex: 1,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: Margins.sm,
  },

  commentAuthorName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semiBold,
    color: CommunityColors.linkText,
  },

  commentTimeAgo: {
    fontSize: FontSizes.caption,
    color: CommunityColors.captionText,
  },

  commentText: {
    fontSize: FontSizes.bodySmall,
    lineHeight: 20,
    marginBottom: Margins.sm,
    color: CommunityColors.titleText,
  },

  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Margins.lg,
  },

  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  commentActionIcon: {
    marginRight: 2,
  },

  commentActionText: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    color: CommunityColors.captionText,
  },

  repliesContainer: {
    marginTop: 4,
  },

  mainCommentSeparator: {
    height: 1,
    backgroundColor: CommunityColors.borderLight,
    marginLeft: ComponentSizes.community.commentIndent,
    marginTop: Margins.md,
    marginBottom: 4,
  },

  // Comment Input styles
  commentInputContainer: {
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    borderTopWidth: 1,
    borderTopColor: CommunityColors.borderLight,
    backgroundColor: CommunityColors.cardBackground,
  },

  replyContext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Paddings.md,
    paddingVertical: Paddings.sm,
    borderRadius: BorderRadius.community.input,
    marginBottom: Margins.sm,
    backgroundColor: CommunityColors.borderLight,
  },

  replyText: {
    fontSize: FontSizes.bodySmall,
    fontStyle: 'italic',
    color: CommunityColors.bodyText,
  },

  cancelReply: {
    padding: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: BorderRadius.community.button,
    borderWidth: 1,
    borderColor: CommunityColors.borderLight,
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.sm,
    minHeight: 44,
    backgroundColor: CommunityColors.cardBackground,
  },

  cameraButton: {
    padding: Paddings.sm,
    marginRight: Margins.sm,
  },

  commentTextInput: {
    flex: 1,
    fontSize: FontSizes.body,
    maxHeight: 100,
    paddingVertical: Paddings.sm,
    color: CommunityColors.titleText,
  },

  sendButton: {
    padding: Paddings.sm,
    marginLeft: Margins.sm,
  },

  // Comment List styles
  commentListContent: {
    paddingBottom: Paddings.xl,
  },

  commentListEmpty: {
    flexGrow: 1,
  },

  commentEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Paddings.xxxl,
    paddingVertical: 60,
  },

  commentEmptyText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    marginBottom: Margins.sm,
    textAlign: 'center',
    color: CommunityColors.bodyText,
  },

  commentEmptySubtext: {
    fontSize: FontSizes.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
    color: CommunityColors.captionText,
  },

  commentFooterLoader: {
    paddingVertical: Paddings.xl,
    alignItems: 'center',
  },
});