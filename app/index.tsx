import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}
      >
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href={"/(tabs)/camera/cameraIndex" as any} />;
  }

  return <Redirect href={"/(tabs)/camera/cameraIndex" as any} />;
}
