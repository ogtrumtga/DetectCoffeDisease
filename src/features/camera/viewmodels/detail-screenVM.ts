/**
 * detail-screenVM.ts
 *
 * Nhận diagnosisId từ params (truyền từ resultScreen).
 * Kết quả đã được lưu vào Firestore bởi backend khi predict.
 * Không cần lưu lại — chỉ cần navigate về profile để xem lịch sử.
 */
import { useRouter, useLocalSearchParams } from "expo-router";

export const useDetailScreenVM = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    diagnosisId: string;
    diseaseName: string;
    treatment: string;
    imageUrl: string;
  }>();

  const diagnosisId = params.diagnosisId ?? "";
  const diseaseName = params.diseaseName ?? "Không xác định";
  const treatment = params.treatment ?? "";
  const imageUrl = params.imageUrl ?? "";

  /**
   * Kết quả đã được backend lưu vào collection diagnoses khi predict.
   * Chỉ cần navigate về profile để xem lịch sử.
   */
  const handleViewHistory = () => {
    router.push("/(tabs)/profile/loggedInScreen");
  };

  const handleRediagnose = () => {
    router.push("/(tabs)/camera/cameraScreen");
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/camera/cameraIndex");
    }
  };

  return {
    diagnosisId,
    diseaseName,
    treatment,
    imageUrl,
    handleViewHistory,
    handleRediagnose,
    goBack,
  };
};
