/**
 * Post Actions Component
 * Hiển thị các nút hành động của post (Like, Comment, Share)
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CommunityColors } from '../design-system';
import { postStyles } from '../styles';

interface PostActionsProps {
  likes: number;
  comments: number;
  isLiked?: boolean;
  isDetailView?: boolean;
  onLike: () => void;
  onComment: () => void;
}

export function PostActions({
  likes,
  comments,
  isLiked = false,
  isDetailView = false,
  onLike,
  onComment
}: PostActionsProps) {
  const handleLike = (e: any) => {
    e.stopPropagation();
    onLike();
  };

  const handleComment = (e: any) => {
    e.stopPropagation();
    onComment();
  };

  return (
    <View style={isDetailView ? postStyles.postActionsDetail : postStyles.postActions}>
      {/* Like Button */}
      <TouchableOpacity 
        style={isDetailView ? postStyles.actionButtonDetail : postStyles.actionButton}
        onPress={handleLike}
      >
        <IconSymbol 
          name={isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"} 
          size={isDetailView ? 20 : 18} 
          color={isLiked ? CommunityColors.likeButton : CommunityColors.captionText}
        />
        <Text style={isDetailView ? postStyles.actionTextDetail : postStyles.actionText}>
          {likes}
        </Text>
      </TouchableOpacity>

      {/* Comment Button */}
      <TouchableOpacity 
        style={isDetailView ? postStyles.actionButtonDetail : postStyles.actionButton}
        onPress={handleComment}
      >
        <IconSymbol 
          name="bubble.left" 
          size={isDetailView ? 20 : 18} 
          color={CommunityColors.commentButton}
        />
        <Text style={isDetailView ? postStyles.actionTextDetail : postStyles.actionText}>
          {comments}
        </Text>
      </TouchableOpacity>
    </View>
  );
}