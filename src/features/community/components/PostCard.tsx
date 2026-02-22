/**
 * Post Card Component
 * Card hiển thị một post trong feed
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CommunityPost } from '../models';
import { postStyles } from '../styles';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPress: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onPress,
  onShare 
}: PostCardProps) {
  const handlePress = () => {
    onPress(post.id);
  };

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    onComment(post.id);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    }
  };

  return (
    <TouchableOpacity 
      style={postStyles.postCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Nội dung post - ảnh ở trên cùng */}
      <PostContent
        title={post.title}
        content={post.content}
        image={post.image}
        isDetailView={false}
      />

      <View style={postStyles.postContent}>
        {/* Thông tin tác giả */}
        <PostHeader
          author={post.author}
          createdAt={post.createdAt}
          isDetailView={false}
        />

        {/* Actions */}
        <PostActions
          likes={post.likes}
          comments={post.comments}
          isLiked={post.isLiked}
          isDetailView={false}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </View>
    </TouchableOpacity>
  );
}