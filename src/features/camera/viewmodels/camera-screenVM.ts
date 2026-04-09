import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert, Image as RNImage } from "react-native";

export type DiagnosisCropMode = "full" | "focus";

export const useCameraScreenVM = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [cropMode, setCropMode] = useState<DiagnosisCropMode>("focus");
  const cameraRef = useRef<CameraView>(null);

  const optimizeImageForDiagnosis = async (
    uri: string,
    width?: number,
    height?: number
  ) => {
    const sourceWidth = width ?? 0;
    const sourceHeight = height ?? 0;
    const longestSide = Math.max(sourceWidth, sourceHeight);
    const targetLongestSide = 1280;

    // Tránh crop vuông quá sớm (dễ mất ngữ cảnh khi chụp gần).
    // Chỉ resize giữ tỉ lệ + nén nhẹ để backend xử lý crop thông minh.
    const optimized = await ImageManipulator.manipulateAsync(
      uri,
      longestSide > targetLongestSide
        ? sourceWidth >= sourceHeight
          ? [{ resize: { width: targetLongestSide } }]
          : [{ resize: { height: targetLongestSide } }]
        : [],
      { compress: 0.92, format: ImageManipulator.SaveFormat.JPEG }
    );

    return optimized.uri;
  };

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: "#ABE0AC",
          height: 90,
          paddingHorizontal: 12,
          paddingTop: 17.5,
          borderTopWidth: 0,
          display: "flex",
        },
      });
    };
  }, [navigation]);

  const checkLoginAndProceed = (callback: () => void) => {
    if (!user) {
      Alert.alert(
        "Cần đăng nhập",
        "Bạn cần đăng nhập để sử dụng tính năng chẩn đoán bệnh.",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Đăng nhập",
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
      return;
    }
    callback();
  };

  const takePicture = async () => {
    checkLoginAndProceed(async () => {
      if (cameraRef.current) {
        try {
          const result = await cameraRef.current.takePictureAsync({
            quality: 1,
            skipProcessing: false,
          });
          if (result?.uri) {
            const optimizedUri = await optimizeImageForDiagnosis(
              result.uri,
              result.width,
              result.height
            );
            setPhoto(optimizedUri);
            setIsPreview(true);
          }
        } catch (err) {
          router.push({
            pathname: "/error",
            params: { title: "Lỗi Camera", message: "Không thể chụp ảnh." },
          });
        }
      }
    });
  };

  const pickImage = async () => {
    checkLoginAndProceed(async () => {
      try {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          router.push({
            pathname: "/error",
            params: {
              title: "Cần quyền",
              message: "Cần quyền truy cập thư viện.",
            },
          });
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          // Giữ MediaTypeOptions để tương thích ổn định với bản Expo hiện tại của dự án.
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
        if (!result.canceled && result.assets[0]?.uri) {
          const asset = result.assets[0];
          const optimizedUri = await optimizeImageForDiagnosis(
            asset.uri,
            asset.width,
            asset.height
          );
          setPhoto(optimizedUri);
          setIsPreview(true);
        }
      } catch (err: any) {
        console.error("[CameraScreen] pickImage error:", err);
        router.push({
          pathname: "/error",
          params: { title: "Lỗi", message: err?.message || "Không thể chọn ảnh." },
        });
      }
    });
  };
  

  const retakePicture = () => {
    setPhoto(null);
    setIsPreview(false);
    setCropMode("focus");
  };

  const getImageSize = (uri: string): Promise<{ width: number; height: number }> =>
    new Promise((resolve, reject) => {
      RNImage.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        reject
      );
    });

  const applyCropMode = async (uri: string, mode: DiagnosisCropMode) => {
    if (mode === "full") return uri;

    const { width, height } = await getImageSize(uri);
    const baseRatio = 0.8;

    const cropWidth = Math.max(64, Math.floor(width * baseRatio));
    const cropHeight = Math.max(64, Math.floor(height * baseRatio));
    const originX = Math.max(0, Math.floor((width - cropWidth) / 2));
    const originY = Math.max(0, Math.floor((height - cropHeight) / 2));

    const cropped = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          crop: { originX, originY, width: cropWidth, height: cropHeight },
        },
      ],
      { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
    );

    return cropped.uri;
  };

  const confirmPicture = async () => {
    if (photo) {
      try {
        const finalUri = await applyCropMode(photo, cropMode);
        router.push({
          pathname: "/(tabs)/camera/confirmScreen",
          params: { imageUri: finalUri },
        });
      } catch (error: any) {
        router.push({
          pathname: "/error",
          params: {
            title: "Lỗi xử lý ảnh",
            message: error?.message || "Không thể khoanh vùng ảnh.",
          },
        });
      }
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return {
    facing,
    permission,
    photo,
    isPreview,
    cropMode,
    cameraRef,
    requestPermission,
    takePicture,
    pickImage,
    retakePicture,
    confirmPicture,
    setCropMode,
    toggleFacing,
  };
};
