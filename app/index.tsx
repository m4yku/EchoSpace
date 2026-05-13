import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { LightColors, DarkColors } from '@/src/constants/designTokens';

export default function IndexScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const colorScheme = useColorScheme();
  const Colors = colorScheme === 'dark' ? DarkColors : LightColors;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});