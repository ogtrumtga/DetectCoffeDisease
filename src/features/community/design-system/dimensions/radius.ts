/**
 * Border Radius Values
 * Độ bo góc cho các component
 */

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999, // Fully rounded
  
  // Community specific
  community: {
    card: 16,
    button: 25,
    input: 8,
    avatar: 9999,
    image: 12
  }
} as const;

// Type-safe radius type
export type RadiusSize = keyof typeof BorderRadius;