import { WEATHER_API } from '../constants';

export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    dew_point_2m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    precipitation: number[];
    precipitation_probability: number[];
    dew_point_2m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export const weatherService = {
  /**
   * Fetch weather data from Open-Meteo API
   */
  async getWeatherData(latitude: number, longitude: number): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,dew_point_2m',
      hourly: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,precipitation_probability,dew_point_2m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
      timezone: WEATHER_API.TIMEZONE,
      forecast_days: '7',
    });

    const url = `${WEATHER_API.BASE_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('WEATHER_API_FAILED');
    }

    const data: OpenMeteoResponse = await response.json();
    return data;
  },
};
