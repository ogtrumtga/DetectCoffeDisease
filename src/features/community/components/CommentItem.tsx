/**
 * Comment Item Component
 * Hiển thị một comment với nested replies
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CommunityColors } from '../design-system';
import { Comment } from '../models';
import { commentStyles } from '../styles';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (comment: Comment) => void;
  isReply?: boolean;
  highlightedCommentId?: string | null;
}

export function CommentItem({ comment, onLike, onReply, isReply = false, highlightedCommentId = null }: CommentItemProps) {
  const [timeAgo, setTimeAgo] = useState('');

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
          <IconSymbol 
            name="person.fill" 
            size={isReply ? 14 : 20} 
            color={CommunityColors.captionText}
          />
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
                <IconSymbol 
                  name={comment.isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"} 
                  size={16} 
                  color={comment.isLiked ? CommunityColors.likeButton : CommunityColors.captionText}
                />
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
                <IconSymbol 
                  name="bubble.left" 
                  size={16} 
                  color={CommunityColors.captionText}
                />
                {(comment.replyCount || 0) > 0 && (
                  <Text style={commentStyles.commentActionText}>
                    {comment.replyCount}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
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
            />
          ))}
        </View>
      )}

      {/* Separator chỉ cho main comments */}
      {!isReply && (
        <View style={commentStyles.mainCommentSeparator} />
      )}
    </View>
  );
}