import { SPRAY_THRESHOLDS } from '../constants';
import { SprayConditionType } from '../models';

export interface SprayConditionInput {
  precipitation: number;
  windSpeed: number;
  temperature: number;
  dewPoint: number;
}

/**
 * Calculate spray condition based on weather parameters
 */
export function calculateSprayCondition(input: SprayConditionInput): SprayConditionType {
  const { precipitation, windSpeed, temperature, dewPoint } = input;
  const deltaT = temperature - dewPoint;

  let badCount = 0;
  let okCount = 0;

  // Check rain
  if (precipitation >= SPRAY_THRESHOLDS.RAIN.OK) {
    badCount++;
  } else if (precipitation > SPRAY_THRESHOLDS.RAIN.GOOD && precipitation < SPRAY_THRESHOLDS.RAIN.OK) {
    okCount++;
  }

  // Check wind
  if (windSpeed > SPRAY_THRESHOLDS.WIND.OK) {
    badCount++;
  } else if (windSpeed >= SPRAY_THRESHOLDS.WIND.GOOD && windSpeed <= SPRAY_THRESHOLDS.WIND.OK) {
    okCount++;
  }

  // Check Delta T
  if (deltaT > SPRAY_THRESHOLDS.DELTA_T.OK_MAX) {
    badCount++;
  } else if (
    (deltaT >= SPRAY_THRESHOLDS.DELTA_T.OK_MIN && deltaT < SPRAY_THRESHOLDS.DELTA_T.GOOD_MIN) ||
    (deltaT > SPRAY_THRESHOLDS.DELTA_T.GOOD_MAX && deltaT <= SPRAY_THRESHOLDS.DELTA_T.OK_MAX)
  ) {
    okCount++;
  }

  // Determine final condition
  if (badCount > 0) return 'BAD';
  if (okCount > 0) return 'OK';
  return 'GOOD';
}

/**
 * Calculate Delta T
 */
export function calculateDeltaT(temperature: number, dewPoint: number): number {
  return temperature - dewPoint;
}
