import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Animated, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';

const nativeDriver = Platform.OS !== 'web';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const isDark = useColorScheme() === 'dark';
  const Colors = isDark ? DarkColors : LightColors;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: nativeDriver }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 2500, useNativeDriver: nativeDriver }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: nativeDriver }),
      ])
    ).start();
  }, []);

  const VisualPanel = () => (
    <LinearGradient
      colors={isDark ? ['#1A1E23', '#111316', '#2D2759'] : [Colors.background, Colors.surface, '#6C63FF20']}
      style={styles.visualPanel}
    >
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <NeuView radius={BorderRadius.round} style={styles.artCircle}>
          <Text style={{ fontSize: 64 }}>✨</Text>
        </NeuView>
      </Animated.View>
      <Text style={[Typography.h1, { fontSize: 48, color: Colors.text, marginBottom: Spacing.sm }]}>EchoSpace</Text>
      <Text style={[Typography.body, { color: Colors.textMuted, fontSize: 18, textAlign: 'center', maxWidth: 400 }]}>
        Send echoes that resonate in your emotional universe.
      </Text>
    </LinearGradient>
  );

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      {isDesktop && <VisualPanel />}

      <SafeAreaView style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          {!isDesktop && (
            <View style={styles.mobileHeader}>
              <NeuView radius={BorderRadius.round} style={styles.artCircleMobile}>
                <Text style={{ fontSize: 48 }}>✨</Text>
              </NeuView>
              <Text style={[Typography.h1, { color: Colors.text, marginBottom: Spacing.sm }]}>EchoSpace</Text>
              <Text style={[Typography.body, { color: Colors.textMuted, textAlign: 'center' }]}>Send echoes that resonate.</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}>
              <View style={[styles.primaryButton, { backgroundColor: Colors.primary }]}>
                <Text style={styles.primaryButtonText}>Login</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.8}>
              <NeuView inset radius={BorderRadius.md} style={styles.secondaryButton}>
                <Text style={[styles.secondaryButtonText, { color: Colors.primary }]}>Sign Up</Text>
              </NeuView>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  visualPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  artCircle: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  artCircleMobile: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  formContainer: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  formContainerDesktop: { maxWidth: 500, alignSelf: 'center' },
  mobileHeader: { alignItems: 'center', marginBottom: 60 },
  buttonContainer: { width: '100%', gap: Spacing.xl },
  primaryButton: { paddingVertical: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.md },
  primaryButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { paddingVertical: Spacing.lg, alignItems: 'center' },
  secondaryButtonText: { fontSize: 18, fontWeight: 'bold' },
});