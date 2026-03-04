import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect } from "expo-router"; // Thêm useFocusEffect
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { styles } from "../styles/profileLoggedIn-style";
import {
  globalUserData,
  useProfileLoggedInVM,
} from "../viewmodels/profileLoggedInVM";

export default function ProfileHomeScreen() {
  const {
    activeTab,
    setActiveTab,
    isDeleting,
    historyData,
    activityData,
    userData,
    deleteItem,
    toggleLikePost,
    navigateToDetail,
    navigateToEditProfile,
  } = useProfileLoggedInVM();

  // Trick để ép React render lại khi quay lại từ màn hình Edit trên Win/Web
  const [, setTick] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setTick((t) => t + 1);
    }, []),
  );

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
        onPress={() => navigateToDetail(item.id)}
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
          <View style={styles.smallAvatar}>
            {globalUserData.avatar ? (
              <Image
                source={{ uri: globalUserData.avatar }}
                style={{ width: "100%", height: "100%", borderRadius: 16 }}
              />
            ) : null}
          </View>
          <View>
            <Text style={styles.postUserName}>{String(item.userName)}</Text>
            <Text style={styles.postDate}>{String(item.date)}</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>{String(item.title)}</Text>
        <Text style={styles.postDescription}>{String(item.description)}</Text>

        <View style={styles.postFooter}>
          <View style={styles.interactionGroup}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleLikePost(item.id)}
            >
              <MaterialCommunityIcons
                name={item.isLiked ? "thumb-up" : "thumb-up-outline"}
                size={22}
                color={item.isLiked ? "#40916C" : "#728096"}
              />
              <Text
                style={[
                  styles.interactionText,
                  item.isLiked && { color: "#40916C" },
                ]}
              >
                {String(item.likes)}
              </Text>
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
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="share-variant"
              size={22}
              color="#728096"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.appName}>DEDICAFE</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            {globalUserData.avatar ? (
              <Image
                source={{ uri: globalUserData.avatar }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              />
            ) : (
              <Ionicons name="person" size={45} color="#ADB5BD" />
            )}
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName}>{globalUserData.name}</Text>
            <Text style={styles.userBio}>{globalUserData.bio}</Text>
            <TouchableOpacity
              style={styles.vatoButton}
              onPress={navigateToEditProfile}
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
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: "#999" }}>Không có dữ liệu hiển thị</Text>
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
}
