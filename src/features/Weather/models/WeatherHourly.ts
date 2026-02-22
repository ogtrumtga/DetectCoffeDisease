export interface WeatherHourly {
  time: string;
  hour: number;
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  precipitationProbability: number;
  dewPoint: number;
}
