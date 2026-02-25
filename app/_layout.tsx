// MyNewProject/app/_layout.tsx
//import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   Inter: require("../assets/fonts/Inter-Regular.ttf"),
  // });

  // if (!loaded) return null;
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ presentation: "modal" }} />
      </Stack>
    </AuthProvider>
  );
}
