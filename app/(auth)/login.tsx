// m4yku/echospace/EchoSpace/app/(auth)/login.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, ScrollView, Animated, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isDark = useColorScheme() === 'dark';
  const Colors = isDark ? DarkColors : LightColors;
  
  const styles = useMemo(() => getStyles(Colors, isDark), [isDark, Colors]);
  const { signIn, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const panelFadeAnim = useRef(new Animated.Value(0)).current;
  const slideXAnim = useRef(new Animated.Value(50)).current;
  const slideYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideXAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(slideYAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields.');
    setError('');
    try {
      await signIn(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <View style={styles.root}>
      {isDesktop && (
        <Animated.View style={[styles.leftPanel, { opacity: panelFadeAnim, transform: [{ translateX: slideXAnim.interpolate({ inputRange: [0, 50], outputRange: [0, -50] }) }] }]}>
          <Text style={styles.visualTitle}>Welcome Back</Text>
          <Text style={styles.visualSubtitle}>Reconnect with your space.</Text>
        </Animated.View>
      )}

      <Animated.View style={[styles.rightPanel, { opacity: panelFadeAnim, transform: isDesktop ? [{ translateX: slideXAnim }] : [{ translateY: slideYAnim }] }]}>
        <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={isDesktop ? styles.desktopTitle : styles.mobileTitle}>Sign In</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </NeuView>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
            </NeuView>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading} activeOpacity={0.8} style={{ marginTop: Spacing.md }}>
              <View style={[styles.button, { backgroundColor: Colors.primary }]}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Login</Text>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={{ marginTop: Spacing.xl }}>
              <Text style={{ color: Colors.textMuted, textAlign: 'center' }}>Don't have an account? <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Sign Up</Text></Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const getStyles = (Theme: any, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Theme.background },
  leftPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: isDark ? '#15181C' : '#D6DCE4' },
  visualTitle: { ...Typography.h1, color: Theme.text, fontSize: 40 },
  visualSubtitle: { color: Theme.textMuted, fontSize: 18, marginTop: 8 },
  rightPanel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formContainer: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl, width: '100%', maxWidth: 480 },
  mobileTitle: { ...Typography.h1, color: Theme.text, marginBottom: Spacing.xl, textAlign: 'center' },
  desktopTitle: { ...Typography.h1, color: Theme.text, marginBottom: Spacing.xxl, textAlign: 'center' },
  inputWrapper: { marginBottom: Spacing.lg, padding: 2 },
  input: { padding: Spacing.md, fontSize: 16, color: Theme.text },
  button: { padding: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.md },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: Theme.error, marginBottom: Spacing.md, textAlign: 'center' },
});