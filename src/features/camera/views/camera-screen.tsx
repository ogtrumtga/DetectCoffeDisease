// src/features/camera/views/camera-screen.tsx
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const navigation = useNavigation(); // 👈 thêm navigation
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // 👇 ẨN TAB BAR KHI VÀO CAMERA
  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: "#ABE0AC",
          height: 70,
          paddingHorizontal: 12,
          borderTopWidth: 0,
        },
      });
    };
  }, [navigation]);

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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();
        if (result?.uri) {
          setPhoto(result.uri);
          setIsPreview(true);
        }
      } catch (err) {
        router.push({
          pathname: "/error",
          params: { title: "Lỗi Camera", message: "Không thể chụp ảnh." },
        });
      }
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        router.push({
          pathname: "/error",
          params: { title: "Cần quyền", message: "Cần quyền truy cập thư viện." },
        });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setPhoto(result.assets[0].uri);
        setIsPreview(true);
      }
    } catch (err) {
      router.push({
        pathname: "/error",
        params: { title: "Lỗi", message: "Không thể chọn ảnh." },
      });
    }
  };

  const retakePicture = () => {
    setPhoto(null);
    setIsPreview(false);
  };

  const confirmPicture = () => {
    if (photo) {
      router.push({
        pathname: "/(tabs)/camera/confirmScreen",
        params: { imageUri: photo },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
          />
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

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() =>
                setFacing(facing === "back" ? "front" : "back")
              }
            >
              <Ionicons
                name="camera-reverse-outline"
                size={30}
                color="white"
              />
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
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="white"
              />
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2D3142",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  backButton: { padding: 5 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#2D3142",
  },
  controlButton: { padding: 15 },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#ABE0AC",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ABE0AC",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  previewButtonText: { marginLeft: 8, fontSize: 16, color: "#333" },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A9D8F",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmButtonText: { marginLeft: 8, fontSize: 16, color: "white" },
  message: { color: "white", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#ABE0AC", padding: 15, borderRadius: 10 },
  buttonText: { color: "#2D3142", fontWeight: "bold" },
});