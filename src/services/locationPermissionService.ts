import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { DeviceEventEmitter } from "react-native";

const GPS_PERMISSION_KEY = "@gps_permission";
const CACHED_LOCATION_KEY = "@cached_location";
const LOCATION_PERMISSION_UPDATED_EVENT = "location-permission-updated";

export type LocationPermissionPayload = {
  granted: boolean;
  latitude?: number;
  longitude?: number;
};

export const locationPermissionService = {
  eventName: LOCATION_PERMISSION_UPDATED_EVENT,

  async requestAndCachePermission(): Promise<LocationPermissionPayload> {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.status === "granted") {
      const payload = await this.cacheCurrentLocation(true);
      this.notifyUpdated(payload);
      return payload;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      await AsyncStorage.setItem(GPS_PERMISSION_KEY, "denied");
      const deniedPayload = { granted: false };
      this.notifyUpdated(deniedPayload);
      return deniedPayload;
    }

    const payload = await this.cacheCurrentLocation(true);
    this.notifyUpdated(payload);
    return payload;
  },

  async cacheCurrentLocation(granted: boolean): Promise<LocationPermissionPayload> {
    await AsyncStorage.setItem(GPS_PERMISSION_KEY, granted ? "granted" : "denied");
    if (!granted) {
      return { granted: false };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    await AsyncStorage.setItem(
      CACHED_LOCATION_KEY,
      JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
      })
    );

    return {
      granted: true,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  notifyUpdated(payload: LocationPermissionPayload): void {
    DeviceEventEmitter.emit(LOCATION_PERMISSION_UPDATED_EVENT, payload);
  },
};
