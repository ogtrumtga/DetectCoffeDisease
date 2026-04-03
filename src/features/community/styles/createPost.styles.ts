/**
 * Create Post Styles
 * Styles cho màn hình tạo post
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

export const createPostStyles = StyleSheet.create({
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
    backgroundColor: '#DAF1DE', // Màu xanh nhạt cho header tạo câu hỏi
    borderBottomWidth: 1,
    borderBottomColor: CommunityColors.borderLight,
    position: 'relative',
  },

  closeButton: {
    padding: Paddings.sm,
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

  submitButton: {
    paddingHorizontal: Paddings.lg,
    paddingVertical: Paddings.sm,
    zIndex: 1,
  },

  submitButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    color: CommunityColors.likeButton,
  },

  // Content styles
  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: Paddings.lg,
    paddingBottom: 100, // Extra space for keyboard
  },

  // Image picker styles
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CommunityColors.cardBackground,
    borderWidth: 2,
    borderColor: CommunityColors.borderLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Margins.xxl,
  },

  imageContainer: {
    position: 'relative',
    marginBottom: Margins.xxl,
  },

  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.community.image,
    backgroundColor: CommunityColors.borderLight,
  },

  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input styles
  inputSection: {
    marginBottom: Margins.xxl,
  },

  inputLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    color: CommunityColors.titleText,
    marginBottom: Margins.sm,
  },

  titleInput: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.community.input,
    borderWidth: 1,
    borderColor: CommunityColors.borderLight,
    padding: Paddings.md,
    fontSize: FontSizes.body,
    color: CommunityColors.titleText,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
  },

  descriptionInput: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.community.input,
    borderWidth: 1,
    borderColor: CommunityColors.borderLight,
    padding: Paddings.md,
    fontSize: FontSizes.body,
    color: CommunityColors.titleText,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
  },

  characterCount: {
    fontSize: FontSizes.caption,
    color: CommunityColors.captionText,
    textAlign: 'right',
    marginTop: 4,
  },
});