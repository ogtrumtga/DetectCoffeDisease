/**
 * Padding Values
 * Khoảng cách padding theo scale 4px
 */

export const Paddings = {
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

// Type-safe padding type
export type PaddingSize = keyof typeof Paddings;