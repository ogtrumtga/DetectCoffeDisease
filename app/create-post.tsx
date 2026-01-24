import { IconSymbol } from '@/components/ui/icon-symbol';
import { communityAPI } from '@/services/community/communityAPI';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function CreatePostScreen() {
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập câu hỏi');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả');
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo post mới với dữ liệu hiện tại
      const newPostData = {
        title: title.trim(),
        content: description.trim(),
        image: selectedImage || undefined,
      };

      // TODO: Gọi API để tạo post thật
      const createdPost = await communityAPI.createPost(newPostData);

      // Simulate API call thành công
      setTimeout(() => {
        Alert.alert('Thành công', 'Câu hỏi đã được đăng thành công!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
              // Trigger refresh ở community screen
              router.setParams({ refresh: Date.now().toString() });
            },
          },
        ]);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Lỗi', 'Không thể đăng câu hỏi. Vui lòng thử lại.');
    }
  };

  const canSubmit = title.trim() && description.trim() && !isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Tạo câu hỏi</Text>
        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.submitButton, { opacity: canSubmit ? 1 : 0.5 }]}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Đang đăng...' : 'Đăng'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Image Section */}
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                  <IconSymbol name="xmark" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton}>
                <IconSymbol name="camera" size={32} color="#9CA3AF" />
              </TouchableOpacity>
            )}

            {/* Title Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Câu hỏi</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Câu hỏi của bạn"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={2000}
                multiline
                textAlignVertical="top"
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <Text style={styles.characterCount}>{title.length}/2000</Text>
            </View>

            {/* Description Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Mô tả tình trạng cây của bạn"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                maxLength={5000}
                multiline
                textAlignVertical="top"
                blurOnSubmit={false}
                returnKeyType="done"
              />
              <Text style={styles.characterCount}>{description.length}/5000</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#DAF1DE',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for keyboard
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
});