// src/features/profile/views/profileDetail.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfileEditScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "Đăng Vinh",
    bio: "Giới thiệu thân thế",
  });

  const [showMenu, setShowMenu] = useState(false);

  const handleGoBack = () => {
    router.push("/(tabs)/profile/loggedInScreen");
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    setTimeout(() => {
      const isError = user.name.length < 2 || Math.random() < 0.15;
      setLoading(false);

      if (isError) {
        router.push({
          pathname: "../error",
          params: {
            title: "Cập nhật thất bại",
            message:
              "Không thể lưu thông tin cá nhân lúc này. Vui lòng kiểm tra kết nối mạng và thử lại sau.",
          },
        });
      } else {
        handleGoBack();
      }
    }, 1500);
  };

  // ⭐⭐⭐ SỬA ĐOẠN NÀY
  const handleLogout = () => {
    const logoutFailed = Math.random() < 0.05;

    if (logoutFailed) {
      router.push({
        pathname: "../error",
        params: {
          title: "Lỗi đăng xuất",
          message: "Có lỗi xảy ra trong quá trình xóa phiên đăng nhập.",
        },
      });
    } else {
      router.replace("/(tabs)/profile/guestScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.blackHeader}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreIconContainer}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity
              onPress={() => {
              setShowMenu(false);
              router.push("/auth/register");
            }}
          >
        <Text style={styles.menuItem}>tài khoản mới</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.avatarContainer}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={55} color="#A0A0A0" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Tổng chỉ</Text>

        <View style={styles.inputField}>
          <Text style={styles.rightLabel}>Tên tài khoản</Text>
          <TextInput
            style={styles.textInput}
            value={user.name}
            onChangeText={(t) => setUser({ ...user, name: t })}
          />
        </View>

        <View style={styles.inputField}>
          <Text style={styles.rightLabel}>Giới thiệu thân thể</Text>
          <TextInput
            style={[styles.textInput, styles.bioInput]}
            value={user.bio}
            multiline
            onChangeText={(t) => setUser({ ...user, bio: t })}
          />
          <Text style={styles.counterText}>{user.bio.length}/50</Text>
        </View>

        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.8 }]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Chỉnh sửa</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  blackHeader: {
    height: 180,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 25,
  },
  moreIconContainer: { zIndex: 101 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  menuBox: {
    position: "absolute",
    top: 55,
    right: 55,
    backgroundColor: "#FFF",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  menuItem: {
    fontSize: 13,
    color: "#FF8A8A",
    fontWeight: "500",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -55,
    zIndex: 10,
  },
  avatarBox: {
    width: 100,
    height: 110,
    backgroundColor: "#E1F1E7",
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#4C57A1",
    marginTop: 25,
    marginBottom: 10,
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    marginBottom: 20,
    paddingBottom: 5,
  },
  rightLabel: {
    fontSize: 11,
    color: "#C0C0C0",
    textAlign: "right",
    marginBottom: 2,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  bioInput: { lineHeight: 22 },
  counterText: {
    fontSize: 11,
    color: "#D0D0D0",
    textAlign: "right",
    marginTop: 5,
  },
  logoutBtn: { paddingVertical: 10 },
  logoutText: { fontSize: 15, color: "#D0D0D0" },
  footer: { marginTop: 50, alignItems: "center" },
  saveBtn: {
    backgroundColor: "#B6E2C6",
    width: width * 0.75,
    paddingVertical: 15,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 55,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
