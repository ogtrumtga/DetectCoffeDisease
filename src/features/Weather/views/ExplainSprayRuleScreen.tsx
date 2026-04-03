//  src/features/Weather/views/ExplainSprayRuleScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeltaTHumidityChart } from '../components/DeltaTHumidityChart';
import { SprayCondition } from '../models';

interface ExplainSprayRuleScreenProps {
  onClose?: () => void;
  conditions?: SprayCondition[];
}

export function ExplainSprayRuleScreen({ onClose, conditions = [] }: ExplainSprayRuleScreenProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Use real data if available, otherwise generate sample data
  const generateTimelineData = () => {
    console.log('generateTimelineData - checking conditions:', conditions);
    
    if (conditions && conditions.length > 0) {
      // Use real data from weather API - show 12 consecutive hours
      console.log('Using REAL data from conditions');
      
      // Get current hour from first condition or current time
      const now = new Date();
      const currentHour = conditions[0]?.hour ?? now.getHours();
      
      // Generate 12 consecutive hours starting from current hour
      const result = Array.from({ length: 12 }, (_, index) => {
        const targetHour = (currentHour + index) % 24;
        
        // Find matching condition for this hour
        const matchingCondition = conditions.find(c => c.hour === targetHour);
        
        return {
          label: index === 0 ? 'Hiện\ntại' : `${targetHour}h`,
          hour: targetHour,
          status: matchingCondition ? matchingCondition.condition.toLowerCase() : 'bad',
        };
      });
      
      console.log('Timeline data (real):', result);
      return result;
    }
    
    // Fallback to sample data if no real data available - show 12 hours
    console.log('Using FALLBACK sample data');
    const now = new Date();
    const currentHour = now.getHours();
    
    // Generate 12 time slots (current + next 11 hours)
    return Array.from({ length: 12 }, (_, index) => {
      const hour = (currentHour + index) % 24;
      return {
        label: index === 0 ? 'Hiện\ntại' : `${hour}h`,
        hour: hour,
        status: index < 3 ? 'good' : index < 6 ? 'ok' : 'bad', // Sample pattern
      };
    });
  };

  const timelineData = generateTimelineData();

  // Determine overall status based on ALL conditions (not just first 5)
  const getOverallStatus = () => {
    if (conditions && conditions.length > 0) {
      // Use real data to determine status
      const hasGood = conditions.some(c => c.condition === 'GOOD');
      const hasOk = conditions.some(c => c.condition === 'OK');
      
      if (hasGood) return 'Điều kiện phun tối ưu';
      if (hasOk) return 'Điều kiện phun vừa phải';
      return 'Điều kiện phun không thuận lợi';
    }
    
    // Fallback: check timeline data
    const hasGood = timelineData.some(item => item.status === 'good');
    const hasOk = timelineData.some(item => item.status === 'ok');
    
    if (hasGood) return 'Điều kiện phun tối ưu';
    if (hasOk) return 'Điều kiện phun vừa phải';
    return 'Điều kiện phun không thuận lợi';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#B8E6D5'; // Light green/mint
      case 'ok':
        return '#FFE5B4'; // Light orange/peach
      case 'bad':
        return '#FFB8C6'; // Light pink
      default:
        return '#E0E0E0';
    }
  };

  const getIconColor = (status: string) => {
    return '#000'; // Black for all icons
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thời gian phun</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>{getOverallStatus()}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineScrollContainer}
          >
            {timelineData.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View 
                  style={[
                    styles.timelineDot,
                    { backgroundColor: getStatusColor(item.status) }
                  ]}
                >
                  {item.status === 'good' ? (
                    <Ionicons name="checkmark-circle-outline" size={16} color={getIconColor(item.status)} />
                  ) : item.status === 'ok' ? (
                    <Ionicons name="warning-outline" size={16} color={getIconColor(item.status)} />
                  ) : (
                    <Ionicons name="close-circle-outline" size={16} color={getIconColor(item.status)} />
                  )}
                </View>
                <Text style={styles.timelineLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#B8E6D5' }]}>
                  <Ionicons name="checkmark-circle-outline" size={13} color="#000" />
                </View>
                <Text style={styles.legendText}>Tối ưu</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFE5B4' }]}>
                  <Ionicons name="warning-outline" size={13} color="#000" />
                </View>
                <Text style={styles.legendText}>Vừa phải</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFB8C6' }]}>
                  <Ionicons name="close-circle-outline" size={13} color="#000" />
                </View>
                <Text style={styles.legendText}>Không thuận lợi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Explanation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đây là gì?</Text>
          <Text style={styles.explanationText}>
            Đây là khuyến nghị của chúng tôi về thời điểm tốt nhất để phun thuốc cho cây trồng của bạn có tính đến điều kiện thời tiết hiện tại.
          </Text>

          <View style={styles.conditionList}>
            <View style={styles.conditionItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#000" style={styles.conditionIconSimple} />
              <Text style={styles.conditionLabel}>Điều kiện phun tối ưu.</Text>
            </View>

            <View style={styles.conditionItem}>
              <Ionicons name="warning-outline" size={16} color="#000" style={styles.conditionIconSimple} />
              <Text style={styles.conditionLabel}>
                Điều kiện phun vừa phải: Các thông số môi trường hơn hợp cần được xem xét cẩn thận trước khi phun.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Ionicons name="close-circle-outline" size={16} color="#000" style={styles.conditionIconSimple} />
              <Text style={styles.conditionLabel}>
                Điều kiện phun thuốc không thuận lợi: Không nên phun thuốc cho cây trồng vào thời điểm này. Tránh phun thuốc nếu có thể.
              </Text>
            </View>
          </View>
        </View>

        {/* How it works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Làm thế nào nó hoạt động?</Text>
          <Text style={styles.explanationText}>
            Thời gian phun phụ thuộc vào lượng mưa, tốc độ gió, độ ẩm không khí và nhiệt độ.
          </Text>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Nhiệt độ và độ ẩm</Text>
            <Text style={styles.subsectionText}>
              Điều kiện phun tối ưu phụ thuộc vào tốc độ bốc hơi và thời gian tồn động của giọt phun. Các yếu tố này chịu ảnh hưởng của nhiệt độ và độ ẩm không khí.
            </Text>
            <Text style={styles.subsectionText}>
              Hãy Kiểm tra biểu đồ bên dưới để biết điều kiện tốt nhất, khi độ ẩm và nhiệt độ hiện tại cùng xuất hiện trong vùng màu xanh lá cây.
            </Text>
          </View>

          {/* Delta T Chart */}
          <View style={styles.chartContainer}>
            <DeltaTHumidityChart />
          </View>

          {/* Delta T Legend */}
          <View style={styles.deltaTLegendContainer}>
            <View style={styles.deltaTHeader}>
              <Text style={styles.deltaTTitle}>Chênh lệch nhiệt độ</Text>
              <Text style={styles.deltaTUnit}>°C</Text>
            </View>
            <Text style={styles.deltaTSubtitle}>Delta T</Text>
            
            <View style={styles.deltaTItems}>
              <View style={styles.deltaTItem}>
                <View style={[styles.deltaTIcon, { backgroundColor: '#FFE5B4' }]}>
                  <Ionicons name="warning-outline" size={14} color="#000" />
                </View>
                <Text style={styles.deltaTLabel}>0-2</Text>
              </View>

              <View style={styles.deltaTItem}>
                <View style={[styles.deltaTIcon, { backgroundColor: '#B8E6D5' }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.deltaTLabel}>2-8</Text>
              </View>

              <View style={styles.deltaTItem}>
                <View style={[styles.deltaTIcon, { backgroundColor: '#FFE5B4' }]}>
                  <Ionicons name="warning-outline" size={14} color="#000" />
                </View>
                <Text style={styles.deltaTLabel}>8-10</Text>
              </View>

              <View style={styles.deltaTItem}>
                <View style={[styles.deltaTIcon, { backgroundColor: '#FFB8C6' }]}>
                  <Ionicons name="close-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.deltaTLabel}>{'>'}10</Text>
              </View>
            </View>
          </View>

          {/* Rain Section */}
          <View style={styles.rainContainer}>
            <View style={styles.rainHeader}>
              <Text style={styles.rainTitle}>Mưa</Text>
              <Text style={styles.rainUnit}>mm</Text>
            </View>
            
            <View style={styles.rainItems}>
              <View style={styles.rainItem}>
                <View style={[styles.rainIcon, { backgroundColor: '#B8E6D5' }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.rainLabel}>Không mưa</Text>
              </View>

              <View style={styles.rainItem}>
                <View style={[styles.rainIcon, { backgroundColor: '#FFE5B4' }]}>
                  <Ionicons name="warning-outline" size={14} color="#000" />
                </View>
                <Text style={styles.rainLabel}>{'<'} 0.1</Text>
              </View>

              <View style={styles.rainItem}>
                <View style={[styles.rainIcon, { backgroundColor: '#FFB8C6' }]}>
                  <Ionicons name="close-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.rainLabel}>{'>'} 0.1</Text>
              </View>
            </View>

            <Text style={styles.rainDescription}>
              Thời tiết khô ngăn ngừa hiện tượng rửa trôi
            </Text>
          </View>

          {/* Wind Section */}
          <View style={styles.windContainer}>
            <View style={styles.windHeader}>
              <Text style={styles.windTitle}>Gió</Text>
              <Text style={styles.windUnit}>km/h</Text>
            </View>
            
            <View style={styles.windItems}>
              <View style={styles.windItem}>
                <View style={[styles.windIcon, { backgroundColor: '#B8E6D5' }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.windLabel}>{'<'} 12</Text>
              </View>

              <View style={styles.windItem}>
                <View style={[styles.windIcon, { backgroundColor: '#FFE5B4' }]}>
                  <Ionicons name="warning-outline" size={14} color="#000" />
                </View>
                <Text style={styles.windLabel}>12-25</Text>
              </View>

              <View style={styles.windItem}>
                <View style={[styles.windIcon, { backgroundColor: '#FFB8C6' }]}>
                  <Ionicons name="close-circle-outline" size={14} color="#000" />
                </View>
                <Text style={styles.windLabel}>{'>'} 25</Text>
              </View>
            </View>

            <Text style={styles.windDescription}>
              Lý tưởng là tốc độ gió thấp hơn để bao phủ tốt hơn và ít bị bay thuốc hơn
            </Text>
          </View>

          {/* Trust Section */}
          <View style={styles.trustContainer}>
            <Text style={styles.trustTitle}>Tôi có thể tin tưởng điều này không?</Text>
            <Text style={styles.trustDescription}>
              Tin tưởng nhưng cần xác minh. Mặc dù chúng tôi tự tin vào các đề xuất của mình nhưng điều kiện thực tế có thể không phải lúc nào cũng phù hợp với lý tưởng. Vì vậy hãy dựa vào kinh nghiệm thực tế của bạn trước.
            </Text>
            
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingTop: 150,
    paddingBottom: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  closeIcon: {
    padding: 4,
  },
  content: {
    paddingBottom: 8,
  },
  timelineSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  timelineScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  timelineItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    minWidth: 50,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  legendText: {
    fontSize: 10,
    color: '#666',
    flexShrink: 0,
  },
  section: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  conditionList: {
    gap: 0,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionIconSimple: {
    marginRight: 12,
    flexShrink: 0,
  },
  conditionLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  subsection: {
    marginTop: 8,
    marginLeft: 8,
    paddingLeft: 8,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  subsectionText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
  },
  chartContainer: {
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  deltaTLegendContainer: {
    marginTop: 8,
    marginLeft: 8,
    paddingTop: 8,
    paddingLeft: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deltaTHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  deltaTTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  deltaTUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  deltaTSubtitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  deltaTItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deltaTItem: {
    alignItems: 'center',
  },
  deltaTIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  deltaTLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#555',
  },
  rainContainer: {
    marginTop: 8,
    marginLeft: 8,
    paddingTop: 8,
    paddingLeft: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rainTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  rainUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  rainItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  rainItem: {
    alignItems: 'center',
  },
  rainIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  rainLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#555',
  },
  rainDescription: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  windContainer: {
    marginTop: 8,
    marginLeft: 8,
    paddingTop: 8,
    paddingLeft: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  windHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  windTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  windUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  windItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  windItem: {
    alignItems: 'center',
  },
  windIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  windLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#555',
  },
  windDescription: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  trustContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  trustDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
