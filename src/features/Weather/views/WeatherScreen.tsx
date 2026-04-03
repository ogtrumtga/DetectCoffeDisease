// src/features/Weather/views/WeatherScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router"; // Thay Stack bằng useNavigation
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CurrentWeatherCard,
  DailyForecastList,
  HourlyForecastList,
  SprayTimePanel,
} from "../components";
import { weatherStyles } from "../styles";
import { useSprayTimeVM, useWeatherVM } from "../viewmodels";

export function WeatherScreen() {
  const router = useRouter();
  const navigation = useNavigation(); // Hook để can thiệp vào navigation
  const { data, loading, refreshing, error, onRefresh, retry } = useWeatherVM();
  const sprayTimeVM = useSprayTimeVM(data?.hourly || []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

  // Logic ẩn Tab Bar bằng useEffect để tránh lỗi TypeScript property
  useEffect(() => {
    // Tìm đến navigator cha (Tabs) và set style ẩn đi
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    }

    // Khi thoát khỏi màn hình này (Unmount), hiện lại Tab Bar
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            display: "flex", // Hoặc style mặc định của bạn
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 8,
          },
        });
      }
    };
  }, [navigation]);

  // Animated values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const cardOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const cardTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  if (loading && !data) {
    return (
      <View style={weatherStyles.container}>
        <View
          style={[weatherStyles.header, { paddingTop: statusBarHeight + 8 }]}
        >
          <TouchableOpacity
            style={weatherStyles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={weatherStyles.cityName}>Đang tải...</Text>
        </View>
        <View style={weatherStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={weatherStyles.container}>
        <View
          style={[weatherStyles.header, { paddingTop: statusBarHeight + 8 }]}
        >
          <TouchableOpacity
            style={weatherStyles.backButton}
            onPress={() => router.back()}
          >
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

  if (!data) return null;

  return (
    <View style={weatherStyles.container}>
      {/* Header tùy chỉnh */}
      <View
        style={[
          weatherStyles.header,
          { backgroundColor: "#C1E8FF", paddingTop: statusBarHeight + 8 },
        ]}
      >
        <TouchableOpacity
          style={weatherStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
            opacity: headerOpacity,
          }}
        >
          <Text style={weatherStyles.cityName}>{data.cityName}</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>
            {data.current.temperature}°C
          </Text>
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
          <CurrentWeatherCard
            current={data.current}
            daily={data.daily}
            cityName={data.cityName}
          />
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
