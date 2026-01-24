import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Comment } from '@/services/community/types';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface CommentInputProps {
  onSubmit: (content: string, parentId?: string) => void;
  loading?: boolean;
  replyingTo?: Comment | null;
  onCancelReply?: () => void;
}

export function CommentInput({ onSubmit, loading = false, replyingTo, onCancelReply }: CommentInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bình luận');
      return;
    }

    onSubmit(comment.trim(), replyingTo?.id);
    setComment('');
  };

  const handleCameraPress = () => {
    // TODO: Implement camera/image picker for comment
    Alert.alert('Thông báo', 'Tính năng đính kèm ảnh sẽ được phát triển sau');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Reply context */}
        {replyingTo && (
          <View style={[styles.replyContext, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.replyText, { color: '#6B7280' }]}>
              Đang trả lời @{replyingTo.author.name}
            </Text>
            {onCancelReply && (
              <TouchableOpacity onPress={onCancelReply} style={styles.cancelReply}>
                <IconSymbol name="xmark" size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: '#FFFFFF' }]}>
          <TouchableOpacity 
            onPress={handleCameraPress}
            style={styles.cameraButton}
          >
            <IconSymbol 
              name="camera" 
              size={20} 
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder={replyingTo ? `Trả lời ${replyingTo.author.name}...` : "Câu trả lời của bạn"}
            placeholderTextColor="#9CA3AF"
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={1000}
            editable={!loading}
          />

          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={!comment.trim() || loading}
            style={[
              styles.sendButton,
              { opacity: (!comment.trim() || loading) ? 0.5 : 1 }
            ]}
          >
            <IconSymbol 
              name="paperplane.fill" 
              size={20} 
              color="#3B82F6"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  replyContext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  cancelReply: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  cameraButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
});