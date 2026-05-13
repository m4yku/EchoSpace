import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors, BorderRadius } from '@/src/constants/designTokens';

interface NeuViewProps extends ViewProps {
  inset?: boolean;
  radius?: number;
}

export function NeuView({ style, children, inset, radius = BorderRadius.md, ...props }: NeuViewProps) {
  if (inset) {
    return (
      <View style={[styles.insetBase, { borderRadius: radius }, style]} {...props}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.outerLightShadow, { borderRadius: radius }, style]} {...props}>
      <View style={[styles.innerDarkShadow, { borderRadius: radius }, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerLightShadow: {
    backgroundColor: Colors.surface,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.05, // Very subtle light highlight for dark mode
    shadowRadius: 8,
    elevation: 2,
  },
  innerDarkShadow: {
    backgroundColor: Colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.6, // Stronger dark shadow
    shadowRadius: 10,
    elevation: 5,
  },
  insetBase: {
    backgroundColor: '#15181C', // Slightly darker than background to look pressed
    borderTopWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1,
    borderColor: '#0A0C0F', // Dark top-left inner shadow simulation
    borderBottomColor: 'rgba(255,255,255,0.05)', // Subtle bottom-right highlight
    borderRightColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  }
});