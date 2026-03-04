import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles/camera-screen-style";
import { useCameraScreenVM } from "../viewmodels/camera-screenVM";

export default function CameraScreen() {
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

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Chúng tôi cần quyền truy cập camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Cho phép</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chụp ảnh chẩn đoán</Text>
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

      <View style={styles.controls}>
        {!isPreview ? (
          <>
            <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={30} color="white" />
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
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
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
    </SafeAreaView>
  );
}