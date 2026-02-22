/**
 * Post Content Component
 * Hiển thị nội dung của post với tính năng "Xem thêm"
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { postStyles } from '../styles';
import { COMMUNITY_CONFIG } from '../constants';

interface PostContentProps {
  title: string;
  content: string;
  image?: string;
  isDetailView?: boolean;
  onImagePress?: (imageUrl: string) => void;
}

export function PostContent({ 
  title, 
  content, 
  image, 
  isDetailView = false,
  onImagePress 
}: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = isDetailView 
    ? COMMUNITY_CONFIG.POST_DETAIL_PREVIEW_LENGTH 
    : COMMUNITY_CONFIG.POST_PREVIEW_LENGTH;

  const handleContentPress = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSeeMore = (e: any) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleImagePress = () => {
    if (image && onImagePress) {
      onImagePress(image);
    }
  };

  const renderContent = () => {
    const shouldShowSeeMore = content.length > maxLength;

    if (!shouldShowSeeMore) {
      return (
        <Text style={isDetailView ? postStyles.postDescriptionDetail : postStyles.postDescription}>
          {content}
        </Text>
      );
    }

    if (isExpanded) {
      return (
        <TouchableOpacity onPress={handleContentPress} activeOpacity={0.8}>
          <Text style={isDetailView ? postStyles.postDescriptionDetail : postStyles.postDescription}>
            {content}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <Text 
          style={isDetailView ? postStyles.postDescriptionDetail : postStyles.postDescription}
          numberOfLines={isDetailView ? 3 : 2}
        >
          {content}
        </Text>
        <TouchableOpacity onPress={handleSeeMore} style={postStyles.seeMoreButton}>
          <Text style={isDetailView ? postStyles.seeMoreTextDetail : postStyles.seeMoreText}>
            Xem thêm
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {/* Hình ảnh */}
      {image && (
        <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
          <Image 
            source={{ uri: image }}
            style={isDetailView ? postStyles.postDetailImage : postStyles.postImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* Tiêu đề và nội dung */}
      {!isDetailView && (
        <View style={postStyles.postTextContent}>
          {/* Tiêu đề */}
          <Text style={postStyles.postTitle}>
            {title}
          </Text>

          {/* Nội dung với tính năng "Xem thêm" */}
          {renderContent()}
        </View>
      )}
    </View>
  );
}