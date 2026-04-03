// src/features/camera/views/camera-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "../styles/camera-screen-style";
import { useCameraScreenVM } from "../viewmodels/camera-screenVM";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const {
    facing,
    permission,
    photo,
    isPreview,
    cameraRef,
    requestPermission,
    takePicture,
    pickImage,
    retakePicture,
    confirmPicture,
    toggleFacing,
  } = useCameraScreenVM();

  if (!permission) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", paddingHorizontal: 40 },
        ]}
      >
        <Text style={styles.message}>
          Chúng tôi cần quyền truy cập camera để thực hiện chẩn đoán.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>CHO PHÉP TRUY CẬP</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header với Dynamic Padding Top */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#ABE0AC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHỤP ẢNH</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.cameraContainer}>
        {!isPreview ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            mode="picture"
          >
            <View style={styles.overlay}>
              <View style={styles.viewfinder}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.hintText}>
                Căn chỉnh lá cây vào giữa khung hình
              </Text>
            </View>
          </CameraView>
        ) : (
          <Image source={{ uri: photo! }} style={styles.camera} />
        )}
      </View>

      {/* Controls với Dynamic Padding Bottom để không bị Home Bar che */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        {!isPreview ? (
          <>
            <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={32} color="#ABE0AC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFacing}
            >
              <Ionicons name="camera-reverse-outline" size={32} color="#ABE0AC" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={retakePicture}
            >
              <Ionicons name="refresh" size={24} color="#333" />
              <Text style={styles.previewButtonText}>Chụp lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmPicture}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
