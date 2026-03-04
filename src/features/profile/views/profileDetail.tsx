import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
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
        <TouchableOpacity style={styles.avatarBox} onPress={pickImage}>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={{ width: "100%", height: "100%", borderRadius: 14 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={55} color="#A0A0A0" />
          )}

          <View
            style={{
              position: "absolute",
              bottom: -5,
              right: -5,
              backgroundColor: "#FFF",
              borderRadius: 15,
              padding: 5,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
            }}
          >
            <Ionicons name="camera" size={18} color="#4C57A1" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.counterText}>{user.bio.length}/50</Text>
        </View>

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
    </View>
  );
}
