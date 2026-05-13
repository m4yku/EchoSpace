// src/constants/designTokens.ts

export const LightColors = {
  background: '#E0E5EC', // Cool clay light
  surface: '#E0E5EC',
  text: '#3D4852',       // Dark grey para sa text
  textMuted: '#6B7280',
  primary: '#6C63FF',    // Vibrant Violet
  success: '#38B2AC',
  error: '#FF6B6B',
};

export const DarkColors = {
  background: '#1A1E23', // Deep cool dark grey
  surface: '#1A1E23',    // Same as background
  text: '#E8EAED',       // Off-white para sa text
  textMuted: '#9AA0A6',  // Readable cool grey
  primary: '#8B84FF',    // Lighter Violet for dark mode
  success: '#38B2AC',
  error: '#FF6B6B',
};

// Tinanggal ang 'color' dito para maging dynamic base sa theme
export const Typography = {
  h1: { 
    fontSize: 32, 
    fontWeight: '800' as const, 
    letterSpacing: -0.5 
  },
  h2: { 
    fontSize: 24, 
    fontWeight: '700' as const, 
    letterSpacing: -0.5 
  },
  body: { 
    fontSize: 16, 
    fontWeight: '500' as const 
  },
};

export const Spacing = { 
  sm: 8, 
  md: 16, 
  lg: 24, 
  xl: 32, 
  xxl: 48 
};

export const BorderRadius = { 
  sm: 12, 
  md: 16, 
  lg: 24, 
  xl: 32, 
  round: 9999 
};