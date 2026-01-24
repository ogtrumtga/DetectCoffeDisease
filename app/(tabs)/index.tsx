import { CommunityFeed } from '@/components/community/CommunityFeed';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CreatePostButton } from '@/components/community/CreatePostButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { communityAPI } from '@/services/community/communityAPI';
import { CommunityPost } from '@/services/community/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();

  // State management
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load posts khi component mount
  useEffect(() => {
    loadPosts(true);
  }, []);

  // Xử lý khi có trigger refresh từ create-post
  useEffect(() => {
    if (params.refresh) {
      loadPosts(true);
      // Clear params sau khi đã xử lý
      router.setParams({ refresh: undefined });
    }
  }, [params.refresh]);

  // Xử lý khi có cập nhật post từ post-detail
  useEffect(() => {
    if (params.updatedPost) {
      try {
        const updatedPost: CommunityPost = JSON.parse(params.updatedPost as string);
        console.log('Received updated post:', updatedPost.id, 'comments:', updatedPost.comments); // Debug log
        
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === updatedPost.id) {
              console.log('Updating post from', post.comments, 'to', updatedPost.comments); // Debug log
              return updatedPost;
            }
            return post;
          })
        );
        // Clear params sau khi đã xử lý
        router.setParams({ updatedPost: undefined });
      } catch (error) {
        console.error('Error parsing updated post:', error);
      }
    }
  }, [params.updatedPost]);

  // Search posts khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadPosts(true);
    }
  }, [searchQuery]);

  const loadPosts = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await communityAPI.getPosts(currentPage, 10);
      
      if (reset) {
        setPosts(response.data);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Lỗi', 'Không thể tải bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await loadPosts(true);
    setRefreshing(false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !searchQuery.trim()) {
      loadPosts(false);
    }
  }, [hasMore, loading, searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await communityAPI.searchPosts(searchQuery.trim());
      setPosts(results);
      setHasMore(false); // Không load more khi đang search
    } catch (error) {
      console.error('Error searching posts:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await communityAPI.toggleLike(postId);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: result.isLiked, likes: result.likesCount }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này.');
    }
  };

  const handleComment = (postId: string) => {
    const selectedPost = posts.find(p => p.id === postId);
    if (selectedPost) {
      router.push({
        pathname: '/post-detail',
        params: { 
          postId: postId,
          postData: JSON.stringify(selectedPost)
        }
      });
    }
  };

  const handlePostPress = (postId: string) => {
    const selectedPost = posts.find(p => p.id === postId);
    if (selectedPost) {
      router.push({
        pathname: '/post-detail',
        params: { 
          postId: postId,
          postData: JSON.stringify(selectedPost)
        }
      });
    }
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    Alert.alert('Thông báo', 'Tính năng thông báo sẽ được phát triển sau.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
      <CommunityHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNotificationPress={handleNotificationPress}
      />
      
      <View style={styles.content}>
        <CommunityFeed
          posts={posts}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          onComment={handleComment}
          onPostPress={handlePostPress}
        />
      </View>

      <CreatePostButton onPress={handleCreatePost} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
