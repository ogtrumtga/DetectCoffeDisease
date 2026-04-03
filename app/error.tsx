// app/error.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ErrorScreen() {
  const router = useRouter();

  const { title, message } = useLocalSearchParams<{
    title?: string;
    message?: string;
  }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={90} color="#E74C3C" />
      </View>

      <Text style={styles.title}>{title || "Đã xảy ra lỗi"}</Text>

      <Text style={styles.message}>
        {message || "Có sự cố xảy ra. Vui lòng thử lại."}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  iconContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },

  message: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#40916C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
