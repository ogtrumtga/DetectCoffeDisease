import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { globalHistoryData } from "../../profile/viewmodels/profileLoggedInVM";
import { db } from "../../../../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const useDetailScreenVM = () => {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSaveHistory = async () => {
    setIsSaving(true);

    try {
      if (!user) {
        router.push({
          pathname: "/auth/login",
        });
        return;
      }

      const newId = Date.now().toString();
      const dateStr = new Date().toLocaleDateString("vi-VN");

      // Lưu lịch sử vào: users/{uid}/histories/{historyId}
      await setDoc(
        doc(db, "users", user.uid, "histories", newId),
        {
          id: newId,
          title: "Bệnh gỉ sắt",
          date: dateStr,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Cập nhật local để UI phản hồi ngay (Firestore sẽ được load lại khi focus screen)
      const newRecord = { id: newId, title: "Bệnh gỉ sắt", date: dateStr };
      globalHistoryData = [newRecord, ...globalHistoryData];

      Alert.alert("Thành công", "Đã lưu vào lịch sử chẩn đoán!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/profile/loggedInScreen"),
        },
      ]);
    } catch (e) {
      console.error("[detail-screenVM] handleSaveHistory failed:", e);
      router.push({
        pathname: "/error",
        params: {
          title: "Lỗi lưu trữ",
          message: "Không thể lưu vào Firebase Firestore.",
        },
      });
    } finally {
      setIsSaving(false);
    }
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
