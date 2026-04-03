//src/features/camera/viewmodels/feedback-screenVM.ts
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

export const useFeedbackVM = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = useMemo(() => {
    const currentRating = Number(rating);

    switch (currentRating) {
      case 1:
        return [
          "Kết quả chẩn đoán hoàn toàn sai lệch.",
          "Giao diện khó sử dụng, phản hồi chậm.",
          "Thông tin thuốc khuyến nghị không hữu ích.",
          "Ứng dụng gặp lỗi trong quá trình phân tích.",
        ];
      case 2:
        return [
          "Kết quả chẩn đoán tạm chấp nhận được.",
          "Cần bổ sung thêm nhiều loại thuốc khuyến nghị hơn.",
          "Tốc độ phân tích ảnh cần cải thiện thêm.",
          "Giao diện cần trực quan hơn một chút.",
        ];
      case 3:
        return [
          "Kết quả chẩn đoán rất chính xác.",
          "Thông tin thuốc và link mua rất hữu ích.",
          "Tốc độ phân tích ảnh rất nhanh.",
          "Sẽ tiếp tục sử dụng cho các lần sau.",
        ];
      default:
        return [];
    }
  }, [rating]);

  const handleSetRating = useCallback((id: number) => {
    setRating(id);
    setSelectedStatus(null);
  }, []);

  const handleSendFeedback = async () => {
    if (selectedStatus === null || rating === null) {
      Alert.alert("Thông báo", "Vui lòng chọn nội dung phản hồi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Giả lập gọi API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Thành công", "Cảm ơn bạn đã gửi phản hồi!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi phản hồi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    rating,
    setRating: handleSetRating,
    selectedStatus,
    setSelectedStatus,
    statusOptions,
    handleSendFeedback,
    isSubmitting,
  };
};
