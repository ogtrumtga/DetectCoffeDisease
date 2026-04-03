export type SprayConditionType = 'GOOD' | 'OK' | 'BAD';

export interface SprayCondition {
  hour: number;
  condition: SprayConditionType;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  deltaT: number;
}
