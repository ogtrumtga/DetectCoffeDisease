/**
 * Community Styles
 * Styles cho màn hình Community chính
 */

import { StyleSheet } from 'react-native';
import { 
  CommunityColors, 
  Margins, 
  Paddings, 
  FontSizes, 
  FontWeights,
  BorderRadius,
  CommunityShadows
} from '../design-system';

export const communityStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: CommunityColors.screenBackground,
  },
  
  content: {
    flex: 1,
  },

  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.lg,
    backgroundColor: CommunityColors.screenBackground, // Giữ màu như cũ cho trang cộng đồng
    gap: Margins.md,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.community.button,
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.md,
    backgroundColor: CommunityColors.inputBackground,
    ...CommunityShadows.input,
  },

  searchIcon: {
    marginRight: Margins.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: FontSizes.body,
    color: CommunityColors.titleText,
    paddingVertical: 0, // Loại bỏ padding mặc định
  },

  notificationButton: {
    padding: Paddings.md,
    borderRadius: BorderRadius.community.button,
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: CommunityColors.notificationBadge,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Paddings.xs + 2,
  },

  badgeText: {
    color: CommunityColors.cardBackground,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semiBold,
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