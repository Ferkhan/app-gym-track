/**
 * Theme constants for GymTrack app
 */

export const Colors = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  muscle: {
    Legs: '#4A90E2',
    Back: '#50E3C2',
    Chest: '#E05050',
    Arms: '#F5A623',
  },
  ui: {
    shadow: {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    borderRadius: 12,
    borderRadiusLarge: 16,
  },
  gray: {
    light: '#F5F5F5',
    medium: '#CCCCCC',
    dark: '#666666',
  },
  success: '#4CAF50',
  error: '#F44336',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
};
