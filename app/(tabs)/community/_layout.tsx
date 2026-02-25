import { Stack } from "expo-router";
import { NotificationProvider } from "../../../src/features/community/contexts/NotificationContext";

export default function CommunityLayout() {
  return (
    
    <NotificationProvider>
      <Stack>
        <Stack.Screen
          name="communityIndex"
          options={{ headerShown: false, title: "Cộng đồng" }}
        />
        <Stack.Screen
          name="create-post"
          options={{ headerShown: true, title: "Tạo bài viết" }}
        />
        <Stack.Screen
          name="post-detail"
          options={{ headerShown: true, title: "Chi tiết bài viết" }}
        />
        <Stack.Screen
          name="notification-modal"
          options={{
            presentation: "modal",
            title: "Thông báo",
          }}
        />
      </Stack>
    </NotificationProvider>
  );
}
