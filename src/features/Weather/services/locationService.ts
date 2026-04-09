import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEATHER_API } from '../constants';

export interface LocationData {
  latitude: number;
  longitude: number;
  cityName: string;
}

const GPS_PERMISSION_KEY = '@gps_permission';
const CACHED_LOCATION_KEY = '@cached_location';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 giờ - cache location lâu hơn để tránh hỏi permission

export const locationService = {
  /**
   * Request location permission and get current GPS coordinates
   */
  async getCurrentLocation(
    options?: { useCacheFirst?: boolean; shouldPrompt?: boolean }
  ): Promise<{ latitude: number; longitude: number }> {
    const useCacheFirst = options?.useCacheFirst ?? true;
    const shouldPrompt = options?.shouldPrompt ?? false;

    // Luôn thử cache trước
    if (useCacheFirst) {
      const cached = await this.getCachedLocation();
      if (cached) {
        console.log('[LocationService] Using cached location');
        return cached;
      }
    }

    // Kiểm tra permission hiện tại
    const foreground = await Location.getForegroundPermissionsAsync();
    let status = foreground.status;

    // Chỉ request permission nếu shouldPrompt = true VÀ chưa có permission
    if (status !== 'granted' && shouldPrompt) {
      console.log('[LocationService] Requesting permission...');
      const requested = await Location.requestForegroundPermissionsAsync();
      status = requested.status;
    }

    // Nếu có permission, lấy location mới
    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Cache location mới
        await AsyncStorage.setItem(CACHED_LOCATION_KEY, JSON.stringify({
          ...coords,
          timestamp: Date.now(),
        }));
        
        await AsyncStorage.setItem(GPS_PERMISSION_KEY, 'granted');

        console.log('[LocationService] Got fresh location');
        return coords;
      } catch (error) {
        console.error('[LocationService] Failed to get location:', error);
        // Fallback to cache nếu có lỗi
        const cached = await this.getCachedLocation();
        if (cached) return cached;
      }
    }

    // Nếu không có permission, thử dùng cache
    const cached = await this.getCachedLocation();
    if (cached) {
      console.log('[LocationService] Using cached location (no permission)');
      return cached;
    }

    // Chỉ throw error nếu không có cache VÀ không có permission
    throw new Error('GPS_PERMISSION_DENIED');
  },

  /**
   * Reverse geocode coordinates to city name using Nominatim
   */
  async getCityName(latitude: number, longitude: number): Promise<string> {
    try {
      const url = `${WEATHER_API.GEOCODING_URL}?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CoffeeWeatherApp/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('GEOCODING_FAILED');
      }

      const data = await response.json();
      
      // Try to get city name from various fields
      const cityName = 
        data.address?.city || 
        data.address?.town || 
        data.address?.village || 
        data.address?.state || 
        'Vị trí hiện tại';

      return cityName;
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Vị trí hiện tại';
    }
  },

  /**
   * Get cached location if still valid
   */
  async getCachedLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHED_LOCATION_KEY);
      if (!raw) return null;
      
      const parsed = JSON.parse(raw);
      
      // Kiểm tra cache còn hạn không (1 giờ)
      const now = Date.now();
      if (parsed.timestamp && (now - parsed.timestamp > CACHE_EXPIRY_MS)) {
        console.log('[LocationService] Cache expired');
        return null;
      }
      
      if (
        typeof parsed?.latitude === 'number' &&
        typeof parsed?.longitude === 'number'
      ) {
        return { latitude: parsed.latitude, longitude: parsed.longitude };
      }
      return null;
    } catch {
      return null;
    }
  },

  async getLocationData(options?: { useCacheFirst?: boolean; shouldPrompt?: boolean }): Promise<LocationData> {
    const coords = await this.getCurrentLocation(options);
    const cityName = await this.getCityName(coords.latitude, coords.longitude);

    return {
      ...coords,
      cityName,
    };
  },
};
