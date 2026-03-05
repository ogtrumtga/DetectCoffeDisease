import * as NavigationBar from "expo-navigation-bar";
import { NavigationBarBehavior } from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  useEffect(() => {
    const hideAndroidSystemBars = async () => {
      if (Platform.OS === "android") {
        try {
          await NavigationBar.setVisibilityAsync("hidden");

          await NavigationBar.setBehaviorAsync(
            "sticky-immersive" as NavigationBarBehavior,
          );
        } catch (error) {
          console.log("Android NavigationBar Error: ", error);
        }
      }
    };

    hideAndroidSystemBars();

    const interval = setInterval(hideAndroidSystemBars, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar hidden={true} translucent style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            statusBarHidden: true,
            contentStyle: { backgroundColor: "black" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={{ presentation: "modal" }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
