// src/features/camera/styles/feedback-screen.ts
import { StyleSheet } from "react-native";

export const feedbackStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FBF9",
    marginTop: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  ratingBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  selectedRating: {
    borderColor: "#2A9D8F",
    backgroundColor: "#F1F8E9",
  },
  ratingText: {
    fontSize: 12,
    marginTop: 5,
    color: "#666",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  selectedStatusItem: {
    borderColor: "#2A9D8F",
    backgroundColor: "#F1F8E9", // Thêm nền nhẹ khi chọn tình trạng
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCC",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#2A9D8F",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#2A9D8F",
  },
  submitBtn: {
    backgroundColor: "#ABE0AC", // Đã đổi sang màu xanh nhạt giống nút "Lưu vào lịch sử"
    padding: 16,
    borderRadius: 30, // Bo tròn nhiều hơn để khớp style button chính
    alignItems: "center",
    marginTop: 15,
    marginBottom: 8,
    // Đổ bóng nhẹ cho nút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
