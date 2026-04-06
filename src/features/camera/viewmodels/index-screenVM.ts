import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";

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

    // Check permission on mount
    checkLocationPermission();
  }, [navigation]);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationAllowed(true);
        // Try to get weather data
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
        });
        const { latitude, longitude } = location.coords;

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );
        const data = await res.json();
        setTemperature(data.current_weather.temperature);
      }
    } catch (e) {
      console.error("Failed to check location permission:", e);
    }
  };

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
        // Không hiện Alert nữa, để WeatherScreen tự xử lý
        // User có thể vào WeatherScreen để xem hướng dẫn chi tiết
        return;
      }

      setLocationAllowed(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );
      const data = await res.json();
      setTemperature(data.current_weather.temperature);
    } catch (e) {
      console.error("Failed to get weather data:", e);
      // Không hiện Alert, chỉ log error
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
