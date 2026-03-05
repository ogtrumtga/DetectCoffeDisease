import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/detail-screen-style";
import { useDetailScreenVM } from "../viewmodels/detail-screenVM";

export default function DetailScreen() {
  const { isSaving, handleSaveHistory, goBack } = useDetailScreenVM();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Kết quả ngày {new Date().getDate()}/{new Date().getMonth() + 1}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionHeading}>Kết quả chẩn đoán</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.diseaseNameText}>Bệnh gỉ sắt</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#333"
              style={styles.arrowIcon}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>2</Text>
            </View>
            <Text style={styles.sectionHeading}>Thuốc khuyến nghị</Text>
          </View>

          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.medicineItem}>
              <View>
                <Text style={styles.medTitle}>Thuốc khuyến nghị {item}</Text>
                <Text style={styles.medSub}>Mô tả cơ bản thuốc</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.linkText}>Link mua thuốc</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.mainActionBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSaveHistory}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.mainActionBtnText}>
              Lưu vào lịch sử chẩn đoán
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
