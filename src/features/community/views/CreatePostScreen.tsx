/**
 * Create Post Screen
 * Màn hình tạo post mới
 */
// src/features/community/views/CreatePostScreen.tsx
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeArea } from "../../../../components/SafeArea";
import { IconSymbol } from "../../../../components/ui/icon-symbol";
import { ImagePickerBox } from "../components";
import { VALIDATION_RULES } from "../constants";
import { CommunityColors } from "../design-system";
import { createPostStyles } from "../styles";
import { useCreatePostVM } from "../viewmodels";

export default function CreatePostScreen() {
  const {
    title,
    description,
    selectedImage,
    isSubmitting,
    canSubmit,
    setTitle,
    setDescription,
    handleImagePicker,
    removeImage,
    handleSubmit,
  } = useCreatePostVM();

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      Alert.alert("Thành công", "Câu hỏi đã được đăng thành công!", [
        {
          text: "OK",
          onPress: () => {
            router.back();
            // Trigger refresh ở community screen
            router.setParams({ refresh: Date.now().toString() });
          },
        },
      ]);
    }
  };

  return (
    <SafeArea style={createPostStyles.container}>
      {/* Header */}
      <View style={createPostStyles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={createPostStyles.closeButton}
        >
          <IconSymbol
            name="xmark"
            size={24}
            color={CommunityColors.titleText}
          />
        </TouchableOpacity>

        <Text style={createPostStyles.headerTitle}>Tạo câu hỏi</Text>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[
            createPostStyles.submitButton,
            { opacity: canSubmit ? 1 : 0.5 },
          ]}
        >
          <Text style={createPostStyles.submitButtonText}>
            {isSubmitting ? "Đang đăng..." : "Đăng"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={createPostStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={createPostStyles.scrollView}
            contentContainerStyle={createPostStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Image Section */}
            <ImagePickerBox
              selectedImage={selectedImage}
              onImagePicker={handleImagePicker}
              onRemoveImage={removeImage}
            />

            {/* Title Input */}
            <View style={createPostStyles.inputSection}>
              <Text style={createPostStyles.inputLabel}>Câu hỏi</Text>
              <TextInput
                style={createPostStyles.titleInput}
                placeholder="Câu hỏi của bạn"
                placeholderTextColor={CommunityColors.captionText}
                value={title}
                onChangeText={setTitle}
                maxLength={VALIDATION_RULES.POST.TITLE_MAX_LENGTH}
                multiline
                textAlignVertical="top"
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <Text style={createPostStyles.characterCount}>
                {title.length}/{VALIDATION_RULES.POST.TITLE_MAX_LENGTH}
              </Text>
            </View>

            {/* Description Input */}
            <View style={createPostStyles.inputSection}>
              <Text style={createPostStyles.inputLabel}>Mô tả</Text>
              <TextInput
                style={createPostStyles.descriptionInput}
                placeholder="Mô tả tình trạng cây của bạn"
                placeholderTextColor={CommunityColors.captionText}
                value={description}
                onChangeText={setDescription}
                maxLength={VALIDATION_RULES.POST.CONTENT_MAX_LENGTH}
                multiline
                textAlignVertical="top"
                blurOnSubmit={false}
                returnKeyType="done"
              />
              <Text style={createPostStyles.characterCount}>
                {description.length}/{VALIDATION_RULES.POST.CONTENT_MAX_LENGTH}
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
