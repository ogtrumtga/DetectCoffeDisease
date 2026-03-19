// src/features/camera/styles/detail-screen-style.ts
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 15 : 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#ABE0AC",
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  sectionContainer: {
    marginTop: 30,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  numberBadge: {
    backgroundColor: "#ABE0AC",
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  diseaseNameText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  medTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  medSub: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  linkText: {
    color: "#4C57A1",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  mainActionBtn: {
    backgroundColor: "#ABE0AC",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 45,
    shadowColor: "#ABE0AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mainActionBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  
});
