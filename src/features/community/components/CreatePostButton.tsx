/**
 * Create Post Button Component
 * Floating Action Button để tạo post mới
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { postStyles } from '../styles';
import { CommunityColors } from '../design-system';

interface CreatePostButtonProps {
  onPress: () => void;
}

export function CreatePostButton({ onPress }: CreatePostButtonProps) {
  return (
    <TouchableOpacity 
      style={postStyles.fabContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconSymbol 
        name="pencil" 
        size={20} 
        color={CommunityColors.cardBackground}
        style={postStyles.fabIcon}
      />
      <Text style={postStyles.fabText}>Hỏi cộng đồng</Text>
    </TouchableOpacity>
  );
}