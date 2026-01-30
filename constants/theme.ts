/**
 * Theme constants for GymTrack app
 * Elegant LIGHT theme with premium accent colors
 */

export const Colors = {
  // Light elegant backgrounds
  background: "#F8FAFC",
  backgroundSecondary: "#FFFFFF",
  backgroundCard: "#FFFFFF",
  backgroundElevated: "#F1F5F9",

  // Text colors (dark for light theme)
  text: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#a0a0a0",
  textLight: "#FFFFFF",

  // Premium accent colors with gradient-friendly pairs
  primary: "#332D56", // Vibrant purple
  primaryLight: "#A78BFA",
  primaryDark: "#332D56",

  // Muscle category colors - elegant and vibrant
  muscle: {
    Legs: "#0891B2", // Cyan
    Back: "#059669", // Emerald
    Chest: "#E11D48", // Rose
    Arms: "#D97706", // Amber
  },

  // UI elements
  ui: {
    shadow: {
      elevation: 4,
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    shadowGlow: {
      elevation: 8,
      shadowColor: "#7C4585",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    borderRadius: 16,
    borderRadiusLarge: 24,
    borderRadiusXL: 32,
  },

  // Neutral grays (adjusted for light theme)
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    light: "#CBD5E1",
    medium: "#94A3B8",
    dark: "#64748B",
  },

  // Semantic colors
  success: "#059669",
  successLight: "#10B981",
  error: "#DC2626",
  errorLight: "#EF4444",
  warning: "#D97706",
  info: "#2563EB",

  // Gradient colors
  gradient: {
    primary: ["#7C3AED", "#6366F1"],
    success: ["#059669", "#10B981"],
    premium: ["#7C3AED", "#DB2777"],
    dark: ["#F1F5F9", "#E2E8F0"],
  },

  // Border colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 26,
    fontWeight: "600" as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
};

// Common component styles
export const CommonStyles = {
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadiusLarge,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.ui.shadow,
  },
  cardElevated: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Colors.ui.borderRadiusLarge,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Colors.ui.shadow,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Colors.ui.borderRadius,
    ...Colors.ui.shadowGlow,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.ui.borderRadius,
    color: Colors.text,
  },
};
