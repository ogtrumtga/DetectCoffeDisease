import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
});
