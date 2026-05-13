export const Colors = {
  background: '#1A1E23', // Deep cool dark grey
  surface: '#1A1E23',    // Same as background to maintain the "molded" illusion
  text: '#E8EAED',       // Off-white for high contrast
  textMuted: '#9AA0A6',  // Readable cool grey
  primary: '#8B84FF',    // Vibrant Violet (Lighter for dark mode visibility)
  success: '#38B2AC',    
  error: '#FF6B6B',
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.5 },
  body: { fontSize: 16, fontWeight: '500' as const, color: Colors.textMuted },
};

export const Spacing = { sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const BorderRadius = { sm: 12, md: 16, lg: 24, xl: 32, round: 9999 };