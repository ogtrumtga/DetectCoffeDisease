/**
 * Comment List Component
 * Danh sách comments với post detail header
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View
} from 'react-native';
import { Comment, CommunityPost } from '../models';
import { commentStyles } from '../styles';
import { CommunityColors } from '../design-system';
import { CommentItem } from './CommentItem';
import { PostContent } from './PostContent';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';

interface CommentListProps {
  post: CommunityPost;
  comments: Comment[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (comment: Comment) => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onImagePress?: (imageUrl: string) => void;
  targetCommentId?: string;
  shouldHighlight?: boolean;
}

export function CommentList({
  post,
  comments,
  loading,
  refreshing,
  onRefresh,
  onLoadMore,
  onLikeComment,
  onReplyComment,
  onLike,
  onComment,
  onShare,
  onImagePress,
  targetCommentId,
  shouldHighlight
}: CommentListProps) {
  const flatListRef = useRef<FlatList>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  // Scroll đến comment khi có targetCommentId
  useEffect(() => {
    console.log('CommentList - targetCommentId:', targetCommentId);
    console.log('CommentList - comments length:', comments.length);
    console.log('CommentList - loading:', loading);
    
    if (targetCommentId && comments.length > 0 && !loading) {
      // Tìm comment hoặc reply
      let commentIndex = -1;
      let foundCommentId: string | null = null;
      
      // Tìm trong main comments
      commentIndex = comments.findIndex(c => c.id === targetCommentId);
      console.log('Found in main comments at index:', commentIndex);
      
      if (commentIndex !== -1) {
        foundCommentId = targetCommentId;
      } else {
        // Tìm trong replies
        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];
          if (comment.replies && comment.replies.length > 0) {
            const replyFound = comment.replies.find(r => r.id === targetCommentId);
            if (replyFound) {
              commentIndex = i; // Scroll đến parent comment
              foundCommentId = targetCommentId; // Nhưng highlight reply
              console.log('Found in replies at parent index:', i);
              break;
            }
          }
        }
      }
      
      if (commentIndex !== -1 && foundCommentId) {
        console.log('Scrolling to comment index:', commentIndex);
        
        // Delay để đảm bảo FlatList đã render xong
        setTimeout(() => {
          // Sử dụng scrollToOffset thay vì scrollToIndex để reliable hơn
          // Ước tính mỗi comment cao khoảng 150px (tăng lên để chắc chắn)
          const estimatedOffset = commentIndex * 150;
          
          console.log('Scrolling to offset:', estimatedOffset);
          
          flatListRef.current?.scrollToOffset({
            offset: estimatedOffset,
            animated: true
          });

          // Highlight comment nếu cần
          if (shouldHighlight) {
            console.log('Highlighting comment:', foundCommentId);
            setHighlightedCommentId(foundCommentId);
            // Tắt highlight sau 3 giây
            setTimeout(() => {
              setHighlightedCommentId(null);
            }, 3000);
          }
        }, 1000); // Tăng delay lên 1 giây
      } else {
        console.log('Comment not found!');
      }
    }
  }, [targetCommentId, comments, loading, shouldHighlight]);

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      onLike={onLikeComment}
      onReply={onReplyComment}
      highlightedCommentId={highlightedCommentId}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Post Content */}
      <PostContent
        title={post.title}
        content={post.content}
        image={post.image}
        isDetailView={true}
        onImagePress={onImagePress}
      />

      {/* Post Header */}
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        isDetailView={true}
      />

      {/* Post Actions */}
      <PostActions
        likes={post.likes}
        comments={post.comments}
        isLiked={post.isLiked}
        isDetailView={true}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={commentStyles.commentEmptyContainer}>
      <Text style={commentStyles.commentEmptyText}>
        Chưa có bình luận nào
      </Text>
      <Text style={commentStyles.commentEmptySubtext}>
        Hãy là người đầu tiên bình luận!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={commentStyles.commentFooterLoader}>
        <ActivityIndicator size="small" color={CommunityColors.likeButton} />
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item: Comment) => item.id}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={CommunityColors.likeButton}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={!loading ? renderEmptyState : null}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        comments.length === 0 
          ? commentStyles.commentListEmpty 
          : commentStyles.commentListContent
      }
      onScrollToIndexFailed={(info) => {
        // Fallback nếu scroll fail
        console.log('Scroll to index failed:', info);
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true
          });
        }, 100);
      }}
    />
  );
}