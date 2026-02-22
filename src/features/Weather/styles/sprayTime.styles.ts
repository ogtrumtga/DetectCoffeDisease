import { StyleSheet } from 'react-native';
import { WEATHER_COLORS } from '../constants';

export const sprayTimeStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: WEATHER_COLORS.CARD,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 16,
  },
  conditionBox: {
    borderWidth: 2,
    borderColor: '#0f3060',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  conditionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WEATHER_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  item: {
    alignItems: 'center',
    minWidth: 60,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconGood: {
    backgroundColor: WEATHER_COLORS.SPRAY_GOOD,
  },
  iconOk: {
    backgroundColor: WEATHER_COLORS.SPRAY_OK,
  },
  iconBad: {
    backgroundColor: WEATHER_COLORS.SPRAY_BAD,
  },
  iconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hourText: {
    fontSize: 14,
    color: WEATHER_COLORS.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -2,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 24,
  },
  explainLink: {
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  explainText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
