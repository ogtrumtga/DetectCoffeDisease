import { StyleSheet } from 'react-native';
import { WEATHER_COLORS } from '../constants';

export const forecastStyles = StyleSheet.create({
  // Current Weather Card
  currentCard: {
    backgroundColor: '#c1e8ff',
    marginHorizontal: 0,
    marginTop: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderRadius: 0,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    color: WEATHER_COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  currentTemp: {
    fontSize: 64,
    fontWeight: '700',
    color: WEATHER_COLORS.TEXT_PRIMARY,
  },
  currentDescription: {
    fontSize: 18,
    color: WEATHER_COLORS.TEXT_PRIMARY,
    marginTop: 8,
  },
  currentDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  currentDetailText: {
    fontSize: 16,
    color: WEATHER_COLORS.TEXT_PRIMARY,
  },

  // Hourly Forecast
  hourlyContainer: {
    marginTop: 32,
    backgroundColor: WEATHER_COLORS.CARD_SLATE,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  hourlyList: {
    paddingVertical: 4,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
    position: 'relative',
  },
  hourlyItemDivider: {
    position: 'absolute',
    left: -1000,
    right: -1000,
    top: 22,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  hourlyTime: {
    fontSize: 14,
    color: WEATHER_COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  hourlyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_SECONDARY,
  },

  // Daily Forecast
  dailyContainer: {
    marginTop: 16,
    backgroundColor: WEATHER_COLORS.CARD_SLATE,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  dailyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_SECONDARY,
  },
  dailyHeaderDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dailyItemToday: {
    // Removed border
  },
  dailyItemLast: {
    borderBottomWidth: 0,
  },
  dailyDay: {
    fontSize: 16,
    color: WEATHER_COLORS.TEXT_SECONDARY,
    width: 80,
  },
  dailyIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  dailyTemps: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dailyTempMax: {
    fontSize: 16,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_SECONDARY,
  },
  dailyTempMin: {
    fontSize: 16,
    color: WEATHER_COLORS.TEXT_LIGHT,
  },
  dailyDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
});
