import * as Location from 'expo-location';
import { WEATHER_API } from '../constants';

export interface LocationData {
  latitude: number;
  longitude: number;
  cityName: string;
}

export const locationService = {
  /**
   * Request location permission and get current GPS coordinates
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('GPS_PERMISSION_DENIED');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
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
   * Get full location data (coordinates + city name)
   */
  async getLocationData(): Promise<LocationData> {
    const coords = await this.getCurrentLocation();
    const cityName = await this.getCityName(coords.latitude, coords.longitude);

    return {
      ...coords,
      cityName,
    };
  },
};
