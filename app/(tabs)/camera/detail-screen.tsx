//MyNewProject/app/(tabs)/camera/detail-screen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DetailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>8 tháng 1</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionHeading}>Kết quả chẩn đoán</Text>
          </View>

          <View style={styles.resultCard}>
            {/* <Image 
              source={require('../../assets/images/leaf_disease.png')} // Đảm bảo bạn có ảnh trong thư mục này
              style={styles.resultThumbnail} 
            /> */}
            <Text style={styles.diseaseNameText}>Bệnh gỉ sắt</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" style={styles.arrowIcon} />
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
                <Text style={styles.medTitle}>Thuốc khuyến nghị</Text>
                <Text style={styles.medSub}>Mô tả cơ bản thuốc</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.linkText}>Link mua thuốc</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.mainActionBtn}>
          <Text style={styles.mainActionBtnText}>Lưu vào lịch sử chẩn đoán</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * ================================
 * Feedback Service
 * POST /feedback
 * ================================
 */
// await fetch('https://api.example.com/feedback', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     diagnosisId,
//     isHelpful: true
//   })
// })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F9FCF9', // Màu xanh rất nhạt ở header
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginTop: 25,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  numberBadge: {
    backgroundColor: '#B7E4C7',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    // Tạo shadow nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  resultThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  diseaseNameText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  medTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  medSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  linkText: {
    color: '#0000FF',
    fontSize: 12,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  mainActionBtn: {
    backgroundColor: '#B7E4C7',
    height: 55,
    borderRadius: 30, // Bo tròn mạnh như mẫu
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  mainActionBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});