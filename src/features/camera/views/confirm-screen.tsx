// src/features/camera/views/confirm-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmScreen() {
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

    // Mô phỏng quá trình gọi API phân tích
    setTimeout(() => {
      // Giả lập một tỷ lệ lỗi nhỏ (ví dụ 10%) để kiểm tra trang Error
      const isError = Math.random() < 0.1;

      if (isError) {
        setLoading(false);
        hasStartedRef.current = false; // Reset để có thể thử lại

        // GỌI TRANG BÁO LỖI
        router.push({
          pathname: "../error",
          params: {
            title: "Phân tích thất bại",
            message:
              "AI không thể nhận diện được loại cây trong ảnh. Vui lòng chụp ảnh rõ nét hơn hoặc thử lại sau.",
          },
        });
      } else {
        // Thành công chuyển đến trang kết quả
        router.push("../camera/result-screen");
      }
    }, 2500);
  };

  const cancelAnalysis = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xác nhận ảnh</Text>
      </View>

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A9D8F" />
            <Text style={styles.loadingText}>AI đang phân tích...</Text>
            <Text style={styles.loadingSubtext}>
              Vui lòng đợi trong giây lát
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.countdownContainer}>
              <View style={styles.countdownCircle}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
              <Text style={styles.countdownLabel}>Bắt đầu phân tích sau</Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelAnalysis}
              >
                <Ionicons name="close-circle" size={24} color="#E76F51" />
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={startAnalysis}
              >
                <Ionicons name="play-circle" size={24} color="white" />
                <Text style={styles.confirmButtonText}>Phân tích ngay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#2D3142",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  content: {
    padding: 30,
    alignItems: "center",
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  countdownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ABE0AC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  countdownText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3142",
  },
  countdownLabel: {
    fontSize: 16,
    color: "#666",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#E76F51",
  },
  cancelButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#E76F51",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#2A9D8F",
  },
  confirmButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3142",
    marginTop: 20,
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
  },
});
