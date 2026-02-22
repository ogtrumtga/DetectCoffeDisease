/**
 * Community Shadows
 * Shadow riêng cho community feature
 */

import { Platform } from 'react-native';

const createShadow = (offsetHeight: number, opacity: number, radius: number, elevation: number) => {
  if (Platform.OS === 'web') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: offsetHeight },
      shadowOpacity: opacity,
      shadowRadius: radius,
      // @ts-ignore - boxShadow is web-only
      boxShadow: `0px ${offsetHeight}px ${radius}px rgba(0, 0, 0, ${opacity})`
    };
  }
  
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offsetHeight },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation
  };
};

export const CommunityShadows = {
  // Post card shadow
  postCard: createShadow(2, 0.08, 12, 3),
  
  // FAB shadow
  fab: createShadow(4, 0.3, 4.65, 8),
  
  // Header shadow
  header: createShadow(1, 0.05, 2, 1),
  
  // Input shadow
  input: createShadow(1, 0.05, 2, 1)
} as const;