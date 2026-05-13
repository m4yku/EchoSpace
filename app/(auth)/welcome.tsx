import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const VisualPanel = () => (
    <LinearGradient colors={['#1A1E23', '#111316', '#2D2759']} style={styles.visualPanel}>
      <NeuView radius={BorderRadius.round} style={styles.artCircle}>
        <Text style={styles.emoji}>✨</Text>
      </NeuView>
      <Text style={styles.visualTitle}>EchoSpace</Text>
      <Text style={styles.visualTagline}>Send echoes that resonate in the dark.</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.root}>
      {isDesktop && <VisualPanel />}
      
      <SafeAreaView style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
        {!isDesktop && (
          <View style={styles.mobileHeader}>
            <NeuView radius={BorderRadius.round} style={styles.artCircleMobile}>
              <Text style={styles.emojiMobile}>✨</Text>
            </NeuView>
            <Text style={styles.title}>EchoSpace</Text>
            <Text style={styles.tagline}>Send echoes that resonate.</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}>
            <NeuView radius={BorderRadius.md} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </NeuView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.8}>
            <NeuView inset radius={BorderRadius.md} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </NeuView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  visualPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  artCircle: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  artCircleMobile: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  visualTitle: { ...Typography.h1, fontSize: 48, color: Colors.text, marginBottom: Spacing.sm },
  visualTagline: { ...Typography.body, color: Colors.textMuted, fontSize: 18, textAlign: 'center', maxWidth: 400 },
  formContainer: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  formContainerDesktop: { maxWidth: 500, alignSelf: 'center' },
  mobileHeader: { alignItems: 'center', marginBottom: 80 },
  emoji: { fontSize: 64 },
  emojiMobile: { fontSize: 48 },
  title: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
  tagline: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
  buttonContainer: { width: '100%', gap: Spacing.xl },
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { paddingVertical: Spacing.lg, alignItems: 'center' },
  secondaryButtonText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
});