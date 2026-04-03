import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WeatherHourly } from '../models';
import { forecastStyles } from '../styles';
import { getWeatherIcon, formatHour } from '../utils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastListProps {
  hourly: WeatherHourly[];
  currentWeatherCode?: number;
  currentTemperature?: number;
}

export function HourlyForecastList({ hourly, currentWeatherCode, currentTemperature }: HourlyForecastListProps) {
  if (hourly.length === 0) return null;

  return (
    <View style={forecastStyles.hourlyContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={forecastStyles.hourlyList}
      >
        {hourly.map((item, index) => {
          // Use current weather code for first item (current hour)
          const weatherCode = index === 0 && currentWeatherCode ? currentWeatherCode : item.weatherCode;
          // Use current temperature for first item (current hour)
          const temperature = index === 0 && currentTemperature !== undefined ? currentTemperature : item.temperature;
          
          return (
            <View key={index} style={forecastStyles.hourlyItem}>
              <Text style={forecastStyles.hourlyTime}>
                {index === 0 ? 'Bây giờ' : formatHour(item.hour)}
              </Text>
              {index === 0 && <View style={forecastStyles.hourlyItemDivider} />}
              <WeatherIcon icon={getWeatherIcon(weatherCode)} size={32} />
              <Text style={forecastStyles.hourlyTemp}>{temperature}°</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
