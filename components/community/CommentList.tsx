import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Comment, CommunityPost } from '@/services/community/types';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { CommentItem } from './CommentItem';
import { PostDetailContent } from './PostDetailContent';

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
}: CommentListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      onLike={onLikeComment}
      onReply={onReplyComment}
    />
  );

  const renderHeader = () => (
    <PostDetailContent
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: '#6B7280' }]}>
        Chưa có bình luận nào
      </Text>
      <Text style={[styles.emptySubtext, { color: '#9CA3AF' }]}>
        Hãy là người đầu tiên bình luận!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  };

  const renderSeparator = () => (
    <View style={[styles.separator, { backgroundColor: '#F3F4F6' }]} />
  );

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B82F6"
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={!loading ? renderEmptyState : null}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={comments.length === 0 ? styles.emptyContentContainer : styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    marginLeft: 64, // Align with comment content
    marginVertical: 8, // Thêm vertical margin
  },
});