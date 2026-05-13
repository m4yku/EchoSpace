// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from '../constants/designTokens';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return {
    colors,
    isDark,
    colorScheme,
  };
}