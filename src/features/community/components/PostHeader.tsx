/**
 * Post Header Component
 * Hiển thị thông tin tác giả và thời gian của post
 */

import React, { useState, useEffect } from 'react';
import { Image, View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { User } from '../models';
import { postStyles } from '../styles';

interface PostHeaderProps {
  author: User;
  createdAt: string;
  isDetailView?: boolean;
}

export function PostHeader({ author, createdAt, isDetailView = false }: PostHeaderProps) {
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
      setTimeAgo(formatTimeAgo(createdAt));
    };

    // Cập nhật ngay lập tức
    updateTime();

    // Cập nhật mỗi 60 giây
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <View style={postStyles.postHeader}>
      <View style={[
        postStyles.avatar,
        isDetailView && postStyles.avatarSmall
      ]}>
        {author.avatar ? (
          <Image
            source={{ uri: author.avatar }}
            style={{ width: '100%', height: '100%', borderRadius: 999 }}
          />
        ) : (
          <IconSymbol 
            name="person.fill" 
            size={isDetailView ? 14 : 20} 
            color="#9CA3AF"
          />
        )}
      </View>
      
      <View style={postStyles.authorInfo}>
        <Text style={postStyles.authorName}>
          {author.name}
        </Text>
        <Text style={postStyles.timeAgo}>
          {timeAgo}
        </Text>
      </View>
    </View>
  );
}