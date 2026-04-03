import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "../styles/index-screen-style";
import { useIndexScreenVM } from "../viewmodels/index-screenVM";

export default function HomeScreen() {
  const {
    locationAllowed,
    temperature,
    navigateToCamera,
    navigateWeather,
    handleAllowLocation,
  } = useIndexScreenVM();

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>DEDICAFE</Text>

      <View style={styles.card}>
        {/* WEATHER SECTION */}
        <View style={styles.weatherRow}>
          <TouchableOpacity
            style={[
              styles.weatherBadge,
              !locationAllowed && { opacity: 0.7 }, // Subtly indicate disabled state if needed
            ]}
            onPress={() => {
              if (locationAllowed) {
                navigateWeather();
              } else {
                // Nếu chưa cho phép, có thể gọi handleAllowLocation
                // hoặc không làm gì để chặn click
                handleAllowLocation();
              }
            }}
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
