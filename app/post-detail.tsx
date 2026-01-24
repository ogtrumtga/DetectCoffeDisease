import { CommentInput } from '@/components/community/CommentInput';
import { CommentList } from '@/components/community/CommentList';
import { PostDetailHeader } from '@/components/community/PostDetailHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { commentAPI } from '@/services/community/commentAPI';
import { communityAPI } from '@/services/community/communityAPI';
import { Comment, CommunityPost } from '@/services/community/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const postId = params.postId as string;

  // State management
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  // Load post details và comments khi component mount
  useEffect(() => {
    if (postId) {
      loadPostDetails();
      loadComments(true);
    }
  }, [postId]);

  const loadPostDetails = async () => {
    try {
      // Lấy thông tin post từ params nếu có
      if (params.postData) {
        const postData = JSON.parse(params.postData as string);
        setPost(postData);
        return;
      }

      // Fallback: tạo mock post nếu không có data từ params
      const mockPost: CommunityPost = {
        id: postId,
        title: 'Câu hỏi',
        content: 'Mô tả bệnh',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=200&fit=crop',
        author: {
          id: 'user1',
          name: 'Đăng Vinh',
          avatar: 'https://via.placeholder.com/40'
        },
        createdAt: '2025-09-24T10:30:00Z',
        updatedAt: '2025-09-24T10:30:00Z',
        likes: 2,
        comments: 2,
        tags: [],
        isLiked: false
      };
      setPost(mockPost);
    } catch (error) {
      console.error('Error loading post details:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin bài viết');
    }
  };

  const loadComments = async (reset: boolean = false) => {
    if (loading || !postId) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await commentAPI.getComments(postId, currentPage, 20);
      
      if (reset) {
        setComments(response.data);
        setPage(2);
      } else {
        setComments(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Lỗi', 'Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await Promise.all([
      loadPostDetails(),
      loadComments(true)
    ]);
    setRefreshing(false);
  }, [postId]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadComments(false);
    }
  }, [hasMore, loading]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const result = await communityAPI.toggleLike(post.id);
      const updatedPost = {
        ...post,
        isLiked: result.isLiked,
        likes: result.likesCount
      };
      
      setPost(updatedPost);
      
      // Sync back to community screen
      router.setParams({ 
        updatedPost: JSON.stringify(updatedPost)
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này');
    }
  };

  const handleComment = () => {
    // Scroll to comment input or focus it
    // This is already handled by the UI layout
  };

  const handleShare = () => {
    Alert.alert('Thông báo', 'Tính năng chia sẻ sẽ được phát triển sau');
  };

  const handleSubmitComment = async (content: string, parentId?: string) => {
    if (!postId || !post) return;

    setCommentLoading(true);
    try {
      const newComment = await commentAPI.createComment({
        postId,
        content,
        parentId
      });

      if (parentId) {
        // Đây là reply - cập nhật parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
              replyCount: (comment.replyCount || 0) + 1
            };
          }
          return comment;
        }));
        setReplyingTo(null);
      } else {
        // Đây là top-level comment
        setComments(prev => [newComment, ...prev]);
      }
      
      // Update post comment count (bao gồm cả replies)
      const newCommentCount = post.comments + 1;
      const updatedPost: CommunityPost = {
        ...post,
        comments: newCommentCount
      };
      setPost(updatedPost);
      
      console.log('Updated post comment count from', post.comments, 'to', newCommentCount); // Debug log
      
      // Cập nhật trong mockPosts để sync với community screen
      const { communityAPI } = await import('@/services/community/communityAPI');
      if (communityAPI.updatePostCommentCount) {
        communityAPI.updatePostCommentCount(postId, 1);
      }
      
      // Sync back to community screen với delay nhỏ để đảm bảo update hoàn tất
      setTimeout(() => {
        router.setParams({ 
          updatedPost: JSON.stringify(updatedPost)
        });
      }, 100);

    } catch (error) {
      console.error('Error creating comment:', error);
      Alert.alert('Lỗi', 'Không thể đăng bình luận');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplyComment = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const result = await commentAPI.toggleCommentLike(commentId);
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: result.isLiked, likes: result.likesCount }
          : comment
      ));
    } catch (error) {
      console.error('Error toggling comment like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này');
    }
  };

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <PostDetailHeader />
        <View style={styles.loadingContainer}>
          {/* Loading state */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <PostDetailHeader />
      
      <View style={styles.content}>
        <CommentList
          post={post}
          comments={comments}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onLikeComment={handleLikeComment}
          onReplyComment={handleReplyComment}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />

        <CommentInput
          onSubmit={handleSubmitComment}
          loading={commentLoading}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});