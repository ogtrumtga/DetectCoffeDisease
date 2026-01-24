import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CommunityPost as PostType } from '@/services/community/types';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CommunityPost } from './CommunityPost';

interface CommunityFeedProps {
  posts: PostType[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPostPress: (postId: string) => void;
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
}: CommunityFeedProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderPost = ({ item }: { item: PostType }) => (
    <CommunityPost
      post={item}
      onLike={onLike}
      onComment={onComment}
      onPress={onPostPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: '#6B7280' }]}>
        Chưa có bài viết nào
      </Text>
      <Text style={[styles.emptySubtext, { color: '#9CA3AF' }]}>
        Hãy là người đầu tiên chia sẻ câu hỏi!
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

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
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
      contentContainerStyle={posts.length === 0 ? styles.emptyContentContainer : undefined}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyContentContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
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
});