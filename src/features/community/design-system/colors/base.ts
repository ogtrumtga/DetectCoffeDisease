/**
 * Base Color System
 * Màu sắc cơ bản cho toàn bộ ứng dụng
 */

export const BaseColors = {
  // Primary Colors - Màu chính
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE', // Main primary
    600: '#2B77CB',
    700: '#2C5AA0',
    800: '#2A4365',
    900: '#1A365D'
  },

  // Secondary Colors - Màu phụ
  secondary: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169', // Main secondary
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532'
  },

  // Gray Scale - Thang màu xám
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923'
  },

  // White & Black
  white: '#FFFFFF',
  black: '#000000',

  // Transparent
  transparent: 'transparent'
} as const;