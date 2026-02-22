/**
 * Font Weights
 * Độ đậm của font chữ
 */

export const FontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900'
} as const;

// Type-safe font weight type
export type FontWeight = keyof typeof FontWeights;