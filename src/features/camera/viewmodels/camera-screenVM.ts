import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

export const useCameraScreenVM = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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
          params: {
            title: "Cần quyền",
            message: "Cần quyền truy cập thư viện.",
          },
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

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return {
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
  };
};
