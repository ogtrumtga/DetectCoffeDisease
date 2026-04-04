// src/features/camera/views/detail-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "@/components/SafeArea";
import { styles } from "../styles/detail-screen-style";
import { useDetailScreenVM } from "../viewmodels/detail-screenVM";
import FeedbackSection from "./feedback-screen";

export default function DetailScreen() {
  const {
    diseaseName,
    treatment,
    handleViewHistory,
    handleRediagnose,
    goBack,
  } = useDetailScreenVM();

  // Tách treatment thành các bước nếu có dấu chấm hoặc xuống dòng
  const treatmentSteps = treatment
    ? treatment.split(/\.\s+|\n/).filter((s) => s.trim().length > 0)
    : [];

  return (
    <SafeArea style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color="#ABE0AC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Kết quả ngày {new Date().getDate()}/{new Date().getMonth() + 1}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Kết quả chẩn đoán */}
        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionHeading}>Kết quả chẩn đoán</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.diseaseNameText}>{diseaseName}</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" style={styles.arrowIcon} />
          </View>
        </View>

        {/* Section 2: Hướng điều trị */}
        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>2</Text>
            </View>
            <Text style={styles.sectionHeading}>Hướng điều trị</Text>
          </View>
          {treatmentSteps.length > 0 ? (
            treatmentSteps.map((step, idx) => (
              <View key={idx} style={styles.medicineItem}>
                <View>
                  <Text style={styles.medTitle}>Bước {idx + 1}</Text>
                  <Text style={styles.medSub}>{step.trim()}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.medicineItem}>
              <Text style={styles.medSub}>{treatment || "Không có thông tin điều trị"}</Text>
            </View>
          )}
        </View>

        {/* Feedback */}
        <FeedbackSection />
      </ScrollView>

      {/* Nút hành động */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 20 }}>
        <TouchableOpacity style={styles.mainActionBtn} onPress={handleViewHistory}>
          <Text style={styles.mainActionBtnText}>Xem lịch sử chẩn đoán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainActionBtn, { backgroundColor: "#888", marginTop: 8 }]}
          onPress={handleRediagnose}
        >
          <Text style={styles.mainActionBtnText}>Chẩn đoán lại</Text>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}
