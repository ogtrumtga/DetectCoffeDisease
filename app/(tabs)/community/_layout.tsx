import { Stack } from "expo-router";
// 1. Import cái Provider mà log báo thiếu
import { NotificationProvider } from "../../../src/features/community/contexts/NotificationContext";

export default function CommunityLayout() {
  return (
    // 2. Bao bọc toàn bộ Stack bằng Provider này
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
