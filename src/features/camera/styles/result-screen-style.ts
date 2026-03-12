// src/features/camera/styles/result-screen-style.ts
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2D3142",
    // Tránh camera giọt nước
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 15 : 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  resultCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    backgroundColor: "#F0FFF0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: "#40916C",
    fontSize: 12,
    fontWeight: "700",
  },
  diseaseName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E76F51",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3142",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
  },
  actionButtons: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  medicineButton: {
    backgroundColor: "#ABE0AC",
  },
  medicineButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
  rediagnoseButton: {
    marginTop: 15,
  },
  rediagnoseButtonText: {
    fontSize: 16,
    color: "#ABE0AC",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },
});
