/**
 * Community Feed Component
 * Hiển thị danh sách posts trong feed
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View
} from 'react-native';
import { CommunityPost } from '../models';
import { communityStyles } from '../styles';
import { CommunityColors } from '../design-system';
import { PostCard } from './PostCard';

interface CommunityFeedProps {
  posts: CommunityPost[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPostPress: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function CommunityFeed({
  posts,
  loading,
  refreshing,
  onRefresh,
  onLoadMore,
  onLike,
  onComment,
  onPostPress,
  onShare
}: CommunityFeedProps) {
  const renderPost = ({ item }: { item: CommunityPost }) => (
    <PostCard
      post={item}
      onLike={onLike}
      onComment={onComment}
      onPress={onPostPress}
      onShare={onShare}
    />
  );

  const renderEmptyState = () => (
    <View style={communityStyles.emptyContainer}>
      <Text style={communityStyles.emptyText}>
        Chưa có bài viết nào
      </Text>
      <Text style={communityStyles.emptySubtext}>
        Hãy là người đầu tiên chia sẻ câu hỏi!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={communityStyles.footerLoader}>
        <ActivityIndicator size="small" color={CommunityColors.likeButton} />
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
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
      contentContainerStyle={posts.length === 0 ? { flexGrow: 1 } : undefined}
    />
  );
}