import { Stack } from "expo-router";

export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name="login"
            options={{
                animation: 'slide_from_left' // Khi quay lại Login, nó sẽ lướt sang phải để hiện ra
            }}
        />
        <Stack.Screen
            name="register"
            options={{
                animation: 'slide_from_right' // Khi bấm Đăng ký, trang này lướt từ phải sang trái
            }}
        />
    </Stack>;
}
