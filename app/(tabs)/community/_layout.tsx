import { Stack } from "expo-router";
import { NotificationProvider } from "../../../src/features/community/contexts/NotificationContext";

export default function CommunityLayout() {
  return (
    <NotificationProvider>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: '#F8F9FA',
          },
        }}
      >
        <Stack.Screen
          name="communityIndex"
          options={{ headerShown: false, title: "Cộng đồng" }}
        />
        <Stack.Screen
          name="create-post"
          options={{ headerShown: false, title: "Tạo bài viết" }}
        />
        <Stack.Screen
          name="post-detail"
          options={{ headerShown: false, title: "Chi tiết bài viết" }}
        />
        <Stack.Screen
          name="notification-modal"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </NotificationProvider>
  );
}
