// app/(tabs)/Weather/_layout.tsx
import { Stack } from "expo-router";

export default function WeatherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="weather" />
      <Stack.Screen name="explain-spray-rule" />
      <Stack.Screen name="spray-time-modal" />
    </Stack>
  );
}