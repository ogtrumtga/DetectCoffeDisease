// src/features/profile/views/profileLoggedIn.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

// Giả lập một Global Store đơn giản
export let globalHistoryData = [
  { id: "1", title: "C", date: "8 tháng 1" },
  { id: "2", title: "không khô quả", date: "Ngày 1 tháng 12 năm 2025" },
];

export default function ProfileHomeScreen() {
  const [activeTab, setActiveTab] = useState("history");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState(globalHistoryData);
  const router = useRouter();

  useEffect(() => {
    setHistoryData([...globalHistoryData]);
  }, []);

  const activityData = [
    {
      id: "act1",
      userName: "Đăng Vinh",
      date: "Ngày 21 tháng 5 năm 2025",
      title: "Câu hỏi",
      description: "Mô là bánh",
      likes: 0,
      comments: 0,
    },
  ];

  const deleteItem = async (id: string) => {
    setIsDeleting(id);
    setTimeout(() => {
      const isError = Math.random() < 0.15;
      setIsDeleting(null);
      if (isError) {
        router.push({
          pathname: "/error",
          params: {
            title: "Không thể xóa",
            message: "Đã xảy ra lỗi khi kết nối với máy chủ.",
          },
        });
      } else {
        const newData = historyData.filter((item) => item.id !== id);
        globalHistoryData = newData;
        setHistoryData(newData);
      }
    }, 1000);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => deleteItem(id)}
      disabled={isDeleting === id}
    >
      {isDeleting === id ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Ionicons name="trash-outline" size={24} color="white" />
      )}
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: any) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/camera/detailCameraScreen",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.itemImagePlaceholder}>
          <Ionicons name="leaf" size={24} color="#40916C" />
        </View>
        <View style={styles.itemTextInfo}>
          <Text style={styles.itemDate}>{String(item.date)}</Text>
          <Text style={styles.itemTitle}>{String(item.title)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </TouchableOpacity>
    </Swipeable>
  );

  const renderActivityItem = ({ item }: any) => (
    <View style={styles.activityCard}>
      <View style={styles.postImageContainer}>
        <Ionicons name="image-outline" size={40} color="#DDD" />
        <Text style={styles.imageNote}>(Hình ảnh bài đăng)</Text>
      </View>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <View style={styles.smallAvatar} />
          <View>
            <Text style={styles.postUserName}>{String(item.userName)}</Text>
            <Text style={styles.postDate}>{String(item.date)}</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>{String(item.title)}</Text>
        <Text style={styles.postDescription}>{String(item.description)}</Text>

        {/* Phần Footer chứa các icon */}
        <View style={styles.postFooter}>
          <View style={styles.interactionGroup}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons
                name="thumb-up"
                size={22}
                color="#728096"
              />
              <Text style={styles.interactionText}>{String(item.likes)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons
                name="comment-outline"
                size={22}
                color="#728096"
              />
              <Text style={styles.interactionText}>
                {String(item.comments)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.appName}>TÊN ỨNG DỤNG</Text>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={45} color="#ADB5BD" />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName}>Đăng Vinh</Text>
            <Text style={styles.userBio}>Giới thiệu thân thế</Text>
            <TouchableOpacity
              style={styles.vatoButton}
              onPress={() => router.push("/(tabs)/profile/detailProfileScreen")}
            >
              <Text style={styles.vatoText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            style={[
              styles.tabItem,
              activeTab === "history" && styles.activeTabBorder,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "history" && styles.activeLabel,
              ]}
            >
              Lịch sử và dự đoán
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("activity")}
            style={[
              styles.tabItem,
              activeTab === "activity" && styles.activeTabBorder,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "activity" && styles.activeLabel,
              ]}
            >
              Hoạt động
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={activeTab === "history" ? historyData : activityData}
          keyExtractor={(item) => item.id}
          renderItem={
            activeTab === "history" ? renderHistoryItem : renderActivityItem
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 60 },
  appName: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#ABE0AC",
    marginBottom: 25,
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 75,
    height: 75,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  profileTextContainer: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  userBio: { fontSize: 11, color: "#777", marginTop: 2 },
  vatoButton: {
    borderWidth: 1,
    borderColor: "#ABE0AC",
    borderRadius: 18,
    paddingVertical: 3,
    width: 120,
    alignItems: "center",
    marginTop: 8,
  },
  vatoText: { color: "#ABE0AC", fontSize: 15, fontWeight: "500" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  activeTabBorder: { borderBottomWidth: 3, borderBottomColor: "#ABE0AC" },
  tabLabel: { fontSize: 13, color: "#999", fontWeight: "600" },
  activeLabel: { color: "#333" },
  listContainer: { paddingBottom: 20 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "white",
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTextInfo: { flex: 1, marginLeft: 15 },
  itemDate: { fontSize: 10, color: "#AAA" },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#444" },
  deleteAction: {
    backgroundColor: "#E63946",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  activityCard: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    elevation: 2,
  },
  postImageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  imageNote: { fontSize: 10, color: "#CCC", marginTop: 5 },
  postContent: { padding: 15 },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE",
    marginRight: 10,
  },
  postUserName: { fontSize: 13, fontWeight: "bold", color: "#4A55A2" },
  postDate: { fontSize: 10, color: "#999" },
  postTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  postDescription: { fontSize: 13, color: "#666", marginBottom: 15 },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 10,
  },
  interactionGroup: { flexDirection: "row" },
  iconBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  interactionText: {
    fontSize: 14,
    color: "#728096",
    marginLeft: 8,
    fontWeight: "500",
  },
});
