/**
 * Create Post ViewModel
 * Logic cho màn hình tạo post
 */

import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import { CreatePostRequest } from '../models';
import { communityService } from '../services';

export const useCreatePostVM = () => {
  const { isLoggedIn } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Hủy', 'Chụp ảnh', 'Chọn từ thư viện'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openImageLibrary();
          }
        }
      );
    } else {
      // Android - show custom alert
      Alert.alert(
        'Chọn ảnh',
        'Bạn muốn chụp ảnh mới hay chọn từ thư viện?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Chụp ảnh', onPress: openCamera },
          { text: 'Thư viện', onPress: openImageLibrary },
        ]
      );
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập camera để chụp ảnh');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const validateForm = (): string | null => {
    if (!title.trim()) {
      return 'Vui lòng nhập câu hỏi';
    }

    if (!description.trim()) {
      return 'Vui lòng nhập mô tả';
    }

    return null;
  };

  const handleSubmit = async (): Promise<boolean> => {
    // Authentication guard - block guests from creating posts
    if (!isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thực hiện hành động này',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => router.push('/auth/login') }
        ]
      );
      return false;
    }

    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Lỗi', validationError);
      return false;
    }

    setIsSubmitting(true);

    try {
      const newPostData: CreatePostRequest = {
        title: title.trim(),
        content: description.trim(),
        image: selectedImage || undefined,
      };

      await communityService.createPost(newPostData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedImage(null);
      
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Lỗi', 'Không thể đăng câu hỏi. Vui lòng thử lại.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title.trim() && description.trim() && !isSubmitting;

  return {
    // State
    title,
    description,
    selectedImage,
    isSubmitting,
    canSubmit,

    // Actions
    setTitle,
    setDescription,
    handleImagePicker,
    removeImage,
    handleSubmit
  };
};