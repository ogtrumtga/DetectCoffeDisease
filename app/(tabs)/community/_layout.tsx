import { Stack } from "expo-router";
import { NotificationProvider } from "../../../src/features/community/contexts/NotificationContext";

export default function CommunityLayout() {
  return (
    <NotificationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F8F9FA',
          },
        }}
      >
        <Stack.Screen name="communityIndex" options={{ title: "Cộng đồng" }} />
        <Stack.Screen name="create-post" options={{ title: "Tạo bài viết" }} />
        <Stack.Screen name="post-detail" options={{ title: "Chi tiết bài viết" }} />
        <Stack.Screen name="notification-modal" />
      </Stack>
    </NotificationProvider>
  );
}
