/**
 * Component Sizes
 * Kích thước chuẩn cho các component
 */

export const ComponentSizes = {
  // Button sizes
  button: {
    small: { height: 32, paddingHorizontal: 12 },
    medium: { height: 40, paddingHorizontal: 16 },
    large: { height: 48, paddingHorizontal: 20 }
  },

  // Input sizes
  input: {
    small: { height: 32, paddingHorizontal: 12 },
    medium: { height: 40, paddingHorizontal: 16 },
    large: { height: 48, paddingHorizontal: 16 }
  },

  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80
  },

  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 40
  },

  // Community specific
  community: {
    postImageHeight: 200,
    postDetailImageHeight: 250,
    commentIndent: 64,
    fabSize: 56
  }
} as const;