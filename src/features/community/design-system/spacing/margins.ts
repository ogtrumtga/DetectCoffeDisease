/**
 * Margin Values
 * Khoảng cách margin theo scale 4px
 */

export const Margins = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48
} as const;

// Type-safe margin type
export type MarginSize = keyof typeof Margins;