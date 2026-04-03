// src/features/profile/views/profileDetail.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles/profileDetail-style";
import { useProfileDetailVM } from "../viewmodels/profileDetailVM";

export default function ProfileEditScreen() {
  const {
    user,
    setUser,
    passwords,
    setPasswords,
    isChangingPassword,
    setIsChangingPassword,
    loading,
    showMenu,
    setShowMenu,
    handleGoBack,
    handleSaveProfile,
    handleLogout,
    navigateToRegister,
    pickImage,
  } = useProfileDetailVM();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.blackHeader}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreIconContainer}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.menuItem}>tài khoản mới</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        {/* Box chứa ảnh được bo tròn và overflow hidden */}
        <View style={styles.avatarBox}>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={55} color="#A0A0A0" />
          )}
        </View>

        {/* Nút camera nằm ngoài avatarBox để không bị cắt thành hình tròn */}
        <TouchableOpacity
          style={styles.cameraIconContainer}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={20} color="#4C57A1" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Tổng chỉ</Text>

          <View style={styles.inputField}>
            <Text style={styles.rightLabel}>Tên tài khoản</Text>
            <TextInput
              style={styles.textInput}
              value={user.name}
              onChangeText={(t) => setUser({ ...user, name: t })}
            />
          </View>

          <View style={styles.inputField}>
            <Text style={styles.rightLabel}>Giới thiệu thân thể</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={user.bio}
              multiline
              maxLength={50}
              onChangeText={(t) => setUser({ ...user, bio: t })}
            />
            <Text style={styles.counterText}>{(user.bio || "").length}/50</Text>
          </View>

          <Text style={styles.sectionTitle}>Mật khẩu</Text>

          {!isChangingPassword ? (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setIsChangingPassword(true)}
            >
              <Text style={[styles.logoutText, { color: "#4C57A1" }]}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.inputField}>
                <Text style={styles.rightLabel}>Mật khẩu mới</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwords.newPass}
                  secureTextEntry
                  autoFocus
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor="#DDD"
                  onChangeText={(t) =>
                    setPasswords({ ...passwords, newPass: t })
                  }
                />
              </View>

              <View style={styles.inputField}>
                <Text style={styles.rightLabel}>Xác nhận mật khẩu</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwords.confirmPass}
                  secureTextEntry
                  onChangeText={(t) =>
                    setPasswords({ ...passwords, confirmPass: t })
                  }
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setIsChangingPassword(false);
                  setPasswords({ newPass: "", confirmPass: "" });
                }}
              >
                <Text
                  style={[
                    styles.counterText,
                    { color: "#FF8A8A", textAlign: "left" },
                  ]}
                >
                  Hủy đổi mật khẩu
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.8 }]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
