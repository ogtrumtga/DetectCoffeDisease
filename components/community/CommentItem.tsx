import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Comment } from '@/services/community/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (comment: Comment) => void;
  isReply?: boolean;
}

export function CommentItem({ comment, onLike, onReply, isReply = false }: CommentItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  return (
    <View>
      <View style={[styles.container, isReply && styles.replyContainer]}>
        {/* Reply connector line */}
        {isReply && <View style={styles.replyLine} />}
        
        {/* Avatar */}
        <View style={[styles.avatar, isReply && { width: 32, height: 32, borderRadius: 16 }]}>
          <IconSymbol 
            name="person.fill" 
            size={isReply ? 14 : 20} 
            color="#9CA3AF"
          />
        </View>

        {/* Comment content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.authorName, { color: '#3B82F6' }]}>
              {comment.author.name}
            </Text>
            <Text style={[styles.timeAgo, { color: '#9CA3AF' }]}>
              {formatTimeAgo(comment.createdAt)}
            </Text>
          </View>
          
          <Text style={[styles.commentText, { color: colors.text }]}>
            {comment.content}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            {onLike && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onLike(comment.id)}
              >
                <IconSymbol 
                  name={comment.isLiked ? "heart.fill" : "heart"} 
                  size={16} 
                  color={comment.isLiked ? '#FF6B6B' : '#9CA3AF'}
                />
                {(comment.likes || 0) > 0 && (
                  <Text style={[styles.actionText, { color: '#9CA3AF' }]}>
                    {comment.likes}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {onReply && !isReply && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onReply(comment)}
              >
                <IconSymbol 
                  name="bubble.left" 
                  size={16} 
                  color="#9CA3AF"
                />
                {(comment.replyCount || 0) > 0 && (
                  <Text style={[styles.actionText, { color: '#9CA3AF' }]}>
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
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              isReply={true}
            />
          ))}
        </View>
      )}

      {/* Separator chỉ cho main comments */}
      {!isReply && (
        <View style={styles.mainCommentSeparator} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  replyContainer: {
    paddingLeft: 64, // Tăng indent cho replies
    position: 'relative',
    backgroundColor: '#FAFAFA', // Subtle background cho replies
  },
  replyLine: {
    position: 'absolute',
    left: 40, // Điều chỉnh vị trí line
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#D1D5DB', // Màu rõ hơn cho connector line
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 4, // Giảm margin để replies gần hơn với parent
  },
  mainCommentSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 64,
    marginTop: 12,
    marginBottom: 4,
  },
});