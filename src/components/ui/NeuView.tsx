import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { BorderRadius, LightColors, DarkColors } from '@/src/constants/designTokens';

interface NeuViewProps extends ViewProps {
  inset?: boolean;
  radius?: number;
}

export function NeuView({ style, children, inset, radius = BorderRadius.md, ...props }: NeuViewProps) {
  // 1. Alamin ang system theme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 2. Kunin ang tamang colors base sa theme
  const themeColors = isDark ? DarkColors : LightColors;

  // 3. I-setup ang dynamic shadow configuration para sa Light at Dark Neumorphism
  const surfaceColor = themeColors.surface;
  
  // INSET SETTINGS
  const insetBg = isDark ? '#15181C' : '#D6DCE4';
  const insetBorderDark = isDark ? '#0A0C0F' : '#C0C9D6';
  const insetBorderLight = isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';

  // OUTSET (EXTRUDED) SETTINGS
  const lightShadowColor = '#FFFFFF';
  const lightShadowOpacity = isDark ? 0.05 : 0.8;
  
  const darkShadowColor = isDark ? '#000000' : '#A3B1C6';
  const darkShadowOpacity = isDark ? 0.6 : 0.6;

  // 4. Dynamic Styles Object
  const dynamicStyles = {
    outerLightShadow: {
      backgroundColor: surfaceColor,
      shadowColor: lightShadowColor,
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: lightShadowOpacity,
      shadowRadius: 8,
      elevation: 2,
    },
    innerDarkShadow: {
      backgroundColor: surfaceColor,
      shadowColor: darkShadowColor,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: darkShadowOpacity,
      shadowRadius: 10,
      elevation: 5,
    },
    insetBase: {
      backgroundColor: insetBg,
      borderTopWidth: 1.5, 
      borderLeftWidth: 1.5, 
      borderBottomWidth: 1, 
      borderRightWidth: 1,
      borderTopColor: insetBorderDark,
      borderLeftColor: insetBorderDark,
      borderBottomColor: insetBorderLight,
      borderRightColor: insetBorderLight,
      overflow: 'hidden' as const,
    }
  };

  // 5. Render
  if (inset) {
    return (
      <View style={[dynamicStyles.insetBase, { borderRadius: radius }, style]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <View style={[dynamicStyles.outerLightShadow, { borderRadius: radius }, style]} {...props}>
      <View style={[dynamicStyles.innerDarkShadow, { borderRadius: radius }, style]}>
        {children}
      </View>
    </View>
  );
}