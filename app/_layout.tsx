import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../context/AuthContext";
// Import thêm NavigationBarBehavior để sửa lỗi TS
import { NavigationBarBehavior } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    const hideSystemBars = async () => {
      if (Platform.OS === "android") {
        try {
          // 1. Ẩn thanh điều hướng dưới cùng
          await NavigationBar.setVisibilityAsync("hidden");

          // 2. Sửa lỗi TS: Ép kiểu hoặc dùng giá trị literal chuẩn
          await NavigationBar.setBehaviorAsync(
            "sticky-immersive" as NavigationBarBehavior,
          );
        } catch (error) {
          console.log("NavigationBar Error: ", error);
        }
      }
    };

    hideSystemBars();

    // Mẹo quan trọng: Khi chuyển màn hình (Redirect), Android thường khôi phục UI bar.
    // Dùng interval ngắn để ép trạng thái ẩn trong 3 giây đầu khi app vừa mount/redirect xong.
    const interval = setInterval(hideSystemBars, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        {/* statusBarHidden={true} ở cả StatusBar và Stack screenOptions */}
        <StatusBar hidden={true} translucent />

        <Stack
          screenOptions={{
            headerShown: false,
            statusBarHidden: true, // Ép ẩn thanh pin/giờ ở mức stack
            contentStyle: { backgroundColor: "black" }, // Tránh lộ khoảng trắng khi thanh bar ẩn
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
