import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
