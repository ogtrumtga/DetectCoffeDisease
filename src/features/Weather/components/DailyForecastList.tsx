import React from 'react';
import { View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherDaily } from '../models';
import { forecastStyles } from '../styles';
import { getWeatherIcon } from '../utils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastListProps {
  daily: WeatherDaily[];
}

export function DailyForecastList({ daily }: DailyForecastListProps) {
  return (
    <View style={forecastStyles.dailyContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <IconSymbol name="calendar" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={forecastStyles.dailyTitle}>DỰ BÁO 6 NGÀY TIẾP THEO</Text>
      </View>
      <View style={forecastStyles.dailyHeaderDivider} />
      {daily.map((item, index) => (
        <React.Fragment key={item.date}>
          <View style={forecastStyles.dailyItem}>
            <Text style={forecastStyles.dailyDay}>{item.dayName}</Text>
            <WeatherIcon icon={getWeatherIcon(item.weatherCode)} size={28} />
            <View style={forecastStyles.dailyTemps}>
              <Text style={forecastStyles.dailyTempMax}>C: {item.temperatureMax}°C</Text>
              <Text style={forecastStyles.dailyTempMin}>T: {item.temperatureMin}°C</Text>
            </View>
          </View>
          {index < daily.length - 1 && (
            <View style={forecastStyles.dailyDivider} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
