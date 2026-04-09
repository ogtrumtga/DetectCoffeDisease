/**
 * Post Detail ViewModel
 * Logic cho màn hình chi tiết post
 */

import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { savePendingAction } from '../../../utils/pendingAction';
import { Comment, CommunityPost } from '../models';
import { commentService, communityService } from '../services';

interface UsePostDetailVMProps {
  postId: string;
  initialPost?: CommunityPost;
}

export const usePostDetailVM = ({ postId, initialPost }: UsePostDetailVMProps) => {
  // Authentication
  const { isLoggedIn, user } = useAuth();

  // State management
  const [post, setPost] = useState<CommunityPost | null>(initialPost || null);
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
      if (!initialPost) {
        loadPostDetails();
      }
      loadComments(true);
    }
  }, [postId, initialPost]);

  const loadPostDetails = async () => {
    try {
      const detail = await communityService.getPostDetail(postId);
      setPost(detail);
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
      const response = await commentService.getComments(postId, currentPage, 20);
      
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
      initialPost ? Promise.resolve() : loadPostDetails(),
      loadComments(true)
    ]);
    setRefreshing(false);
  }, [postId, initialPost]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadComments(false);
    }
  }, [hasMore, loading]);

  const handleLike = async () => {
    if (!post) return;

    // Authentication guard - block guests from liking posts
    if (!isLoggedIn) {
      // Lưu pending action - sau khi đăng nhập sẽ quay lại post detail và tự động like
      await savePendingAction({
        action: 'like-post',
        returnPath: '/(tabs)/community/post-detail',
        data: {
          postId: post.id,
          postData: JSON.stringify(post),
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
      const result = await communityService.toggleLike(post.id);
      const updatedPost = {
        ...post,
        isLiked: result.isLiked,
        likes: result.likesCount
      };
      
      setPost(updatedPost);

      // Tạo thông báo khi like
      if (result.isLiked) {
        const { notificationService } = await import('../services');
        await notificationService.createLikeNotification(
          post.id,
          post.title,
          'Bạn', // Trong thực tế sẽ lấy từ user context
          'current-user-id'
        );
      }

      return updatedPost;
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này');
      return null;
    }
  };

  const handleShare = async () => {
    if (!post) return;

    try {
      const { Share } = await import('react-native');
      const shareMessage = `${post.title}\n\n${post.content}\n\nĐược chia sẻ từ Cộng đồng Cà phê`;
      
      const result = await Share.share(
        {
          message: shareMessage,
          title: post.title,
        },
        {
          subject: post.title,
          dialogTitle: 'Chia sẻ bài viết',
        }
      );

      if (result.action === Share.sharedAction) {
        console.log('Post shared successfully');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Lỗi', 'Không thể chia sẻ bài viết');
    }
  };

  const handleSubmitComment = async (content: string, parentId?: string) => {
    if (!postId || !post) return false;

    // Authentication guard - block guests from commenting
    if (!isLoggedIn) {
      // Lưu pending action - sau khi đăng nhập sẽ quay lại post detail
      await savePendingAction({
        action: 'comment',
        returnPath: '/(tabs)/community/post-detail',
        data: {
          postId,
          postData: JSON.stringify(post),
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
      return false;
    }

    setCommentLoading(true);
    try {
      const newComment = await commentService.createComment({
        postId,
        content,
        parentId
      });

      // Đồng bộ avatar hiện tại để comment hiển thị đúng ngay sau khi đăng.
      const normalizedComment: Comment = {
        ...newComment,
        author: {
          ...newComment.author,
          avatar:
            newComment.author.avatar ||
            (user?.photoURL ?? undefined),
        },
      };

      if (parentId) {
        // Đây là reply - cập nhật parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), normalizedComment],
              replyCount: (comment.replyCount || 0) + 1
            };
          }
          return comment;
        }));
        setReplyingTo(null);

        // Tạo thông báo reply
        const { notificationService } = await import('../services');
        await notificationService.createReplyNotification(
          postId,
          newComment.author.name,
          newComment.author.id,
          parentId,
          content
        );
      } else {
        // Đây là top-level comment
        setComments(prev => [normalizedComment, ...prev]);

        // Tạo thông báo comment
        const { notificationService } = await import('../services');
        await notificationService.createCommentNotification(
          postId,
          post.title,
          newComment.author.name,
          newComment.author.id,
          newComment.id,
          content
        );
      }
      
      // Update post comment count
      const newCommentCount = post.comments + 1;
      const updatedPost: CommunityPost = {
        ...post,
        comments: newCommentCount
      };
      setPost(updatedPost);
      
      // Cập nhật trong service để sync với community screen
      communityService.updatePostCommentCount(postId, 1);
      await loadComments(true);
      
      return updatedPost;
    } catch (error) {
      console.error('Error creating comment:', error);
      Alert.alert('Lỗi', 'Không thể đăng bình luận');
      return false;
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
    // Authentication guard - block guests from liking comments
    if (!isLoggedIn) {
      // Lưu pending action - sau khi đăng nhập sẽ quay lại post detail
      if (post) {
        await savePendingAction({
          action: 'like-comment',
          returnPath: '/(tabs)/community/post-detail',
          data: {
            postId: post.id,
            postData: JSON.stringify(post),
            commentId,
          },
        });
      }
      
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
      const result = await commentService.toggleCommentLike(commentId);
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: result.isLiked, likes: result.likesCount }
          : comment
      ));

      // Tạo thông báo khi like comment
      if (result.isLiked && post) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          const { notificationService } = await import('../services');
          await notificationService.createLikeNotification(
            post.id,
            `bình luận: "${comment.content.substring(0, 30)}..."`,
            'Bạn',
            'current-user-id'
          );
        }
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này');
    }
  };

  return {
    // State
    post,
    comments,
    loading,
    refreshing,
    commentLoading,
    hasMore,
    replyingTo,

    // Actions
    handleRefresh,
    handleLoadMore,
    handleLike,
    handleShare,
    handleSubmitComment,
    handleReplyComment,
    handleCancelReply,
    handleLikeComment
  };
};