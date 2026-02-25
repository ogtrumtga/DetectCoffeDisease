import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
// Import store giả từ trang profile (Trong thực tế nên dùng Context)
import { globalHistoryData } from "../../profile/views/profileLoggedIn";

export default function DetailScreen() {
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
        // 1. Thêm dữ liệu mới vào "kho"
        const newRecord = {
          id: Date.now().toString(), // Tạo ID ngẫu nhiên
          title: "Bệnh gỉ sắt",
          date: new Date().toLocaleDateString('vi-VN'),
        };
        
        globalHistoryData.unshift(newRecord); // Thêm vào đầu danh sách

        // 2. Thông báo và chuyển hướng
        Alert.alert("Thành công", "Đã lưu vào lịch sử chẩn đoán!", [
          { 
            text: "OK", 
            onPress: () => router.push("/(tabs)/profile/loggedInScreen") 
          }
        ]);
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/(tabs)/camera/cameraIndex");
          }}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả ngày {new Date().getDate()}/{new Date().getMonth() + 1}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionHeading}>Kết quả chẩn đoán</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.diseaseNameText}>Bệnh gỉ sắt</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#333"
              style={styles.arrowIcon}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>2</Text>
            </View>
            <Text style={styles.sectionHeading}>Thuốc khuyến nghị</Text>
          </View>

          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.medicineItem}>
              <View>
                <Text style={styles.medTitle}>Thuốc khuyến nghị {item}</Text>
                <Text style={styles.medSub}>Mô tả cơ bản thuốc</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.linkText}>Link mua thuốc</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.mainActionBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSaveHistory}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.mainActionBtnText}>
              Lưu vào lịch sử chẩn đoán
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#F9FCF9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 10,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionContainer: { marginTop: 25 },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  numberBadge: {
    backgroundColor: "#ABE0AC",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberBadgeText: { color: "white", fontWeight: "bold", fontSize: 18 },
  sectionHeading: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
  },
  diseaseNameText: { fontSize: 16, fontWeight: "600", flex: 1 },
  arrowIcon: { marginLeft: "auto" },
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  medTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  medSub: { fontSize: 13, color: "#666", marginTop: 4 },
  linkText: {
    color: "#0000FF",
    fontSize: 12,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  mainActionBtn: {
    backgroundColor: "#ABE0AC",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  mainActionBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
});