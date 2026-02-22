import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherIconProps {
  icon: string;
  size?: number;
}

const iconMap: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  'light-rain': '🌦️',
  'heavy-rain': '🌧️',
  thunderstorm: '⛈️',
  snow: '❄️',
  fog: '🌫️',
  windy: '💨',
  night: '🌙',
  'partly-cloudy-night': '☁️',
};

export function WeatherIcon({ icon, size = 32 }: WeatherIconProps) {
  const emoji = iconMap[icon] || '☁️';
  
  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize: size }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
