import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { WEATHER_COLORS } from '../constants';
import { SprayCondition } from '../models';
import { sprayTimeStyles } from '../styles';
import { formatHour } from '../utils';
import { ExplainSprayRuleScreen } from '../views/ExplainSprayRuleScreen';

interface SprayTimePanelProps {
  conditions: SprayCondition[];
}

export function SprayTimePanel({ conditions }: SprayTimePanelProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (conditions.length === 0) return null;

  // Generate 12 consecutive hours starting from current hour
  const generateTimelineData = () => {
    if (conditions.length > 0) {
      const now = new Date();
      const currentHour = conditions[0]?.hour ?? now.getHours();
      
      // Generate 12 consecutive hours
      return Array.from({ length: 12 }, (_, index) => {
        const targetHour = (currentHour + index) % 24;
        const matchingCondition = conditions.find(c => c.hour === targetHour);
        
        return matchingCondition || {
          hour: targetHour,
          condition: 'BAD' as const,
          temperature: 0,
          humidity: 0,
          windSpeed: 0,
          precipitation: 0,
          deltaT: 0,
        };
      });
    }
    return conditions.slice(0, 12);
  };

  const timelineConditions = generateTimelineData();
  const hasGood = timelineConditions.some((c) => c.condition === 'GOOD');
  const hasOk = timelineConditions.some((c) => c.condition === 'OK');

  const getStatusText = () => {
    if (hasGood) return 'Điều kiện phun tối ưu';
    if (hasOk) return 'Điều kiện phun vừa phải';
    return 'Điều kiện phun không thuận lợi';
  };

  const getIconStyle = (condition: string) => {
    switch (condition) {
      case 'GOOD':
        return { ...sprayTimeStyles.iconGood, backgroundColor: WEATHER_COLORS.SPRAY_GOOD };
      case 'OK':
        return { ...sprayTimeStyles.iconOk, backgroundColor: WEATHER_COLORS.SPRAY_OK };
      default:
        return { ...sprayTimeStyles.iconBad, backgroundColor: WEATHER_COLORS.SPRAY_BAD };
    }
  };

  const getIconEmoji = (condition: string) => {
    return condition === 'GOOD' ? (
      <Ionicons name="checkmark-circle-outline" size={16} color="#000000" />
    ) : condition === 'OK' ? (
      <Ionicons name="warning-outline" size={16} color="#000000" />
    ) : (
      <Ionicons name="close-circle-outline" size={16} color="#000000" />
    );
  };

  return (
    <>
      <View style={sprayTimeStyles.container}>
        <Text style={sprayTimeStyles.title}>Thời gian phun</Text>
        <Text style={sprayTimeStyles.subtitle}>
          Thời điểm tốt nhất để phun thuốc cho cây trồng của bạn có tính đến điều kiện thời tiết hiện tại
        </Text>

        <View style={sprayTimeStyles.conditionBox}>
          <Text style={sprayTimeStyles.conditionTitle}>{getStatusText()}</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            <View style={sprayTimeStyles.itemsContainer}>
              {timelineConditions.map((item, index) => (
                <View key={index} style={sprayTimeStyles.item}>
                  <View style={[sprayTimeStyles.iconContainer, getIconStyle(item.condition)]}>
                    {getIconEmoji(item.condition)}
                  </View>
                  <Text style={sprayTimeStyles.hourText}>
                    {index === 0 ? 'Hiện\ntại' : formatHour(item.hour)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={sprayTimeStyles.divider} />

          <View style={sprayTimeStyles.legend}>
            <View style={sprayTimeStyles.legendItem}>
              <View style={[sprayTimeStyles.legendDot, { backgroundColor: WEATHER_COLORS.SPRAY_GOOD }]}>
                <Ionicons name="checkmark-circle-outline" size={11} color="#000000" />
              </View>
              <Text style={sprayTimeStyles.legendText}>Tối ưu</Text>
            </View>
            <View style={sprayTimeStyles.legendItem}>
              <View style={[sprayTimeStyles.legendDot, { backgroundColor: WEATHER_COLORS.SPRAY_OK }]}>
                <Ionicons name="warning-outline" size={11} color="#000000" />
              </View>
              <Text style={sprayTimeStyles.legendText}>Vừa phải</Text>
            </View>
            <View style={sprayTimeStyles.legendItem}>
              <View style={[sprayTimeStyles.legendDot, { backgroundColor: WEATHER_COLORS.SPRAY_BAD }]}>
                <Ionicons name="close-circle-outline" size={11} color="#000000" />
              </View>
              <Text style={sprayTimeStyles.legendText}>Không thuận lợi</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={sprayTimeStyles.explainLink}
          onPress={handleOpenModal}
        >
          <Text style={sprayTimeStyles.explainText}>
            Điều này được tính như thế nào ?
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ExplainSprayRuleScreen onClose={handleCloseModal} conditions={conditions} />
      </Modal>
    </>
  );
}
