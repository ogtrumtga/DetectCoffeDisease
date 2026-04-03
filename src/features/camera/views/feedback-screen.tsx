import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { feedbackStyles as styles } from "../styles/feedback-screen";
import { useRouter } from "expo-router";

const FeedbackSection = () => {
  const router = useRouter();

  const ratings = [
    { id: 1, label: "Tệ", icon: "thumb-down" },
    { id: 2, label: "Bình thường", icon: "emoticon-neutral-outline" },
    { id: 3, label: "Tốt", icon: "thumb-up" },
  ];

  const handleRatingPress = (id: number) => {
    // Sử dụng router.push với đường dẫn tương đối hoặc tuyệt đối chính xác
    // Ví dụ: nếu file là app/feedback-detail.tsx
    router.push({
      pathname: "/(tabs)/camera/feedbackScreen",
      params: { ratingId: id },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá của bạn</Text>

      <View style={styles.ratingContainer}>
        {ratings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.ratingBox}
            onPress={() => handleRatingPress(item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={32}
              color="#666"
            />
            <Text style={styles.ratingText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeedbackSection;
