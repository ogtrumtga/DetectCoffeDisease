// app/(tabs)/profile/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileLayout() {
    const { isLoggedIn } = useAuth();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <Stack.Screen name="loggedInScreen" options={{ title: 'Hồ sơ của tôi' }} />
            ) : (
                <Stack.Screen name="guestScreen" options={{ title: 'Khách' }} />
            )}
            <Stack.Screen name="detailProfileScreen" options={{ headerShown: true }} />
        </Stack>
    );
}
