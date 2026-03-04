import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ABE0AC",
    textAlign: "center",
    marginVertical: 20,
  },
  loginCard: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#E9ECEF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginInfo: {
    marginLeft: 20,
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loginSub: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#ABE0AC",
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ABE0AC",
    fontWeight: "bold",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
});
