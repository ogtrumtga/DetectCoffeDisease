import { useMemo } from 'react';
import { WeatherHourly, SprayCondition } from '../models';
import { calculateSprayCondition, calculateDeltaT } from '../utils';

export function useSprayTimeVM(hourlyData: WeatherHourly[]) {
  const sprayConditions = useMemo(() => {
    return hourlyData.map((hourData): SprayCondition => {
      const condition = calculateSprayCondition({
        precipitation: hourData.precipitation,
        windSpeed: hourData.windSpeed,
        temperature: hourData.temperature,
        dewPoint: hourData.dewPoint,
      });

      return {
        hour: hourData.hour,
        condition,
        temperature: hourData.temperature,
        humidity: hourData.humidity,
        windSpeed: hourData.windSpeed,
        precipitation: hourData.precipitation,
        deltaT: calculateDeltaT(hourData.temperature, hourData.dewPoint),
      };
    });
  }, [hourlyData]);

  const hasGoodConditions = useMemo(() => {
    return sprayConditions.some((item) => item.condition === 'GOOD');
  }, [sprayConditions]);

  const hasAnyFavorableConditions = useMemo(() => {
    return sprayConditions.some((item) => item.condition === 'GOOD' || item.condition === 'OK');
  }, [sprayConditions]);

  return {
    sprayConditions,
    hasGoodConditions,
    hasAnyFavorableConditions,
  };
}
