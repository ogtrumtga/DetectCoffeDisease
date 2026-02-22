/**
 * Responsive Breakpoints
 * Điểm ngắt cho responsive design
 */

export const Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
} as const;

// Type-safe breakpoint type
export type BreakpointSize = keyof typeof Breakpoints;