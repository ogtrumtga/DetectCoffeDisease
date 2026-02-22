// src/features/profile/views/profileGuest.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

interface ProfileGuestProps {
  onLoginPress?: () => void;
}

export default function ProfileScreen({ onLoginPress }: ProfileGuestProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onLoginPress) {
      // Nếu có truyền prop từ cha (như ở Bước 5), ưu tiên dùng prop
      onLoginPress();
    } else {
      // Nếu không, mặc định nhảy thẳng tới trang login
      router.push('/auth/login');
    }
  };
  return (
    <>
      <Stack.Screen options={{ title: 'Tôi' }} />

      <View style={styles.container}>
        <Text style={styles.appName}>App name</Text>

        <View style={styles.loginCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={50} color="#CCC" />
          </View>
          <View style={styles.loginInfo}>
            <Text style={styles.loginTitle}>Tài khoản của bạn</Text>
            <Text style={styles.loginSub}>Tham gia cộng đồng</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handlePress}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.illustrationContainer}>
          <Ionicons name="leaf-outline" size={150} color="#40916C" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#ABE0AC', textAlign: 'center', marginVertical: 20 },
  loginCard: { flexDirection: 'row', padding: 20, alignItems: 'center', marginHorizontal: 20 },
  avatarPlaceholder: { width: 80, height: 80, backgroundColor: '#E9ECEF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  loginInfo: { marginLeft: 20 },
  loginTitle: { fontSize: 16, fontWeight: 'bold' },
  loginSub: { fontSize: 12, color: '#666', marginBottom: 10 },
  loginButton: { borderWidth: 1, borderColor: '#ABE0AC', paddingVertical: 5, paddingHorizontal: 30, borderRadius: 20, alignItems: 'center' },
  loginButtonText: { color: '#ABE0AC', fontWeight: 'bold' },
  illustrationContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.6 }
});
