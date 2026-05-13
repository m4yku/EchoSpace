import React from 'react';
import { View, ViewProps, useColorScheme, Platform } from 'react-native';
import { BorderRadius, LightColors, DarkColors } from '@/src/constants/designTokens';

interface NeuViewProps extends ViewProps {
  inset?: boolean;
  radius?: number;
}

export function NeuView({ style, children, inset, radius = BorderRadius.md, ...props }: NeuViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? DarkColors : LightColors;
  const surfaceColor = themeColors.surface;

  // INSET
  const insetBg = isDark ? '#15181C' : '#D6DCE4';
  const insetBorderDark = isDark ? '#0A0C0F' : '#C0C9D6';
  const insetBorderLight = isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';

  // OUTSET shadow values
  const lightShadowOpacity = isDark ? 0.05 : 0.8;
  const darkShadowColor = isDark ? '#000000' : '#A3B1C6';
  const darkShadowOpacity = 0.6;

  const isWeb = Platform.OS === 'web';

  if (inset) {
    return (
      <View
        style={[
          {
            backgroundColor: insetBg,
            borderTopWidth: 1.5,
            borderLeftWidth: 1.5,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderTopColor: insetBorderDark,
            borderLeftColor: insetBorderDark,
            borderBottomColor: insetBorderLight,
            borderRightColor: insetBorderLight,
            overflow: 'hidden',
            borderRadius: radius,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  if (isWeb) {
    // Web: use boxShadow string (CSS-style)
    const lightShadow = isDark
      ? `-4px -4px 8px rgba(255,255,255,${lightShadowOpacity})`
      : `-4px -4px 8px rgba(255,255,255,${lightShadowOpacity})`;
    const darkShadow = isDark
      ? `6px 6px 10px rgba(0,0,0,${darkShadowOpacity})`
      : `6px 6px 10px rgba(163,177,198,${darkShadowOpacity})`;

    return (
      <View
        style={[
          {
            backgroundColor: surfaceColor,
            borderRadius: radius,
            // @ts-ignore - boxShadow is web-only
            boxShadow: `${lightShadow}, ${darkShadow}`,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  // Native: use shadow* props (iOS) + elevation (Android)
  return (
    <View
      style={[
        {
          backgroundColor: surfaceColor,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: -4, height: -4 },
          shadowOpacity: lightShadowOpacity,
          shadowRadius: 8,
          elevation: 2,
          borderRadius: radius,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          {
            backgroundColor: surfaceColor,
            shadowColor: darkShadowColor,
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: darkShadowOpacity,
            shadowRadius: 10,
            elevation: 5,
            borderRadius: radius,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}