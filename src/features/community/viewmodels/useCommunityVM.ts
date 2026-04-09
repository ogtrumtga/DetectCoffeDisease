/**
 * Community ViewModel
 * Logic cho màn hình Community chính
 */

import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePendingAction } from '../../../utils/pendingAction';
import { CommunityPost } from '../models';
import { communityService } from '../services';

const POSTS_CACHE_KEY = '@community_posts_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 phút

interface CachedPosts {
  posts: CommunityPost[];
  timestamp: number;
}

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

  // Load cached posts
  const loadCachedPosts = async (): Promise<CommunityPost[] | null> => {
    try {
      const cached = await AsyncStorage.getItem(POSTS_CACHE_KEY);
      if (cached) {
        const { posts: cachedPosts, timestamp }: CachedPosts = JSON.parse(cached);
        const now = Date.now();
        
        // Kiểm tra cache còn hạn không (5 phút)
        if (now - timestamp < CACHE_EXPIRY_MS) {
          console.log('[CommunityVM] Using cached posts');
          return cachedPosts;
        }
      }
    } catch (error) {
      console.error('[CommunityVM] Failed to load cached posts:', error);
    }
    return null;
  };

  // Save posts to cache
  const saveCachedPosts = async (postsToCache: CommunityPost[]) => {
    try {
      const cacheData: CachedPosts = {
        posts: postsToCache,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(cacheData));
      console.log('[CommunityVM] Posts cached successfully');
    } catch (error) {
      console.error('[CommunityVM] Failed to cache posts:', error);
    }
  };

  // Load posts khi component mount
  useEffect(() => {
    const initLoad = async () => {
      // Load cache trước
      const cachedPosts = await loadCachedPosts();
      if (cachedPosts && cachedPosts.length > 0) {
        setPosts(cachedPosts);
        console.log('[CommunityVM] Loaded', cachedPosts.length, 'posts from cache');
      }
      
      // Sau đó load fresh data (không block UI nếu fail)
      try {
        await loadPosts(true);
      } catch (error) {
        console.log('[CommunityVM] Failed to load fresh posts, using cache');
        // Nếu có cache thì không cần show error
        if (!cachedPosts || cachedPosts.length === 0) {
          Alert.alert(
            'Không thể kết nối',
            'Vui lòng kiểm tra:\n1. Backend đang chạy\n2. IP trong .env đúng\n3. Cùng mạng WiFi',
            [{ text: 'OK' }]
          );
        }
      }
    };
    
    initLoad();
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
        // Cache posts mới
        await saveCachedPosts(response.data);
      } else {
        const newPosts = [...posts, ...response.data];
        setPosts(newPosts);
        setPage(prev => prev + 1);
        // Cache posts mới
        await saveCachedPosts(newPosts);
      }
      
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      
      // Chỉ show alert nếu không có cache
      if (posts.length === 0) {
        const isTimeout = error.message?.includes('timeout') || error.message?.includes('aborted');
        Alert.alert(
          'Lỗi kết nối',
          isTimeout 
            ? 'Không thể kết nối backend. Vui lòng:\n1. Kiểm tra backend đang chạy\n2. Kiểm tra IP trong .env\n3. Chạy CHECK_BACKEND_CONNECTION.bat'
            : 'Không thể tải bài viết. Vui lòng thử lại.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    // Clear cache khi refresh
    await AsyncStorage.removeItem(POSTS_CACHE_KEY);
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
      
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: result.isLiked, likes: result.likesCount }
          : post
      );
      
      setPosts(updatedPosts);
      
      // Update cache
      await saveCachedPosts(updatedPosts);

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