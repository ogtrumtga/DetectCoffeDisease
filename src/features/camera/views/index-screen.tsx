// src/features/camera/views/index-screen.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);

  const navigateToCamera = () => {
    router.push("../(tabs)/camera/cameraScreen");
  };

  const navigateWeather = () => {
    router.push("/(tabs)/Weather/weather");
  };

  const handleAllowLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Lỗi", "Bạn chưa cho phép vị trí");
        return;
      }

      setLocationAllowed(true);

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );

      const data = await res.json();
      setTemperature(data.current_weather.temperature);
    } catch (e) {
      Alert.alert("Lỗi", "Không lấy được thời tiết");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>App name</Text>

      <View style={styles.card}>
        {/* WEATHER */}
        <View style={styles.weatherRow}>
          <TouchableOpacity
            style={styles.weatherBadge}
            onPress={navigateWeather}
          >
            <View>
              <Text style={styles.weatherDate}>Hôm nay</Text>
              <Text style={styles.weatherTemp}>
                {temperature !== null ? `${temperature}°C` : "--"}
              </Text>
            </View>

            <Ionicons name="cloudy-night" size={24} color="#5DADE2" />
          </TouchableOpacity>

          <View style={styles.sprayBadge}>
            <View>
              <Text style={styles.sprayTitle}>Điều kiện phun</Text>
              <Text style={styles.sprayStatus}>Vừa phải</Text>
            </View>
            <View style={styles.infoIconCircle}>
              <Ionicons name="warning-outline" size={12} color="black" />
            </View>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.locationContainer}>
          <Ionicons
            name={locationAllowed ? "checkmark-circle" : "location"}
            size={20}
            color={locationAllowed ? "#2A9D8F" : "#333"}
          />

          <Text style={styles.locationText}>
            {locationAllowed
              ? "Đã xác định vị trí để cập nhật thời tiết."
              : "Cho phép truy cập vị trí để xem thời tiết"}
          </Text>

          {!locationAllowed && (
            <TouchableOpacity onPress={handleAllowLocation}>
              <Text style={styles.allowLink}>Cho phép</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* WORKFLOW */}
        <View style={styles.workflow}>
          <View style={styles.step}>
            <TouchableOpacity
              style={styles.dashedBox}
              onPress={navigateToCamera}
            >
              <Ionicons name="scan-outline" size={30} color="#E9C46A" />
            </TouchableOpacity>
            <Text style={styles.stepText}>Chụp ảnh</Text>
          </View>

          <Ionicons name="arrow-forward" size={20} color="#333" />

          <View style={styles.step}>
            <Ionicons name="document-text" size={24} color="#E9C46A" />
            <Text style={styles.stepText}>Chuẩn đoán</Text>
          </View>

          <Ionicons name="arrow-forward" size={20} color="#333" />

          <View style={styles.step}>
            <Ionicons name="medical" size={40} color="#2A9D8F" />
            <Text style={styles.stepText}>Thuốc</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={navigateToCamera}>
          <Text style={styles.buttonText}>CHỤP ẢNH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#82C491",
    marginBottom: 30,
  },
  card: {
    width: "94%",
    backgroundColor: "#F3FAF4",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 35,
    alignItems: "center",
  },
  weatherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  weatherBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FAD7A0",
    width: "45%",
  },
  weatherDate: { fontSize: 10, color: "#999" },
  weatherTemp: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sprayBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D5F5E3",
    width: "52%",
  },
  sprayTitle: { fontSize: 10, color: "#999" },
  sprayStatus: { fontSize: 15, fontWeight: "bold", color: "#333" },
  infoIconCircle: {
    backgroundColor: "#FFE5B4",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 35,
    paddingHorizontal: 5,
    minHeight: 45,
  },
  locationText: {
    flex: 1,
    fontSize: 12, // Tăng nhẹ size chữ
    color: "#666",
    marginHorizontal: 10,
    lineHeight: 18,
  },
  allowLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3F51B5",
  },
  workflow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 45,
  },
  step: { alignItems: "center" },
  dashedBox: {
    width: 60, // Tăng size icon chụp ảnh
    height: 60,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#E9C46A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  stepText: { fontSize: 13, marginTop: 8, fontWeight: "bold", color: "#333" },
  mainButton: {
    backgroundColor: "#ABE0AC",
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 35,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
