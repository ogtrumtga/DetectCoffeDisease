import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

export const useConfirmScreenVM = () => {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      startAnalysis();
    }
  }, [countdown]);

  const startAnalysis = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setLoading(true);

    setTimeout(() => {
      const isError = Math.random() < 0.1; // Tỷ lệ lỗi giả lập 10%

      if (isError) {
        setLoading(false);
        hasStartedRef.current = false;

        router.push({
          pathname: "/error",
          params: {
            title: "Phân tích thất bại",
            message:
              "AI không thể nhận diện được loại cây trong ảnh. Vui lòng chụp ảnh rõ nét hơn hoặc thử lại sau.",
          },
        });
      } else {
        router.push("/(tabs)/camera/resultScreen");
      }
    }, 2500);
  };
  //POST /api/camera/analyze
  //POST /api/history

  const cancelAnalysis = () => {
    router.back();
  };

  return {
    imageUri,
    loading,
    countdown,
    startAnalysis,
    cancelAnalysis,
  };
};