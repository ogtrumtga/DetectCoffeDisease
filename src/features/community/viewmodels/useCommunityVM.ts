/**
 * Community ViewModel
 * Logic cho màn hình Community chính
 */

import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { savePendingAction } from '../../../utils/pendingAction';
import { CommunityPost } from '../models';
import { communityService } from '../services';

export const useCommunityVM = () => {
  // Authentication
  const { isLoggedIn } = useAuth();

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
      const response = await communityService.getPosts(currentPage, 10);
      
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
      const results = await communityService.searchPosts(searchQuery.trim());
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
    // Authentication guard - block guests from liking posts
    if (!isLoggedIn) {
      // Lưu pending action - sau khi đăng nhập sẽ quay lại và tự động like
      const post = posts.find(p => p.id === postId);
      await savePendingAction({
        action: 'like-post',
        returnPath: '/(tabs)/community',
        data: {
          postId,
          postData: post ? JSON.stringify(post) : undefined,
        },
      });
      
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thực hiện hành động này',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    try {
      const result = await communityService.toggleLike(postId);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: result.isLiked, likes: result.likesCount }
          : post
      ));

      // Tạo thông báo khi like (chỉ khi isLiked = true, tức là vừa like)
      if (result.isLiked) {
        const post = posts.find(p => p.id === postId);
        if (post) {
          const { notificationService } = await import('../services');
          await notificationService.createLikeNotification(
            postId,
            post.title,
            'Bạn', // Trong thực tế sẽ lấy từ user context
            'current-user-id'
          );
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này.');
    }
  };

  const updatePost = (updatedPost: CommunityPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const refreshPosts = () => {
    loadPosts(true);
  };

  return {
    // State
    posts,
    loading,
    refreshing,
    searchQuery,
    hasMore,

    // Actions
    setSearchQuery,
    handleRefresh,
    handleLoadMore,
    handleLike,
    updatePost,
    refreshPosts
  };
};