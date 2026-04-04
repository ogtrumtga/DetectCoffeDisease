/**
 * result-screenVM.ts
 *
 * Nhận kết quả chẩn đoán từ params (được truyền từ confirm-screenVM sau khi predict).
 * Không còn dùng mock data.
 */
import { router, useLocalSearchParams } from "expo-router";

export const useResultScreenVM = () => {
  const params = useLocalSearchParams<{
    diagnosisId: string;
    diseaseName: string;
    confidence: string;
    severity: string;
    color: string;
    description: string;
    treatment: string;
    imageUrl: string;
    summary: string;
  }>();

  const diagnosis = {
    diagnosisId: params.diagnosisId ?? "",
    disease: params.diseaseName ?? "Không xác định",
    confidence: params.confidence ? `${Math.round(Number(params.confidence) * 100)}%` : "N/A",
    severity: params.severity ?? "none",
    color: params.color ?? "#4CAF50",
    symptoms: params.description ?? "",
    treatment: params.treatment ?? "",
    imageUrl: params.imageUrl ?? "",
    summary: (() => {
      try { return JSON.parse(params.summary ?? "{}"); }
      catch { return {}; }
    })(),
  };

  const handleViewMedicine = () => {
    router.push({
      pathname: "/(tabs)/camera/detailCameraScreen",
      params: {
        diagnosisId: diagnosis.diagnosisId,
        diseaseName: diagnosis.disease,
        treatment: diagnosis.treatment,
        imageUrl: diagnosis.imageUrl,
      },
    });
  };

  const handleRediagnose = () => {
    router.push("/(tabs)/camera/cameraScreen");
  };

  const handleBackToCameraIndex = () => {
    router.navigate("/(tabs)/camera/cameraIndex");
  };

  return {
    isLoading: false,
    diagnosis,
    handleViewMedicine,
    handleRediagnose,
    handleBackToCameraIndex,
  };
};
