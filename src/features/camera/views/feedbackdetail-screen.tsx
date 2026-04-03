import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { feedbackStyles as styles } from "../styles/feedback-screen";
import { useFeedbackVM } from "../viewmodels/feedback-screenVM";

const FeedbackDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const ratingId = Number(route.params?.ratingId);

  // State cho nội dung nhập thêm (không bắt buộc)
  const [comment, setComment] = useState("");

  const {
    selectedStatus,
    setSelectedStatus,
    statusOptions,
    handleSendFeedback,
    isSubmitting,
    setRating,
  } = useFeedbackVM();

  React.useEffect(() => {
    if (!isNaN(ratingId)) {
      setRating(ratingId);
    }
  }, [ratingId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2D3142" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff",
          paddingHorizontal: 16,
          paddingBottom: 20,
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 40) + 10
              : 50,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={28} color="#ABE0AC" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 25,
            fontWeight: "600",
            color: "#ABE0AC",
            textAlign: "center",
            marginRight: 28,
          }}
        >
          PHẢN HỒI
        </Text>
      </View>

      {/* Nội dung */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            { fontSize: 20, marginBottom: 24, color: "#333" },
          ]}
        >
          {ratingId === 1
            ? "Chúng tôi có thể cải thiện gì?"
            : "Điều gì làm bạn hài lòng?"}
        </Text>

        {/* Danh sách tùy chọn có sẵn */}
        {statusOptions.length > 0 ? (
          statusOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.statusItem,
                selectedStatus === index && styles.selectedStatusItem,
              ]}
              onPress={() => setSelectedStatus(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.statusText}>{option}</Text>
              <View
                style={[
                  styles.radioCircle,
                  selectedStatus === index && styles.selectedRadio,
                ]}
              >
                {selectedStatus === index && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#2A9D8F" />
          </View>
        )}

        {/* Phần nhập thêm ý kiến (Không bắt buộc) */}
        <Text
          style={[
            styles.title,
            { fontSize: 16, marginTop: 15, marginBottom: 10 },
          ]}
        >
          Ý kiến khác (không bắt buộc)
        </Text>
        <TextInput
          style={{
            backgroundColor: "#F9F9F9",
            borderRadius: 12,
            padding: 15,
            height: 120,
            textAlignVertical: "top",
            borderWidth: 1,
            borderColor: "#E0E0E0",
            color: "#333",
          }}
          placeholder="Nhập thêm nội dung phản hồi tại đây..."
          placeholderTextColor="#999"
          multiline={true}
          value={comment}
          onChangeText={setComment}
        />
      </ScrollView>

      {/* Footer Button cố định */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 36 : 24,
          borderTopWidth: 0.5,
          borderTopColor: "#EBEBEB",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          style={[
            styles.submitBtn,
            { marginBottom: 0 },
            (isSubmitting || selectedStatus === null) && {
              opacity: 0.6,
              backgroundColor: "#ccc",
            },
          ]}
          onPress={async () => {
            // Truyền cả comment vào hàm xử lý nếu cần
            await handleSendFeedback();
            navigation.goBack();
          }}
          disabled={isSubmitting || selectedStatus === null}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Gửi phản hồi</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedbackDetailScreen;
