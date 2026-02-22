/**
 * Gap Values
 * Khoảng cách gap cho flexbox và grid
 */

export const Gaps = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
} as const;

// Type-safe gap type
export type GapSize = keyof typeof Gaps;