/**
 * Notification Styles
 * Styles cho màn hình notifications
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
  Elevation
} from '../design-system';

export const notificationStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: CommunityColors.screenBackground,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    backgroundColor: '#DAF1DE', // Màu xanh nhạt cho header thông báo
    borderBottomWidth: 1,
    borderBottomColor: CommunityColors.borderLight,
    position: 'relative',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  headerTitle: {
    fontSize: FontSizes.postTitle,
    fontWeight: FontWeights.semiBold,
    color: CommunityColors.titleText,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // Menu styles
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: Margins.lg,
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.md,
    minWidth: 260,
    paddingVertical: Paddings.xs,
    ...Elevation.level3,
    zIndex: 1000,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    gap: Margins.md,
  },

  menuItemText: {
    fontSize: FontSizes.body,
    color: CommunityColors.titleText,
  },

  menuSeparator: {
    height: 1,
    backgroundColor: CommunityColors.borderLight,
    marginVertical: Paddings.xs,
  },

  // Notification Item styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    backgroundColor: CommunityColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: CommunityColors.borderLight,
  },

  notificationItemUnread: {
    backgroundColor: CommunityColors.info + '10', // 10% opacity
  },

  notificationAvatar: {
    width: ComponentSizes.avatar.md,
    height: ComponentSizes.avatar.md,
    borderRadius: ComponentSizes.avatar.md / 2,
    backgroundColor: CommunityColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Margins.md,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semiBold,
    color: CommunityColors.titleText,
    marginBottom: 2,
  },

  notificationMessage: {
    fontSize: FontSizes.bodySmall,
    color: CommunityColors.bodyText,
    lineHeight: 18,
    marginBottom: 4,
  },

  notificationTime: {
    fontSize: FontSizes.caption,
    color: CommunityColors.captionText,
  },

  notificationUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CommunityColors.likeButton,
    marginLeft: Margins.sm,
    marginTop: 4,
  },

  // Swipeable styles
  swipeableContainer: {
    backgroundColor: CommunityColors.screenBackground,
  },

  deleteAction: {
    backgroundColor: CommunityColors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },

  markReadAction: {
    backgroundColor: CommunityColors.likeButton,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },

  swipeActionText: {
    color: CommunityColors.cardBackground,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    marginTop: 4,
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Paddings.xxxl,
  },

  emptyText: {
    fontSize: FontSizes.postTitle,
    fontWeight: FontWeights.semiBold,
    marginBottom: Margins.sm,
    textAlign: 'center',
    color: CommunityColors.bodyText,
  },

  emptySubtext: {
    fontSize: FontSizes.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
    color: CommunityColors.captionText,
  },

  // Loading styles
  footerLoader: {
    paddingVertical: Paddings.xl,
    alignItems: 'center',
  },
});