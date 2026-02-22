/**
 * Semantic Colors
 * Màu sắc theo ý nghĩa (success, error, warning, info)
 */

export const SemanticColors = {
  // Success - Thành công
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    500: '#38A169',
    600: '#2F855A',
    900: '#1C4532'
  },

  // Error - Lỗi
  error: {
    50: '#FED7D7',
    100: '#FEB2B2',
    500: '#E53E3E',
    600: '#C53030',
    900: '#742A2A'
  },

  // Warning - Cảnh báo
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    900: '#78350F'
  },

  // Info - Thông tin
  info: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    500: '#3182CE',
    600: '#2B77CB',
    900: '#1A365D'
  }
} as const;