// src/features/camera/views/result-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "@/components/SafeArea";

import { styles } from "../styles/result-screen-style";
import { useResultScreenVM } from "../viewmodels/result-screenVM";

export default function ResultScreen() {
  const {
    diagnosis,
    handleViewMedicine,
    handleRediagnose,
    handleBackToCameraIndex,
  } = useResultScreenVM();

  // Màu badge theo severity
  const severityColor =
    diagnosis.severity === "high"
      ? "#FF5722"
      : diagnosis.severity === "medium"
      ? "#FF9800"
      : "#4CAF50";

  return (
    <SafeArea style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToCameraIndex} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#ABE0AC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KẾT QUẢ CHẨN ĐOÁN</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Chẩn đoán</Text>
            <View style={[styles.confidenceBadge, { backgroundColor: severityColor }]}>
              <Text style={styles.confidenceText}>{diagnosis.confidence} chính xác</Text>
            </View>
          </View>

          <Text style={[styles.diseaseName, { color: diagnosis.color }]}>
            {diagnosis.disease}
          </Text>

          {/* Tóm tắt số lượng phát hiện */}
          {Object.keys(diagnosis.summary).length > 0 && (
            <View style={{ marginTop: 8, marginBottom: 4 }}>
              {Object.entries(diagnosis.summary).map(([name, count]) => (
                <Text key={name} style={{ color: "#555", fontSize: 13 }}>
                  • {name}: {String(count)} vùng phát hiện
                </Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.sectionContent}>{diagnosis.symptoms}</Text>
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
    </SafeArea>
  );
}
