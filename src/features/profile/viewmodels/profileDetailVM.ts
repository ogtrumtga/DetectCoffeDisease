// src/features/profile/viewmodels/profileDetailVM.ts
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { PROFILE_MESSAGES } from "../constants/profileC";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadImageToFirebase } from "@/src/services/imageUploadService";

export const useProfileDetailVM = () => {
  const router = useRouter();
  const { user: authUser, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({
    name: "Người dùng",
    bio: "Giới thiệu thân thế",
    avatar: null as string | null,
  });
  
  // State quản lý việc ẩn hiện ô nhập mật khẩu
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPass: "",
    confirmPass: "",
  });

  // Load user data từ Firestore khi component mount
  // LUÔN ƯU TIÊN photoURL từ Firestore (đã cập nhật) thay vì Firebase Auth
  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            name: data.displayName || data.name || authUser.displayName || "Người dùng",
            bio: data.bio || "Giới thiệu thân thế",
            avatar: data.photoURL || null, // ✅ Luôn lấy từ Firestore (đã cập nhật)
          });
        } else {
          // Fallback nếu chưa có document (trường hợp hiếm)
          setUser({
            name: authUser.displayName || "Người dùng",
            bio: "Giới thiệu thân thế",
            avatar: authUser.photoURL || null,
          });
        }
      } catch (e) {
        console.error("[profileDetailVM] loadUserData failed:", e);
      }
    };

    loadUserData();
  }, [authUser]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)/profile/loggedInScreen");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  const handleSaveProfile = async () => {
    if (!authUser) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập");
      return;
    }

    // Kiểm tra logic mật khẩu nếu đang mở chế độ đổi mật khẩu
    if (isChangingPassword) {
      if (!passwords.newPass || !passwords.confirmPass) {
        const fillError = "Vui lòng nhập đầy đủ thông tin mật khẩu";
        if (Platform.OS === "web") Alert.alert("Lỗi", fillError);
        else Alert.alert("Lỗi", fillError);
        return;
      }
      if (passwords.newPass !== passwords.confirmPass) {
        const passError = "Mật khẩu xác nhận không khớp";
        Alert.alert("Lỗi", passError);
        return;
      }
      if (passwords.newPass.length < 6) {
        const lengthError = "Mật khẩu phải từ 6 ký tự trở lên";
        Alert.alert("Lỗi", lengthError);
        return;
      }
    }

    // Validate tên
    if (user.name.length < 2) {
      const errorMsg = "Tên phải có ít nhất 2 ký tự";
      Alert.alert("Lỗi", errorMsg);
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = user.avatar;

      // CÁCH 1: Lưu ảnh dạng Base64 trong Firestore (không cần Firebase Storage)
      if (user.avatar && user.avatar.startsWith("file://")) {
        console.log("[profileDetailVM] Converting avatar to base64...");
        
        // Resize ảnh xuống 200x200 để giảm dung lượng
        const { manipulateAsync, SaveFormat } = await import('expo-image-manipulator');
        const resizedImage = await manipulateAsync(
          user.avatar,
          [{ resize: { width: 200, height: 200 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        // Convert to base64
        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        avatarUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        console.log("[profileDetailVM] Avatar converted to base64");
      }

      // Cập nhật Firestore
      const userRef = doc(db, "users", authUser.uid);
      await updateDoc(userRef, {
        displayName: user.name,
        bio: user.bio,
        photoURL: avatarUrl || "",
        updatedAt: new Date(),
      });

      console.log("[profileDetailVM] Profile updated successfully");

      // Refresh user profile trong AuthContext để cập nhật avatar ngay lập tức
      await refreshUserProfile();

      const successMsg = PROFILE_MESSAGES?.UPDATE_SUCCESS_BODY || "Cập nhật thành công";

      Alert.alert(
        PROFILE_MESSAGES?.UPDATE_SUCCESS_TITLE || "Thành công",
        successMsg,
        [{ text: "OK", onPress: () => handleGoBack() }],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error("[profileDetailVM] Save profile failed:", error);
      const errorMsg = error.message || "Cập nhật thất bại";
      Alert.alert("Lỗi", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // POST /api/auth/logout
  // PUT /api/users/me
  // PUT /api/users/me/avatar
  // DELETE /api/users/me
  const handleLogout = () => router.replace("/(tabs)/profile/guestScreen");

  const navigateToRegister = () => {
    setShowMenu(false);
    router.push("/auth/register");
  };

  return {
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
  };
};