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
    setLoading(true);

    setTimeout(() => {
      const isError = user.name.length < 2;
      setLoading(false);

      if (isError) {
        const errorMsg = PROFILE_MESSAGES.UPDATE_ERROR_BODY;
        // Kiểm tra nếu là Web (Windows)
        if (Platform.OS === "web") {
          window.alert(errorMsg);
        } else {
          Alert.alert(PROFILE_MESSAGES.UPDATE_ERROR_TITLE, errorMsg);
        }
      } else {
        // 1. Cập nhật dữ liệu vào biến Global
        globalUserData.name = user.name;
        globalUserData.bio = user.bio;
        globalUserData.avatar = user.avatar;

        const successMsg = PROFILE_MESSAGES.UPDATE_SUCCESS_BODY;

        // 2. Xử lý thông báo đa nền tảng
        if (Platform.OS === "web") {
          // window.alert là hàm "blocking" - nó sẽ dừng JS cho đến khi bạn bấm OK
          window.alert(successMsg);
          handleGoBack(); // Quay về sau khi bấm OK trên trình duyệt
        } else {
          // Alert native trên Mobile
          Alert.alert(
            PROFILE_MESSAGES.UPDATE_SUCCESS_TITLE,
            successMsg,
            [{ text: "OK", onPress: () => handleGoBack() }],
            { cancelable: false },
          );
        }
      }
    }, 1000);
  };
//POST /api/auth/logout
  //PUT /api/users/me
  //PUT /api/users/me/avatar
  //DELETE /api/users/me
  const handleLogout = () => router.replace("/(tabs)/profile/guestScreen");
  const navigateToRegister = () => {
    setShowMenu(false);
    router.push("/auth/register");
  };

  return {
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
  };
};
