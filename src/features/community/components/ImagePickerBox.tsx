/**
 * Image Picker Box Component
 * Component để chụp/chọn ảnh
 */

import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createPostStyles } from '../styles';
import { CommunityColors } from '../design-system';

interface ImagePickerBoxProps {
  selectedImage: string | null;
  onImagePicker: () => void;
  onRemoveImage: () => void;
}

export function ImagePickerBox({ 
  selectedImage, 
  onImagePicker, 
  onRemoveImage 
}: ImagePickerBoxProps) {
  if (selectedImage) {
    return (
      <View style={createPostStyles.imageContainer}>
        <Image 
          source={{ uri: selectedImage }} 
          style={createPostStyles.selectedImage} 
        />
        <TouchableOpacity 
          onPress={onRemoveImage} 
          style={createPostStyles.removeImageButton}
        >
          <IconSymbol 
            name="xmark" 
            size={16} 
            color={CommunityColors.cardBackground} 
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onImagePicker} 
      style={createPostStyles.cameraButton}
    >
      <IconSymbol 
        name="camera" 
        size={32} 
        color={CommunityColors.captionText} 
      />
    </TouchableOpacity>
  );
}