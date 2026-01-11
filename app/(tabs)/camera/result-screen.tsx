//MyNewProject/app/(tabs)/camera/result-screen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const mockDiagnosis = {
  disease: "Bệnh rỉ sắt",
  confidence: "92%",
  symptoms: "Bệnh rỉ sắt xuất hiện chủ yếu trên lá, các vết bệnh màu vàng nâu, dạng chấm nhỏ, phát triển lớn dần thành ổ bào tử hạ màu vàng nâu. Cuối cùng biến thành các vết như rỉ sắt màu nâu đen.",
  date: "8 tháng 1",
  recommendations: [
    { id: 1, name: "Thuốc A", description: "Phòng trừ nấm bệnh" },
    { id: 2, name: "Thuốc B", description: "Ức chế phát triển bào tử" },
    { id: 3, name: "Thuốc C", description: "Tăng sức đề kháng cây" }
  ]
};

/**
 * ================================
 * Diagnosis Service
 * GET /diagnosis/:id
 * ================================
 */
// const response = await fetch(`https://api.example.com/diagnosis/${imageId}`)
// const diagnosisResult = await response.json()
// setDiagnosis(diagnosisResult)

export default function ResultScreen() {
  const handleViewMedicine = () => {
    router.push('/camera/detail-screen');
  };

  const handleRediagnose = () => {
    router.push('/camera/camera-screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả chẩn đoán</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Chẩn đoán</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{mockDiagnosis.confidence} chính xác</Text>
            </View>
          </View>
          
          <Text style={styles.diseaseName}>{mockDiagnosis.disease}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Triệu chứng</Text>
            <Text style={styles.sectionContent}>{mockDiagnosis.symptoms}</Text>
          </View>

          <View style={styles.recommendedMeds}>
            <Text style={styles.sectionTitle}>Thuốc khuyến nghị</Text>
            {mockDiagnosis.recommendations.slice(0, 3).map(med => (
              <View key={med.id} style={styles.medicineItem}>
                <Ionicons name="medical" size={20} color="#2A9D8F" />
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{med.name}</Text>
                  <Text style={styles.medicineDesc}>{med.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.medicineButton]} 
            onPress={handleViewMedicine}
          >
            {/* <Ionicons name="medical-outline" size={24} color="white" /> */}
            <Text style={styles.medicineButtonText}>Xem thuốc điều trị</Text>
          </TouchableOpacity>

          {/* 
            <Ionicons name="refresh" size={20} color="#2A9D8F" />
            <Text style={styles.rediagnoseButtonText}>Chẩn đoán lại</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity 
            style={[styles.actionButton, styles.rediagnoseButton]} 
            onPress={handleRediagnose}
          >
          {/* <Ionicons name="refresh" size={20} color="#2A9D8F" /> */}
          <Text style={styles.rediagnoseButtonText}>Chẩn đoán lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2D3142',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3142',
  },
  confidenceBadge: {
    // backgroundColor: '#E8F5E9',
    // paddingHorizontal: 12,
    // paddingVertical: 6,
    borderRadius: 15,
  },
  confidenceText: {
    color: '#2A9D8F',
    fontSize: 12,
    fontWeight: '600',
  },
  diseaseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E76F51',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  recommendedMeds: {
    marginTop: 10,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  medicineInfo: {
    marginLeft: 15,
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 4,
  },
  medicineDesc: {
    fontSize: 13,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 160,
    justifyContent: 'center',
  },
  medicineButton: {
    backgroundColor: '#2A9D8F',
  },
  medicineButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  rediagnoseButton: {
    // backgroundColor: '#E8F5E9',
    // borderWidth: 1,
    // borderColor: '#2A9D8F',
  },
  rediagnoseButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    borderRadius: 12,
  },
  historyButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
});