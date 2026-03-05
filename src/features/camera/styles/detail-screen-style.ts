import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginTop: 25,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  numberBadge: {
    backgroundColor: "#ABE0AC",
    width: 32,
    height: 32,
    borderRadius: 8,
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
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diseaseNameText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  medTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  medSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
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
  mainActionBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
