// MyNewProject/app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2D3142",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: {
          backgroundColor: "#ABE0AC",
          height: 70,
          paddingHorizontal: 12,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 48,
          borderRadius: 14,
          marginVertical: 6,
        },
        tabBarIconStyle: { marginTop: 2 },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarActiveBackgroundColor: "#FFFFFF",
      }}
    >
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Cộng đồng",
          href: isLoggedIn ? "/community" : (null as any),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Weather"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Tôi",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="weather/explain-spray-rule" options={{ href: null }} />
      <Tabs.Screen name="community/create-post" options={{ href: null }} />
      <Tabs.Screen
        name="community/notification-modal"
        options={{ href: null }}
      />
      <Tabs.Screen name="community/post-detail" options={{ href: null }} />
      <Tabs.Screen name="Weather/weather" options={{ href: null }} />
      <Tabs.Screen name="Weather/spray-time-modal" options={{ href: null }} />
      {/* <Tabs.Screen name="camera/camera-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/confirm-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/result-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/detail-screen" options={{ href: null }} />
      <Tabs.Screen name="profile/detail" options={{ href: null }} /> */}
      {/* <Tabs.Screen name="profile/home" options={{ href: null }} /> */}
    </Tabs>
  );
}
