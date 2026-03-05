// MyNewProject/app/_layout.tsx
//import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../context/AuthContext";

import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   Inter: require("../assets/fonts/Inter-Regular.ttf"),
  // });

  // if (!loaded) return null;

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden"); // ẩn thanh home/back
      NavigationBar.setBehaviorAsync("overlay-swipe"); // vuốt để hiện lại
      NavigationBar.setPositionAsync("absolute");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        {/* Ẩn thanh pin / giờ / thông báo */}
        <StatusBar hidden={true} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={{ presentation: "modal" }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
