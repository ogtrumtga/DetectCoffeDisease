// src/features/profile/viewmodels/profileDetailVM.ts
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { PROFILE_MESSAGES } from "../constants/profileC";
import { globalUserData } from "./profileLoggedInVM";

export const useProfileDetailVM = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({ ...globalUserData });
  
  // State quản lý việc ẩn hiện ô nhập mật khẩu
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPass: "",
    confirmPass: "",
  });

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
    // Kiểm tra logic mật khẩu nếu đang mở chế độ đổi mật khẩu
    if (isChangingPassword) {
      if (!passwords.newPass || !passwords.confirmPass) {
        const fillError = "Vui lòng nhập đầy đủ thông tin mật khẩu";
        if (Platform.OS === "web") window.alert(fillError);
        else Alert.alert("Lỗi", fillError);
        return;
      }
      if (passwords.newPass !== passwords.confirmPass) {
        const passError = "Mật khẩu xác nhận không khớp";
        if (Platform.OS === "web") window.alert(passError);
        else Alert.alert("Lỗi", passError);
        return;
      }
      if (passwords.newPass.length < 6) {
        const lengthError = "Mật khẩu phải từ 6 ký tự trở lên";
        if (Platform.OS === "web") window.alert(lengthError);
        else Alert.alert("Lỗi", lengthError);
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      // Logic kiểm tra lỗi: tên quá ngắn (từ Bản 2)
      // hoặc xác suất ngẫu nhiên (từ Bản 1)
      const isError = user.name.length < 2 || Math.random() < 0.1;
      setLoading(false);

      if (isError) {
        const errorMsg =
          PROFILE_MESSAGES?.UPDATE_ERROR_BODY || "Cập nhật thất bại";
        if (Platform.OS === "web") {
          window.alert(errorMsg);
        } else {
          Alert.alert(PROFILE_MESSAGES?.UPDATE_ERROR_TITLE || "Lỗi", errorMsg);
        }
      } else {
        // Cập nhật dữ liệu vào biến Global
        globalUserData.name = user.name;
        globalUserData.bio = user.bio;
        globalUserData.avatar = user.avatar;

        const successMsg =
          PROFILE_MESSAGES?.UPDATE_SUCCESS_BODY || "Cập nhật thành công";

        if (Platform.OS === "web") {
          window.alert(successMsg);
          handleGoBack();
        } else {
          Alert.alert(
            PROFILE_MESSAGES?.UPDATE_SUCCESS_TITLE || "Thành công",
            successMsg,
            [{ text: "OK", onPress: () => handleGoBack() }],
            { cancelable: false },
          );
        }
      }
    }, 1000);
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