// app/(tabs)/camera/_layout.tsx
import { Stack } from "expo-router";

export default function CameraLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cameraIndex" />
      <Stack.Screen name="cameraScreen" />
      <Stack.Screen name="confirmScreen" />
      <Stack.Screen name="resultScreen" />
      <Stack.Screen name="detailCameraScreen" />
      <Stack.Screen name="feedbackScreen" />
    </Stack>
  );
}
