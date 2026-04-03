/**
 * Shadow Elevation System
 * Hệ thống shadow theo Material Design
 */

import { Platform } from 'react-native';

const createElevation = (level: number, shadowOpacity: number, shadowRadius: number) => {
  if (Platform.OS === 'web') {
    // Web sử dụng box-shadow CSS
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: level },
      shadowOpacity,
      shadowRadius,
      // @ts-ignore - boxShadow is web-only
      boxShadow: `0px ${level}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`
    };
  }
  
  // iOS và Android
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: level },
    shadowOpacity,
    shadowRadius,
    elevation: level
  };
};

export const Elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  },
  
  level1: createElevation(1, 0.05, 2),
  level2: createElevation(2, 0.08, 4),
  level3: createElevation(4, 0.12, 8),
  level4: createElevation(8, 0.16, 12),
  level5: createElevation(12, 0.20, 16)
} as const;

// Type-safe elevation type
export type ElevationLevel = keyof typeof Elevation;