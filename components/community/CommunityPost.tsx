import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CommunityPost as PostType } from '@/services/community/types';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommunityPostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPress: (postId: string) => void;
}

export function CommunityPost({ post, onLike, onComment, onPress }: CommunityPostProps) {
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

  const handleContentPress = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSeeMore = (e: any) => {
    e.stopPropagation(); // Prevent triggering onPress of parent
    setIsExpanded(true);
  };

  const renderContent = () => {
    const maxLength = 100; // Rough estimate for 2 lines
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
        <Text style={[styles.description, { color: '#6B7280' }]} numberOfLines={2}>
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
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      onPress={() => onPress(post.id)}
      activeOpacity={0.7}
    >
      {/* Hình ảnh chính nếu có */}
      {post.image && (
        <Image 
          source={{ uri: post.image }}
          style={styles.mainImage}
          resizeMode="contain"
        />
      )}

      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Header với thông tin tác giả */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol 
                name="person.fill" 
                size={24} 
                color="#9CA3AF"
              />
            </View>
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

        {/* Tiêu đề */}
        <Text style={[styles.title, { color: colors.text }]}>
          {post.title}
        </Text>

        {/* Nội dung với tính năng "Xem thêm" */}
        {renderContent()}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
          >
            <IconSymbol 
              name={post.isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"} 
              size={18} 
              color="#6B7280"
            />
            <Text style={[styles.actionText, { color: '#6B7280' }]}>
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onComment(post.id);
            }}
          >
            <IconSymbol 
              name="bubble.left" 
              size={18} 
              color="#6B7280"
            />
            <Text style={[styles.actionText, { color: '#6B7280' }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => e.stopPropagation()}
          >
            <IconSymbol 
              name="square.and.arrow.up" 
              size={18} 
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mainImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  seeMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});