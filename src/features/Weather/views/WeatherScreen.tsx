//src/features/Weather/views/WeatherScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Platform, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import {
    CurrentWeatherCard,
    DailyForecastList,
    HourlyForecastList,
    SprayTimePanel,
} from '../components';
import { weatherStyles } from '../styles';
import { useSprayTimeVM, useWeatherVM } from '../viewmodels';

export function WeatherScreen() {
  const router = useRouter();
  const { data, loading, refreshing, error, onRefresh, retry } = useWeatherVM();
  const sprayTimeVM = useSprayTimeVM(data?.hourly || []);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Get status bar height
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
  
  // Animated values for smooth transitions
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const cardOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cardTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
    }
  );

  // Loading state
  if (loading && !data) {
    return (
      <View style={weatherStyles.container}>
        <View style={[weatherStyles.header, { paddingTop: statusBarHeight + 8 }]}>
          <TouchableOpacity style={weatherStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={weatherStyles.cityName}>Đang tải...</Text>
        </View>
        <View style={weatherStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={weatherStyles.loadingText}>Đang lấy dữ liệu thời tiết...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <View style={weatherStyles.container}>
        <View style={[weatherStyles.header, { paddingTop: statusBarHeight + 8 }]}>
          <TouchableOpacity style={weatherStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={weatherStyles.cityName}>Lỗi</Text>
        </View>
        <View style={weatherStyles.errorContainer}>
          <Text style={weatherStyles.errorText}>{error}</Text>
          <TouchableOpacity style={weatherStyles.retryButton} onPress={retry}>
            <Text style={weatherStyles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // No data
  if (!data) {
    return null;
  }

  return (
    <View style={weatherStyles.container}>
      <View style={[weatherStyles.header, { backgroundColor: '#C1E8FF', paddingTop: statusBarHeight + 8 }]}>
        <TouchableOpacity style={weatherStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Animated.View 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            flex: 1, 
            justifyContent: 'space-between',
            opacity: headerOpacity,
          }}
        >
          <Text style={weatherStyles.cityName}>{data.cityName}</Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#333' }}>{data.current.temperature}°C</Text>
        </Animated.View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={weatherStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={{ 
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          }}
        >
          <CurrentWeatherCard current={data.current} daily={data.daily} cityName={data.cityName} />
        </Animated.View>
        
        <HourlyForecastList 
          hourly={data.hourly} 
          currentWeatherCode={data.current.weatherCode}
          currentTemperature={data.current.temperature}
        />
        <DailyForecastList daily={data.daily} />
        <SprayTimePanel conditions={sprayTimeVM.sprayConditions} />
      </Animated.ScrollView>
    </View>
  );
}
