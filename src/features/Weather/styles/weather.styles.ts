import { StyleSheet } from 'react-native';
import { WEATHER_COLORS } from '../constants';

export const weatherStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#c1e8ff',
    minHeight: 70,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: WEATHER_COLORS.TEXT_PRIMARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: WEATHER_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: WEATHER_COLORS.ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
