// API Configuration
export const WEATHER_API = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING_URL: 'https://nominatim.openstreetmap.org/reverse',
  TIMEZONE: 'Asia/Ho_Chi_Minh',
} as const;

// Spray condition thresholds
export const SPRAY_THRESHOLDS = {
  RAIN: {
    GOOD: 0,
    OK: 0.1,
  },
  WIND: {
    GOOD: 12,
    OK: 25,
  },
  DELTA_T: {
    OK_MIN: 0,
    GOOD_MIN: 2,
    GOOD_MAX: 8,
    OK_MAX: 10,
  },
} as const;

// Weather code mapping (Open-Meteo)
export const WEATHER_CODES = {
  0: { description: 'Trời quang', icon: 'sunny' },
  1: { description: 'Chủ yếu quang', icon: 'partly-cloudy' },
  2: { description: 'Có mây', icon: 'partly-cloudy' },
  3: { description: 'U ám', icon: 'cloudy' },
  45: { description: 'Sương mù', icon: 'cloudy' },
  48: { description: 'Sương mù đóng băng', icon: 'cloudy' },
  51: { description: 'Mưa phùn nhẹ', icon: 'rainy' },
  53: { description: 'Mưa phùn vừa', icon: 'rainy' },
  55: { description: 'Mưa phùn dày đặc', icon: 'rainy' },
  61: { description: 'Mưa nhẹ', icon: 'rainy' },
  63: { description: 'Mưa vừa', icon: 'rainy' },
  65: { description: 'Mưa to', icon: 'rainy' },
  71: { description: 'Tuyết nhẹ', icon: 'snow' },
  73: { description: 'Tuyết vừa', icon: 'snow' },
  75: { description: 'Tuyết dày', icon: 'snow' },
  77: { description: 'Tuyết hạt', icon: 'snow' },
  80: { description: 'Mưa rào nhẹ', icon: 'rainy' },
  81: { description: 'Mưa rào vừa', icon: 'rainy' },
  82: { description: 'Mưa rào mạnh', icon: 'rainy' },
  85: { description: 'Tuyết rào nhẹ', icon: 'snow' },
  86: { description: 'Tuyết rào mạnh', icon: 'snow' },
  95: { description: 'Dông', icon: 'thunderstorm' },
  96: { description: 'Dông có mưa đá nhẹ', icon: 'thunderstorm' },
  99: { description: 'Dông có mưa đá mạnh', icon: 'thunderstorm' },
} as const;

// Colors
export const WEATHER_COLORS = {
  SPRAY_GOOD: '#B8E6D5',
  SPRAY_OK: '#FFE5B4',
  SPRAY_BAD: '#FFB8C6',
  BACKGROUND: '#E8EDF2',
  CARD: '#FFFFFF',
  CARD_SLATE: '#6B7C93',
  CARD_SLATE_DARK: '#5A6B82',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#FFFFFF',
  TEXT_LIGHT: '#E0E0E0',
  ACCENT: '#7C3AED',
  BORDER: '#7C3AED',
  BORDER_LIGHT: '#E5E7EB',
} as const;
