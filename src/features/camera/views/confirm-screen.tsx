// src/features/camera/views/confirm-screen.tsx
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "@/components/SafeArea";

import { styles } from "../styles/confirm-screen-style";
import { useConfirmScreenVM } from "../viewmodels/confirm-screenVM";

export default function ConfirmScreen() {
  const { imageUri, loading, statusText, countdown, startAnalysis, cancelAnalysis } =
    useConfirmScreenVM();

  return (
    <SafeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>XÁC NHẬN ẢNH</Text>
      </View>

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A9D8F" />
            <Text style={styles.loadingText}>{statusText}</Text>
            <Text style={styles.loadingSubtext}>Vui lòng đợi trong giây lát</Text>
          </View>
        ) : (
          <>
            <View style={styles.countdownContainer}>
              <View style={styles.countdownCircle}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
              <Text style={styles.countdownLabel}>Bắt đầu phân tích sau</Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelAnalysis}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={startAnalysis}
              >
                <Text style={styles.confirmButtonText}>Phân tích ngay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeArea>
  );
}
