// src/features/camera/views/result-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockDiagnosis = {
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

export default function ResultScreen() {
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

  const handleViewMedicine = () => {
    router.push("/(tabs)/camera/detailCameraScreen");
  };

  const handleRediagnose = () => {
    router.push("/(tabs)/camera/cameraScreen");
  };

  const handleBackToCameraIndex = () => {
    // router.replace("/(tabs)/camera/cameraIndex");
    router.navigate("/(tabs)/camera/cameraIndex");
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Đang tải kết quả...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToCameraIndex}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả chẩn đoán</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Chẩn đoán</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {mockDiagnosis.confidence} chính xác
              </Text>
            </View>
          </View>

          <Text style={styles.diseaseName}>{mockDiagnosis.disease}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Triệu chứng</Text>
            <Text style={styles.sectionContent}>{mockDiagnosis.symptoms}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.medicineButton]}
            onPress={handleViewMedicine}
          >
            <Text style={styles.medicineButtonText}>Xem thuốc điều trị</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.rediagnoseButton]}
          onPress={handleRediagnose}
        >
          <Text style={styles.rediagnoseButtonText}>Chẩn đoán lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2D3142",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3142",
  },
  confidenceBadge: {
    borderRadius: 15,
  },
  confidenceText: {
    color: "#2A9D8F",
    fontSize: 12,
    fontWeight: "600",
  },
  diseaseName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E76F51",
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3142",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 160,
    justifyContent: "center",
  },
  medicineButton: {
    backgroundColor: "#2A9D8F",
  },
  medicineButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  rediagnoseButton: {
    marginTop: 10,
  },
  rediagnoseButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2A9D8F",
    fontWeight: "600",
  },
});
