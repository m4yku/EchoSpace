import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/src/constants/designTokens';

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen 
        name="echo/compose" 
        options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} 
      />
    </Stack>
  );
}