import { router } from "expo-router";
import { useEffect, useState } from "react";

export const mockDiagnosis = {
  disease: "Bệnh rỉ sắt",
  confidence: "92%",
  symptoms:
    "Bệnh rỉ sắt xuất hiện chủ yếu trên lá, các vết bệnh màu vàng nâu, dạng chấm nhỏ, phát triển lớn dần thành ổ bào tử hạ màu vàng nâu. Cuối cùng biến thành các vết như rỉ sắt màu nâu đen.",
  date: "8 tháng 1",
  recommendations: [
    { id: 1, name: "Thuốc A", description: "Phòng trừ nấm bệnh" },
    { id: 2, name: "Thuốc B", description: "Ức chế phát triển bào tử" },
    { id: 3, name: "Thuốc C", description: "Tăng sức đề kháng cây" },
  ],
};

export const useResultScreenVM = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const isDataError = Math.random() < 0.05;

        if (isDataError) {
          router.push({
            pathname: "/error",
            params: {
              title: "Không có dữ liệu",
              message:
                "Hệ thống không tìm thấy kết quả chẩn đoán cho ảnh này. Vui lòng thử lại.",
            },
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        router.push({
          pathname: "/error",
          params: {
            title: "Lỗi hệ thống",
            message: "Đã xảy ra lỗi khi tải kết quả chẩn đoán.",
          },
        });
      }
    };

    fetchDiagnosis();
  }, []);
  //GET /api/diagnosis/:id
  const handleViewMedicine = () => {
    router.push("/(tabs)/camera/detailCameraScreen");
  };

  const handleRediagnose = () => {
    router.push("/(tabs)/camera/cameraScreen");
  };

  const handleBackToCameraIndex = () => {
    router.navigate("/(tabs)/camera/cameraIndex");
  };

  return {
    isLoading,
    mockDiagnosis,
    handleViewMedicine,
    handleRediagnose,
    handleBackToCameraIndex,
  };
};
