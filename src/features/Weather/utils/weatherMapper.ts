import { WEATHER_CODES } from '../constants';
import { WeatherCurrent, WeatherHourly, WeatherDaily } from '../models';
import { OpenMeteoResponse } from '../services';

/**
 * Get weather description from weather code
 */
export function getWeatherDescription(weatherCode: number): string {
  return WEATHER_CODES[weatherCode as keyof typeof WEATHER_CODES]?.description || 'Không xác định';
}

/**
 * Get weather icon name from weather code
 */
export function getWeatherIcon(weatherCode: number): string {
  return WEATHER_CODES[weatherCode as keyof typeof WEATHER_CODES]?.icon || 'cloudy';
}

/**
 * Map Open-Meteo current weather to WeatherCurrent model
 */
export function mapCurrentWeather(data: OpenMeteoResponse): WeatherCurrent {
  return {
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    weatherDescription: getWeatherDescription(data.current.weather_code),
    windSpeed: data.current.wind_speed_10m,
    dewPoint: data.current.dew_point_2m,
    time: data.current.time,
  };
}

/**
 * Map Open-Meteo hourly weather to WeatherHourly models
 * Returns at least 24 hours from current time (including next day if needed)
 */
export function mapHourlyWeather(data: OpenMeteoResponse): WeatherHourly[] {
  // Get REAL current time from device (not from API)
  const now = new Date();
  const deviceHour = now.getHours();
  
  const allHourly = data.hourly.time
    .map((time, index) => {
      // Extract hour directly from ISO string (format: "2024-02-10T10:00")
      const hour = parseInt(time.split('T')[1].split(':')[0], 10);
      
      return {
        time,
        hour,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        humidity: data.hourly.relative_humidity_2m[index],
        weatherCode: data.hourly.weather_code[index],
        windSpeed: data.hourly.wind_speed_10m[index],
        precipitation: data.hourly.precipitation[index],
        precipitationProbability: data.hourly.precipitation_probability[index],
        dewPoint: data.hourly.dew_point_2m[index],
      };
    })
    .filter((item) => {
      // Use device hour to filter
      // Include current hour and all future hours
      return item.hour >= deviceHour;
    });






  // Return at least 24 hours (or all available if less)
  return allHourly.slice(0, 24);
}

/**
 * Map Open-Meteo daily weather to WeatherDaily models
 */
export function mapDailyWeather(data: OpenMeteoResponse): WeatherDaily[] {
  const dayNames = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];
  const today = new Date();

  return data.daily.time.slice(0, 7).map((date, index) => {
    const itemDate = new Date(date);
    const isToday = itemDate.toDateString() === today.toDateString();
    const dayName = isToday ? 'Hôm nay' : dayNames[itemDate.getDay()];

    return {
      date,
      dayName,
      weatherCode: data.daily.weather_code[index],
      temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
      precipitationSum: data.daily.precipitation_sum[index],
    };
  });
}
