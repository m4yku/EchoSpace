import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from '@/src/constants/designTokens';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const Colors = colorScheme === 'dark' ? DarkColors : LightColors;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
  );
}