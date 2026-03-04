import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/profileGuest-style";
import { useProfileGuestVM } from "../viewmodels/profileGuestVM";

interface ProfileGuestProps {
  onLoginPress?: () => void;
}

export default function ProfileScreen({ onLoginPress }: ProfileGuestProps) {
  const { handlePress } = useProfileGuestVM({ onLoginPress });

  return (
    <>
      <Stack.Screen options={{ title: "Tôi" }} />

      <View style={styles.container}>
        <Text style={styles.appName}>DEDICAFE</Text>

        <View style={styles.loginCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={50} color="#CCC" />
          </View>

          <View style={styles.loginInfo}>
            <Text style={styles.loginTitle}>Tài khoản của bạn</Text>
            <Text style={styles.loginSub}>Tham gia cộng đồng</Text>

            <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
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
