/**
 * Post Detail Screen
 * Màn hình chi tiết post với comments
 */
// src/features/community/views/PostDetailScreen.tsx
import { SafeArea } from '@/components/SafeArea';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CommentInput, CommentList } from '../components';
import { CommunityColors } from '../design-system';
import { usePostDetailVM } from '../viewmodels';

// TODO: Lấy từ AuthContext khi có user authentication
const CURRENT_USER_ID = 'user-1';

export default function PostDetailScreen() {
  const params = useLocalSearchParams();
  const postId = params.postId as string;
  const targetCommentId = params.commentId as string;
  const shouldHighlight = params.highlightComment === 'true';
  
  console.log('PostDetailScreen - params:', params);
  console.log('PostDetailScreen - postId:', postId);
  console.log('PostDetailScreen - targetCommentId:', targetCommentId);
  console.log('PostDetailScreen - shouldHighlight:', shouldHighlight);
  
  // Parse initial post data if provided
  const initialPost = React.useMemo(() => {
    if (params.postData) {
      try {
        return JSON.parse(params.postData as string);
      } catch (error) {
        console.error('Error parsing post data:', error);
        return undefined;
      }
    }
    return undefined;
  }, [params.postData]);

  const {
    post,
    comments,
    loading,
    refreshing,
    commentLoading,
    hasMore,
    replyingTo,
    handleRefresh,
    handleLoadMore,
    handleLike,
    handleShare,
    handleSubmitComment,
    handleReplyComment,
    handleCancelReply,
    handleLikeComment
  } = usePostDetailVM({ postId, initialPost });

  const handleComment = () => {
    // Scroll to comment input or focus it
    // This is already handled by the UI layout
  };

  const handleImagePress = (imageUrl: string) => {
    // TODO: Implement full screen image viewer
    console.log('Open image viewer for:', imageUrl);
  };

  const onSubmitComment = async (content: string, parentId?: string) => {
    const result = await handleSubmitComment(content, parentId);
    if (result) {
      // Sync back to community screen với delay nhỏ để đảm bảo update hoàn tất
      setTimeout(() => {
        router.setParams({ 
          updatedPost: JSON.stringify(result)
        });
      }, 100);
    }
  };

  const onLike = async () => {
    const result = await handleLike();
    if (result) {
      // Sync back to community screen
      router.setParams({ 
        updatedPost: JSON.stringify(result)
      });
    }
  };

  if (!post) {
    return (
      <SafeArea style={styles.container}>
        <PostDetailHeader />
        <View style={styles.loadingContainer}>
          {/* Loading state */}
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea style={styles.container}>
      <PostDetailHeader />
      
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <CommentList
          post={post}
          comments={comments}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onLikeComment={handleLikeComment}
          onReplyComment={handleReplyComment}
          onLike={onLike}
          onComment={handleComment}
          onShare={handleShare}
          onImagePress={handleImagePress}
          targetCommentId={targetCommentId}
          shouldHighlight={shouldHighlight}
          currentUserId={CURRENT_USER_ID}
        />

        <CommentInput
          onSubmit={onSubmitComment}
          loading={commentLoading}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      </KeyboardAvoidingView>
    </SafeArea>
  );
}

// Post Detail Header Component
function PostDetailHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <IconSymbol 
          name="chevron.left" 
          size={24} 
          color={CommunityColors.titleText}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CommunityColors.screenBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CommunityColors.borderLight,
    backgroundColor: CommunityColors.cardBackground,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});