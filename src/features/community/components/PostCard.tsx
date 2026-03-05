/**
 * Post Card Component
 * Card hiển thị một post trong feed
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CommunityPost } from '../models';
import { postStyles } from '../styles';
import { PostActions } from './PostActions';
import { PostContent } from './PostContent';
import { PostHeader } from './PostHeader';

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPress: (postId: string) => void;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onPress
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
        />
      </View>
    </TouchableOpacity>
  );
}