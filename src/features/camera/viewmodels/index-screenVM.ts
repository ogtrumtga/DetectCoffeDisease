import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useIndexScreenVM = () => {
  const navigation = useNavigation();
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const parent = navigation.getParent();
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
  }, [navigation]);

  const navigateToCamera = () => {
    router.push("/(tabs)/camera/cameraScreen");
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
      Alert.alert("Lỗi", "Không lấy được dữ liệu thời tiết");
    }
  };

  return {
    locationAllowed,
    temperature,
    navigateToCamera,
    navigateWeather,
    handleAllowLocation,
  };
};
