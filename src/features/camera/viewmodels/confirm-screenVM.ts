/**
 * confirm-screenVM.ts
 *
 * Flow thực tế khi user xác nhận ảnh:
 *  1. Upload ảnh lên backend  → POST /api/diagnosis/upload-image  → imageID
 *  2. Chạy YOLO (best.pt)     → POST /api/diagnosis/predict       → diagnosisId + kết quả
 *  3. Navigate sang resultScreen với diagnosisId để hiển thị kết quả
 */
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "../../../config/api";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";

// Types
interface UploadResponse {
  imageID: string;
}

interface DiagnosisResponse {
  diagnosisId: string;
  primaryDiseaseName?: string;
  confidence?: number;
  severity?: string;
  color?: string;
  description?: string;
  treatment?: string;
  imageUrl?: string;
  summary?: Record<string, number>;
}

interface ErrorResponse {
  detail?: string;
}

export const useConfirmScreenVM = () => {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Đang chuẩn bị...");
  const [countdown, setCountdown] = useState(3);
  const hasStartedRef = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      startAnalysis();
    }
  }, [countdown]);

  const startAnalysis = async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setLoading(true);

    try {
      // ── Bước 1: Lấy token xác thực ──────────────────────────────────────
      const token = user ? await user.getIdToken() : null;

      // ── Bước 2: Upload ảnh lên Cloudinary qua backend ───────────────────
      setStatusText("Đang tải ảnh lên...");
      console.log("[confirm-screenVM] Starting upload to:", API_ENDPOINTS.DIAGNOSIS_UPLOAD);

      const formData = new FormData();
      const filename = imageUri.split("/").pop() ?? "photo.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: mimeType,
      } as any);

      // Thêm token vào FormData thay vì header để tránh CORS preflight
      if (token) {
        formData.append("token", token);
      }

      const uploadRes = await fetchWithTimeout(API_ENDPOINTS.DIAGNOSIS_UPLOAD, {
        method: "POST",
        body: formData as any,
        timeout: 60000, // 60 giây cho upload
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({})) as ErrorResponse;
        const errorMsg = err.detail ?? `Upload failed (${uploadRes.status})`;
        console.error("[confirm-screenVM] Upload error:", errorMsg);
        throw new Error(errorMsg);
      }

      const uploadData = await uploadRes.json() as UploadResponse;
      const imageID = uploadData.imageID;
      if (!imageID) throw new Error("Không nhận được imageID từ server");
      
      console.log("[confirm-screenVM] Upload success, imageID:", imageID);

      // ── Bước 3: Chạy YOLO predict ────────────────────────────────────────
      setStatusText("Đang phân tích bệnh...");
      console.log("[confirm-screenVM] Starting prediction for imageID:", imageID);

      // Gửi token trong body thay vì header để tránh CORS preflight
      // Tăng imgSize lên 640 để model detect tốt hơn (thay vì 416)
      // Giảm confThreshold xuống 0.10 để detect dễ hơn (thay vì 0.15)
      const predictRes = await fetchWithTimeout(API_ENDPOINTS.DIAGNOSIS_PREDICT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          imageId: imageID, 
          imgSize: 640,  // Tăng từ 416 → 640 để chi tiết hơn
          confThreshold: 0.10,  // Giảm từ 0.15 → 0.10 để detect dễ hơn
          token: token || undefined,
        }),
        timeout: 120000, // 120 giây cho YOLO prediction
      });

      if (!predictRes.ok) {
        const err = await predictRes.json().catch(() => ({})) as ErrorResponse;
        const errorMsg = err.detail ?? `Predict failed (${predictRes.status})`;
        
        // Nếu là lỗi validation (400), đây là expected behavior, không phải lỗi hệ thống
        if (predictRes.status === 400 && err.detail) {
          console.log("[confirm-screenVM] Validation failed:", errorMsg);
          throw new Error(err.detail);
        }
        
        // Các lỗi khác mới log error
        console.error("[confirm-screenVM] Predict error:", errorMsg);
        throw new Error(errorMsg);
      }

      const diagnosisData = await predictRes.json() as DiagnosisResponse;
      const diagnosisId = diagnosisData.diagnosisId;
      if (!diagnosisId) throw new Error("Không nhận được diagnosisId từ server");

      console.log("[confirm-screenVM] Prediction success, diagnosisId:", diagnosisId);

      // ── Bước 4: Navigate sang resultScreen với kết quả ──────────────────
      setLoading(false);
      router.push({
        pathname: "/(tabs)/camera/resultScreen",
        params: {
          diagnosisId,
          diseaseName: diagnosisData.primaryDiseaseName ?? "",
          confidence: String(diagnosisData.confidence ?? 0),
          severity: diagnosisData.severity ?? "",
          color: diagnosisData.color ?? "#4CAF50",
          description: diagnosisData.description ?? "",
          treatment: diagnosisData.treatment ?? "",
          imageUrl: diagnosisData.imageUrl ?? "",
          summary: JSON.stringify(diagnosisData.summary ?? {}),
        },
      });
    } catch (error: any) {
      // Phân biệt validation error vs system error
      const isValidationError = error.message?.includes('❌') || error.message?.includes('⚠️');
      
      if (isValidationError) {
        console.log("[confirm-screenVM] Validation:", error.message);
      } else {
        console.error("[confirm-screenVM] System error:", error);
      }
      
      setLoading(false);
      hasStartedRef.current = false;
      router.push({
        pathname: "/error",
        params: {
          title: isValidationError ? "Vui lòng chụp lại" : "Phân tích thất bại",
          message: error.message ?? "Không thể kết nối đến server. Kiểm tra IP trong .env và backend đang chạy.",
        },
      });
    }
  };

  const cancelAnalysis = () => {
    router.back();
  };

  return {
    imageUri,
    loading,
    statusText,
    countdown,
    startAnalysis,
    cancelAnalysis,
  };
};
