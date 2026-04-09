import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { weatherService, locationService } from '../services';
import { WeatherCurrent, WeatherHourly, WeatherDaily } from '../models';
import { mapCurrentWeather, mapHourlyWeather, mapDailyWeather } from '../utils';
import { locationPermissionService, LocationPermissionPayload } from '../../../services/locationPermissionService';

const CACHE_KEY = '@weather_data';
const WEATHER_CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 phút - cache weather data

interface WeatherData {
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
  cityName: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export function useWeatherVM() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load cached data
   */
  const loadCachedData = async (): Promise<WeatherData | null> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Kiểm tra cache còn hạn không (30 phút)
        const now = new Date().getTime();
        const lastUpdated = new Date(data.lastUpdated).getTime();
        
        if (now - lastUpdated < WEATHER_CACHE_EXPIRY_MS) {
          console.log('[WeatherVM] Using cached weather data');
          return data;
        } else {
          console.log('[WeatherVM] Weather cache expired');
        }
      }
    } catch (err) {
      console.error('Failed to load cache:', err);
    }
    return null;
  };

  /**
   * Save data to cache
   */
  const saveCachedData = async (weatherData: WeatherData) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(weatherData));
    } catch (err) {
      console.error('Failed to save cache:', err);
    }
  };

  /**
   * Fetch weather data
   */
  const fetchWeatherData = useCallback(async (options?: { shouldPrompt?: boolean }) => {
    try {
      setError(null);

      // Get location
      const location = await locationService.getLocationData({
        useCacheFirst: true,
        shouldPrompt: options?.shouldPrompt ?? false,
      });

      // Get weather
      const weatherResponse = await weatherService.getWeatherData(
        location.latitude,
        location.longitude
      );

      // Map data
      const weatherData: WeatherData = {
        current: mapCurrentWeather(weatherResponse),
        hourly: mapHourlyWeather(weatherResponse),
        daily: mapDailyWeather(weatherResponse),
        cityName: location.cityName,
        latitude: location.latitude,
        longitude: location.longitude,
        lastUpdated: new Date().toISOString(),
      };

      setData(weatherData);
      await saveCachedData(weatherData);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      
      if (err.message === 'GPS_PERMISSION_DENIED') {
        setError('Vui lòng bật GPS để sử dụng tính năng này');
      } else {
        setError('Không thể tải dữ liệu thời tiết. Vui lòng thử lại.');
      }
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    const init = async () => {
      console.log('[WeatherVM] Initializing...');
      setLoading(true);
      
      // Try to load cached data first
      const cached = await loadCachedData();
      if (cached) {
        console.log('[WeatherVM] Cache found and valid, using it');
        setData(cached);
        setLoading(false);
        // Không fetch fresh data nếu cache còn hạn
        return;
      }

      // Chỉ fetch fresh data nếu không có cache hoặc cache hết hạn
      console.log('[WeatherVM] No valid cache, fetching fresh data...');
      await fetchWeatherData({ shouldPrompt: false });
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      locationPermissionService.eventName,
      async (payload: LocationPermissionPayload) => {
        if (!payload?.granted) return;
        await fetchWeatherData({ shouldPrompt: false });
      }
    );

    return () => subscription.remove();
  }, [fetchWeatherData]);

  /**
   * Refresh handler (pull-to-refresh) - KHÔNG hỏi permission nữa
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWeatherData({ shouldPrompt: false });
    setRefreshing(false);
  }, [fetchWeatherData]);

  /**
   * Retry handler (for error state)
   */
  const retry = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchWeatherData({ shouldPrompt: true });
    setLoading(false);
  }, [fetchWeatherData]);

  return {
    data,
    loading,
    refreshing,
    error,
    onRefresh,
    retry,
  };
}
