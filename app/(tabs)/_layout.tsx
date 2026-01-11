// MyNewProject/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D3142',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: {
          backgroundColor: '#B7E4C7',
          height: 70,
          paddingHorizontal: 12,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 48,
          borderRadius: 14,
          marginVertical: 6,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarActiveBackgroundColor: '#FFFFFF',
        tabBarInactiveBackgroundColor: 'transparent',
      }}
    >
\      <Tabs.Screen
        name="index"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community/index"
        options={{
          title: 'Cộng đồng',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="camera/camera-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/confirm-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/result-screen" options={{ href: null }} />
      <Tabs.Screen name="camera/detail-screen" options={{ href: null }} />
    </Tabs>
  );
}