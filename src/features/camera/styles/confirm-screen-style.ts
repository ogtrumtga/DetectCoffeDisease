// src/features/camera/styles/confirm-screen-style.ts
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#ffffff",
    // Xử lý khoảng cách an toàn cho camera giọt nước/tai thỏ
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 50,
    paddingBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#ABE0AC",
    fontSize: 20,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: Platform.OS === "ios" ? 40 : 30, // Tránh thanh home bar
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // Tạo hiệu ứng đè lên ảnh
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
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: "47%",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#E76F51",
  },
  cancelButtonText: {
    fontSize: 15,
    color: "#E76F51",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#2A9D8F",
  },
  confirmButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
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
    marginTop: 5,
    textAlign: "center",
  },
});
