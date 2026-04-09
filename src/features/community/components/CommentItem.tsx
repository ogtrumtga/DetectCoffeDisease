/**
 * Comment Item Component
 * Hiển thị một comment với nested replies
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommunityColors } from '../design-system';
import { Comment } from '../models';
import { notificationService } from '../services';
import { commentStyles } from '../styles';
import { ReportModal } from './ReportModal';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (comment: Comment) => void;
  isReply?: boolean;
  highlightedCommentId?: string | null;
  currentUserId?: string; // ID của user hiện tại để kiểm tra có phải comment của mình không
  postId?: string; // ID của post chứa comment
}

export function CommentItem({ comment, onLike, onReply, isReply = false, highlightedCommentId = null, currentUserId, postId }: CommentItemProps) {
  const avatarUri = (comment.author as any)?.avatar || (comment.author as any)?.avatarUrl || '';
  const hasAvatar = typeof avatarUri === 'string' && avatarUri.trim().length > 0;

  const [timeAgo, setTimeAgo] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Kiểm tra xem comment có phải của user hiện tại không
  const isOwnComment = currentUserId && comment.author.id === currentUserId;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
  };

  // Cập nhật thời gian khi component mount và mỗi phút
  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatTimeAgo(comment.createdAt));
    };

    // Cập nhật ngay lập tức
    updateTime();

    // Cập nhật mỗi 60 giây
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [comment.createdAt]);

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment);
    }
  };

  const handleReport = async (reason: string) => {
    if (!currentUserId || !postId) {
      console.error('Missing currentUserId or postId');
      return;
    }

    try {
      // TODO: Lấy tên user từ AuthContext hoặc UserService
      const currentUserName = 'Người dùng hiện tại';
      
      // Tạo notification báo cáo
      await notificationService.createReportNotification(
        currentUserId,
        currentUserName,
        comment.author.id,
        comment.author.name,
        comment.id,
        comment.content,
        postId,
        reason
      );
      
      console.log('Report submitted successfully');
      // Có thể hiển thị toast thông báo thành công
    } catch (error) {
      console.error('Error submitting report:', error);
      // Có thể hiển thị toast thông báo lỗi
    }
  };

  return (
    <View>
      <View style={[
        commentStyles.commentContainer, 
        isReply && commentStyles.replyContainer,
        highlightedCommentId === comment.id && commentStyles.commentHighlighted
      ]}>
        {/* Reply connector line */}
        {isReply && <View style={commentStyles.replyLine} />}
        
        {/* Avatar */}
        <View style={[
          commentStyles.commentAvatar,
          isReply && commentStyles.replyAvatar
        ]}>
          {hasAvatar ? (
            <Image source={{ uri: avatarUri }} style={commentStyles.commentAvatarImage} />
          ) : (
            <IconSymbol 
              name="person.fill" 
              size={isReply ? 14 : 20} 
              color={CommunityColors.captionText}
            />
          )}
        </View>

        {/* Comment content */}
        <View style={commentStyles.commentContent}>
          <View style={commentStyles.commentHeader}>
            <Text style={commentStyles.commentAuthorName}>
              {comment.author.name}
            </Text>
            <Text style={commentStyles.commentTimeAgo}>
              {timeAgo}
            </Text>
          </View>
          
          <Text style={commentStyles.commentText}>
            {comment.content}
          </Text>

          {/* Actions */}
          <View style={commentStyles.commentActions}>
            {onLike && (
              <TouchableOpacity 
                style={commentStyles.commentActionButton}
                onPress={handleLike}
              >
                <View style={commentStyles.commentActionIcon}>
                  <IconSymbol 
                    name={comment.isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"} 
                    size={16} 
                    color={comment.isLiked ? CommunityColors.likeButton : CommunityColors.captionText}
                  />
                </View>
                {(comment.likes || 0) > 0 && (
                  <Text style={commentStyles.commentActionText}>
                    {comment.likes}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {onReply && !isReply && (
              <TouchableOpacity 
                style={commentStyles.commentActionButton}
                onPress={handleReply}
              >
                <View style={commentStyles.commentActionIcon}>
                  <IconSymbol 
                    name="bubble.left" 
                    size={16} 
                    color={CommunityColors.captionText}
                  />
                </View>
                {(comment.replyCount || 0) > 0 && (
                  <Text style={commentStyles.commentActionText}>
                    {comment.replyCount}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu 3 chấm */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => {
            console.log('Menu button pressed');
            setShowMenu(true);
          }}
        >
          <Text style={{ fontSize: 20, color: '#000' }}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={commentStyles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              isReply={true}
              highlightedCommentId={highlightedCommentId}
              currentUserId={currentUserId}
              postId={postId}
            />
          ))}
        </View>
      )}

      {/* Separator chỉ cho main comments */}
      {!isReply && (
        <View style={commentStyles.mainCommentSeparator} />
      )}

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setShowReportModal(true);
              }}
            >
              <IconSymbol 
                name="exclamationmark.triangle" 
                size={20} 
                color="#ef4444"
              />
              <Text style={styles.menuItemText}>Báo cáo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        reportedUserName={comment.author.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
});