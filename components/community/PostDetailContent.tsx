import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CommunityPost } from '@/services/community/types';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostDetailContentProps {
  post: CommunityPost;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export function PostDetailContent({ post, onLike, onComment, onShare }: PostDetailContentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleImagePress = (imageUrl: string) => {
    // TODO: Implement full screen image viewer
    console.log('Open image viewer for:', imageUrl);
  };

  const handleContentPress = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSeeMore = () => {
    setIsExpanded(true);
  };

  const renderContent = () => {
    const maxLength = 200; // Longer threshold for detail view
    const shouldShowSeeMore = post.content.length > maxLength;

    if (!shouldShowSeeMore) {
      return (
        <Text style={[styles.description, { color: '#6B7280' }]}>
          {post.content}
        </Text>
      );
    }

    if (isExpanded) {
      return (
        <TouchableOpacity onPress={handleContentPress} activeOpacity={0.8}>
          <Text style={[styles.description, { color: '#6B7280' }]}>
            {post.content}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <Text style={[styles.description, { color: '#6B7280' }]} numberOfLines={3}>
          {post.content}
        </Text>
        <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreButton}>
          <Text style={[styles.seeMoreText, { color: '#6B7280' }]}>
            Xem thêm
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hình ảnh chính */}
      {post.image && (
        <TouchableOpacity onPress={() => handleImagePress(post.image!)}>
          <Image 
            source={{ uri: post.image }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Author info */}
        <View style={styles.authorSection}>
          <View style={styles.avatar}>
            <IconSymbol 
              name="person.fill" 
              size={24} 
              color="#9CA3AF"
            />
          </View>
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: '#3B82F6' }]}>
              {post.author.name}
            </Text>
            <Text style={[styles.timeAgo, { color: '#6B7280' }]}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Post content */}
        <Text style={[styles.title, { color: colors.text }]}>
          {post.title}
        </Text>
        
        {/* Nội dung với tính năng "Xem thêm" */}
        {renderContent()}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onLike}
          >
            <IconSymbol 
              name={post.isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"} 
              size={20} 
              color="#6B7280"
            />
            <Text style={[styles.actionText, { color: '#6B7280' }]}>
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onComment}
          >
            <IconSymbol 
              name="bubble.left" 
              size={20} 
              color="#6B7280"
            />
            <Text style={[styles.actionText, { color: '#6B7280' }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onShare}
          >
            <IconSymbol 
              name="square.and.arrow.up" 
              size={20} 
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  seeMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  seeMoreText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 8,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});