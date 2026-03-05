import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { globalHistoryData } from "../../profile/viewmodels/profileLoggedInVM";

export const useDetailScreenVM = () => {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSaveHistory = async () => {
    setIsSaving(true);

    setTimeout(() => {
      const isError = Math.random() < 0.1; // Tỷ lệ lỗi 10%

      setIsSaving(false);
      if (isError) {
        router.push({
          pathname: "/error",
          params: {
            title: "Lỗi lưu trữ",
            message: "Không thể kết nối với máy chủ để lưu kết quả.",
          },
        });
      } else {
        const newRecord = {
          id: Date.now().toString(),
          title: "Bệnh gỉ sắt",
          date: new Date().toLocaleDateString("vi-VN"),
        };

        globalHistoryData.unshift(newRecord);

        Alert.alert("Thành công", "Đã lưu vào lịch sử chẩn đoán!", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/profile/loggedInScreen"),
          },
        ]);
      }
    }, 1500);
  };
  //POST /api/history
  //GET /api/medicines/:diseaseId
  //GET /api/history/:id

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/camera/cameraIndex");
    }
  };

  return {
    isSaving,
    handleSaveHistory,
    goBack,
  };
};
