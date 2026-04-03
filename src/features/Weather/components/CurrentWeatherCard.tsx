import React from 'react';
import { Text, View } from 'react-native';
import { WeatherCurrent, WeatherDaily } from '../models';
import { forecastStyles } from '../styles';
import { getWeatherIcon } from '../utils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  current: WeatherCurrent;
  daily: WeatherDaily[];
  cityName: string;
}

export function CurrentWeatherCard({ current, daily, cityName }: CurrentWeatherCardProps) {
  const todayForecast = daily[0];
  
  return (
    <View style={forecastStyles.currentCard}>
      <Text style={forecastStyles.cityName}>{cityName}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <View>
          <Text style={forecastStyles.currentTemp}>{current.temperature}°C</Text>
          <Text style={forecastStyles.currentDescription}>{current.weatherDescription}</Text>
          {todayForecast && (
            <View style={forecastStyles.currentDetails}>
              <Text style={forecastStyles.currentDetailText}>
                C: {todayForecast.temperatureMax}°C
              </Text>
              <Text style={forecastStyles.currentDetailText}>
                T: {todayForecast.temperatureMin}°C
              </Text>
            </View>
          )}
        </View>
        <WeatherIcon icon={getWeatherIcon(current.weatherCode)} size={120} />
      </View>
    </View>
  );
}
