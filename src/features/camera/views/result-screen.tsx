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

import { styles } from "../styles/result-screen-style";
import { useResultScreenVM } from "../viewmodels/result-screenVM";

export default function ResultScreen() {
  const {
    isLoading,
    mockDiagnosis,
    handleViewMedicine,
    handleRediagnose,
    handleBackToCameraIndex,
  } = useResultScreenVM();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={styles.loadingText}>Đang tải kết quả...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToCameraIndex}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả chẩn đoán</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Chẩn đoán</Text>
            <div style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {mockDiagnosis.confidence} chính xác
              </Text>
            </div>
          </View>

          <Text style={styles.diseaseName}>{mockDiagnosis.disease}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Triệu chứng</Text>
            <Text style={styles.sectionContent}>{mockDiagnosis.symptoms}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.medicineButton]}
            onPress={handleViewMedicine}
          >
            <Text style={styles.medicineButtonText}>Xem thuốc điều trị</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.rediagnoseButton]}
          onPress={handleRediagnose}
        >
          <Text style={styles.rediagnoseButtonText}>Chẩn đoán lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
