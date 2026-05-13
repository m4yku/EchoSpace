import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  useWindowDimensions, ActivityIndicator, Animated,
  useColorScheme, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

const nd = Platform.OS !== 'web';

// Reusable press-animated button — fixes the animation conflict bug
function PressableNeu({ onPress, disabled = false, style, children }: {
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: nd, speed: 60, bounciness: 0 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: nd, speed: 30, bounciness: 5 }).start();
  return (
    <Pressable onPress={onPress} disabled={disabled} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, disabled && { opacity: 0.55 }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Step indicator
function StepIndicator({ step, total, color }: { step: number; total: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl }}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i < step;
        const current = i === step - 1;
        return (
          <React.Fragment key={i}>
            <View style={{
              width: current ? 24 : 10, height: 10,
              borderRadius: 5,
              backgroundColor: active ? color : 'transparent',
              borderWidth: active ? 0 : 1.5,
              borderColor: color + '55',
              // transition handled by width change
            }} />
            {i < total - 1 && (
              <View style={{ width: 24, height: 2, backgroundColor: active ? color + '60' : color + '20', marginHorizontal: 4 }} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const isDark = useColorScheme() === 'dark';
  const Colors = (isDark ? DarkColors : LightColors) || DarkColors;
  const styles = useMemo(() => getStyles(Colors, isDark), [isDark, Colors]);

  const { signUp, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Entry animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const leftSlide = useRef(new Animated.Value(-32)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Step transition
  const stepFade = useRef(new Animated.Value(1)).current;
  const stepSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: nd }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: nd, speed: 16, bounciness: 3 }),
      Animated.spring(leftSlide, { toValue: 0, useNativeDriver: nd, speed: 12, bounciness: 2 }),
    ]).start();

    if (isDesktop) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -12, duration: 2800, useNativeDriver: nd }),
          Animated.timing(floatAnim, { toValue: 0, duration: 2800, useNativeDriver: nd }),
        ])
      ).start();
    }
  }, []);

  // Animate step change
  const animateStepChange = useCallback((newStep: number) => {
    const dir = newStep > step ? 1 : -1;
    Animated.parallel([
      Animated.timing(stepFade, { toValue: 0, duration: 150, useNativeDriver: nd }),
      Animated.timing(stepSlide, { toValue: dir * 20, duration: 150, useNativeDriver: nd }),
    ]).start(() => {
      setStep(newStep);
      setError('');
      stepSlide.setValue(-dir * 20);
      Animated.parallel([
        Animated.timing(stepFade, { toValue: 1, duration: 220, useNativeDriver: nd }),
        Animated.spring(stepSlide, { toValue: 0, useNativeDriver: nd, speed: 20, bounciness: 2 }),
      ]).start();
    });
  }, [step]);

  const goNext = () => {
    if (!form.email || !form.username) return setError('Both fields are required.');
    setError('');
    animateStepChange(2);
  };

  const goBack = () => animateStepChange(1);

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleRegister = useCallback(async () => {
    if (!form.username || !form.email || !form.password || !form.confirm) return setError('All fields required.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    try {
      await signUp(form.email, form.password, form.username);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  }, [form]);

  const focusProps = (name: string) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
  });

  const inputStyle = (name: string) => [
    styles.inputWrapper,
    focusedField === name && { borderColor: Colors.primary, borderWidth: 1.5 },
  ];

  // ── MOBILE WIZARD ──────────────────────────────────────────────────────────
  const mobileWizard = (
    <SafeAreaView style={styles.mobileRoot}>
      {/* Header */}
      <View style={styles.mobileHeader}>
        <Text style={styles.mobileTitle}>
          {step === 1 ? 'Create Account' : 'Secure it'}
        </Text>
        <Text style={styles.mobileSubtitle}>
          {step === 1 ? 'Start your journey.' : 'Choose a strong password.'}
        </Text>
      </View>

      <StepIndicator step={step} total={2} color={Colors.primary} />

      <Animated.View style={{ opacity: stepFade, transform: [{ translateY: stepSlide }] }}>
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {step === 1 && (
          <>
            <Text style={styles.label}>Email</Text>
            <NeuView inset radius={BorderRadius.md} style={inputStyle('email')}>
              <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={Colors.textMuted}
                value={form.email} onChangeText={v => updateForm('email', v)}
                autoCapitalize="none" keyboardType="email-address" {...focusProps('email')} />
            </NeuView>

            <Text style={styles.label}>Username</Text>
            <NeuView inset radius={BorderRadius.md} style={inputStyle('username')}>
              <TextInput style={styles.input} placeholder="yourhandle" placeholderTextColor={Colors.textMuted}
                value={form.username} onChangeText={v => updateForm('username', v)}
                autoCapitalize="none" {...focusProps('username')} />
            </NeuView>

            <PressableNeu onPress={goNext} style={[styles.primaryBtn, { backgroundColor: Colors.primary, marginTop: Spacing.sm }]}>
              <Text style={styles.primaryBtnText}>Continue →</Text>
            </PressableNeu>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.label}>Password</Text>
            <NeuView inset radius={BorderRadius.md} style={inputStyle('password')}>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted}
                value={form.password} onChangeText={v => updateForm('password', v)}
                secureTextEntry {...focusProps('password')} />
            </NeuView>

            <Text style={styles.label}>Confirm Password</Text>
            <NeuView inset radius={BorderRadius.md} style={inputStyle('confirm')}>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted}
                value={form.confirm} onChangeText={v => updateForm('confirm', v)}
                secureTextEntry {...focusProps('confirm')} />
            </NeuView>

            <View style={styles.rowBtns}>
              <PressableNeu onPress={goBack} style={[styles.ghostBtn, { flex: 1 }]}>
                <Text style={[styles.ghostBtnText, { color: Colors.text }]}>← Back</Text>
              </PressableNeu>
              <PressableNeu onPress={handleRegister} disabled={isLoading} style={[styles.primaryBtn, { flex: 2, backgroundColor: Colors.primary }]}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Join EchoSpace</Text>}
              </PressableNeu>
            </View>
          </>
        )}
      </Animated.View>

      {/* Footer link — OUTSIDE of stepFade animated view to prevent animation bug */}
      <View style={styles.footerRow}>
        <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Already have an account? </Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  // ── DESKTOP FORM ───────────────────────────────────────────────────────────
  const desktopForm = (
    <ScrollView contentContainerStyle={styles.desktopFormScroll}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={styles.desktopTitle}>Create Account</Text>
      <Text style={styles.desktopSubtitle}>Join your emotional universe.</Text>

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>Email</Text>
      <NeuView inset radius={BorderRadius.md} style={inputStyle('email')}>
        <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={Colors.textMuted}
          value={form.email} onChangeText={v => updateForm('email', v)}
          autoCapitalize="none" keyboardType="email-address" {...focusProps('email')} />
      </NeuView>

      <Text style={styles.label}>Username</Text>
      <NeuView inset radius={BorderRadius.md} style={inputStyle('username')}>
        <TextInput style={styles.input} placeholder="yourhandle" placeholderTextColor={Colors.textMuted}
          value={form.username} onChangeText={v => updateForm('username', v)}
          autoCapitalize="none" {...focusProps('username')} />
      </NeuView>

      <Text style={styles.label}>Password</Text>
      <NeuView inset radius={BorderRadius.md} style={inputStyle('password')}>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted}
          value={form.password} onChangeText={v => updateForm('password', v)}
          secureTextEntry {...focusProps('password')} />
      </NeuView>

      <Text style={styles.label}>Confirm Password</Text>
      <NeuView inset radius={BorderRadius.md} style={inputStyle('confirm')}>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted}
          value={form.confirm} onChangeText={v => updateForm('confirm', v)}
          secureTextEntry {...focusProps('confirm')} />
      </NeuView>

      <PressableNeu onPress={handleRegister} disabled={isLoading}
        style={[styles.primaryBtn, { backgroundColor: Colors.primary, marginTop: Spacing.sm }]}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
      </PressableNeu>

      {/* Footer link — standalone, not inside any animated wrapper */}
      <View style={[styles.footerRow, { marginTop: Spacing.xl }]}>
        <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Already have an account? </Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  // ── ROOT ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Desktop left panel */}
      {isDesktop && (
        <Animated.View style={[styles.leftPanel, { opacity: fadeAnim, transform: [{ translateX: leftSlide }] }]}>
          <View style={styles.leftInner}>
            <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
              <NeuView radius={BorderRadius.xl * 2} style={styles.artOuter}>
                <NeuView inset radius={BorderRadius.xl * 1.5} style={styles.artInner}>
                  <NeuView radius={BorderRadius.round} style={styles.artCore}>
                    <Text style={{ fontSize: 44 }}>✨</Text>
                  </NeuView>
                </NeuView>
              </NeuView>
            </Animated.View>
            <Text style={styles.brandName}>Join Space</Text>
            <Text style={styles.brandTagline}>{'A tactile environment\nfor emotional resonance.'}</Text>
            <View style={styles.dotRow}>
              {[0.9, 0.45, 0.2].map((o, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: Colors.primary, opacity: o }]} />
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Right panel */}
      {isDesktop ? (
        <Animated.View style={[styles.rightPanel, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <SafeAreaView style={{ flex: 1, width: '100%' }}>
            {desktopForm}
          </SafeAreaView>
        </Animated.View>
      ) : (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {mobileWizard}
        </Animated.View>
      )}
    </View>
  );
}

const getStyles = (Theme: any, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Theme?.background },

  // Left panel
  leftPanel: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: isDark ? '#151920' : '#D4DBE6',
    borderRightWidth: 1, borderRightColor: isDark ? '#1F2428' : '#C8D0DC',
  },
  leftInner: { alignItems: 'center', paddingHorizontal: Spacing.xxl },
  artOuter: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  artInner: { width: 148, height: 148, justifyContent: 'center', alignItems: 'center' },
  artCore: { width: 90, height: 90, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme?.background },
  brandName: { ...Typography.h1, color: Theme?.text, fontSize: 36, textAlign: 'center', marginBottom: Spacing.sm },
  brandTagline: { color: Theme?.textMuted, fontSize: 17, textAlign: 'center', lineHeight: 28 },
  dotRow: { flexDirection: 'row', gap: 8, marginTop: Spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4 },

  // Right panel
  rightPanel: { flex: 1 },
  desktopFormScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl, maxWidth: 440, alignSelf: 'center', width: '100%' },
  desktopTitle: { ...Typography.h1, color: Theme?.text, marginBottom: Spacing.sm },
  desktopSubtitle: { color: Theme?.textMuted, fontSize: 15, marginBottom: Spacing.xl },

  // Mobile
  mobileRoot: { flex: 1, padding: Spacing.xl, backgroundColor: Theme?.background },
  mobileHeader: { marginBottom: Spacing.lg },
  mobileTitle: { ...Typography.h1, color: Theme?.text, textAlign: 'center', marginBottom: Spacing.sm },
  mobileSubtitle: { color: Theme?.textMuted, fontSize: 15, textAlign: 'center' },

  // Shared form
  label: {
    color: Theme?.textMuted, fontSize: 12, fontWeight: '700',
    letterSpacing: 0.8, marginBottom: 6, marginLeft: 2,
    textTransform: 'uppercase',
  },
  inputWrapper: { marginBottom: Spacing.lg },
  input: { padding: Spacing.md, fontSize: 16, color: Theme?.text },

  errorBox: {
    backgroundColor: isDark ? 'rgba(255,107,107,0.1)' : 'rgba(255,107,107,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  errorText: { color: Theme?.error, textAlign: 'center', fontSize: 14 },

  primaryBtn: { padding: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.md },
  primaryBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },

  rowBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  ghostBtn: {
    padding: Spacing.lg, alignItems: 'center',
    borderRadius: BorderRadius.md, borderWidth: 1.5,
    borderColor: isDark ? '#2A2E35' : '#C8D0DC',
    backgroundColor: isDark ? '#1C2026' : '#D8DFE9',
  },
  ghostBtnText: { fontSize: 16, fontWeight: '600' },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xl },
  footerLink: { fontSize: 14, fontWeight: '700' },
});