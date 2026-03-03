/**
 * Comment Input Component
 * Input để nhập bình luận với khả năng reply
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from '../constants';
import { CommunityColors } from '../design-system';
import { Comment } from '../models';
import { commentStyles } from '../styles';

interface CommentInputProps {
  onSubmit: (content: string, parentId?: string) => void;
  loading?: boolean;
  replyingTo?: Comment | null;
  onCancelReply?: () => void;
}

export function CommentInput({ 
  onSubmit, 
  loading = false, 
  replyingTo, 
  onCancelReply 
}: CommentInputProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const trimmedComment = comment.trim();
    
    if (!trimmedComment) {
      Alert.alert('Lỗi', VALIDATION_MESSAGES.COMMENT.REQUIRED);
      return;
    }

    if (trimmedComment.length > VALIDATION_RULES.COMMENT.MAX_LENGTH) {
      Alert.alert('Lỗi', VALIDATION_MESSAGES.COMMENT.TOO_LONG);
      return;
    }

    onSubmit(trimmedComment, replyingTo?.id);
    setComment('');
  };

  const handleCameraPress = () => {
    // TODO: Implement camera/image picker for comment
    Alert.alert('Thông báo', 'Tính năng đính kèm ảnh sẽ được phát triển sau');
  };

  const canSubmit = comment.trim() && !loading;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={commentStyles.commentInputContainer}>
        {/* Reply context */}
        {replyingTo && (
          <View style={commentStyles.replyContext}>
            <Text style={commentStyles.replyText}>
              Đang trả lời @{replyingTo.author.name}
            </Text>
            {onCancelReply && (
              <TouchableOpacity onPress={onCancelReply} style={commentStyles.cancelReply}>
                <IconSymbol name="xmark" size={16} color={CommunityColors.bodyText} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={commentStyles.inputContainer}>
          <TouchableOpacity 
            onPress={handleCameraPress}
            style={commentStyles.cameraButton}
          >
            <IconSymbol 
              name="camera" 
              size={20} 
              color={CommunityColors.captionText}
            />
          </TouchableOpacity>

          <TextInput
            style={commentStyles.commentTextInput}
            placeholder={replyingTo ? `Trả lời ${replyingTo.author.name}...` : "Câu trả lời của bạn"}
            placeholderTextColor={CommunityColors.captionText}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={VALIDATION_RULES.COMMENT.MAX_LENGTH}
            editable={!loading}
          />

          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              commentStyles.sendButton,
              { opacity: canSubmit ? 1 : 0.5 }
            ]}
          >
            <IconSymbol 
              name="paperplane.fill" 
              size={20} 
              color={CommunityColors.likeButton}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}