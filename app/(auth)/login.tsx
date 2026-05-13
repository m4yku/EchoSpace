import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  useWindowDimensions, ScrollView, Animated, useColorScheme,
  Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

const nd = Platform.OS !== 'web';

// Reusable press-animated button — fixes TouchableOpacity + Animated conflict
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const leftSlide = useRef(new Animated.Value(-32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: nd }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: nd, speed: 16, bounciness: 3 }),
      Animated.spring(leftSlide, { toValue: 0, useNativeDriver: nd, speed: 12, bounciness: 2 }),
    ]).start();
  }, []);

  const handleLogin = useCallback(async () => {
    if (!email || !password) return setError('Please fill in all fields.');
    setError('');
    try {
      await signIn(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  }, [email, password]);

  const form = (
    <>
      <Text style={isDesktop ? styles.title : styles.titleMobile}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome back to your space.</Text>

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>Email</Text>
      <NeuView inset radius={BorderRadius.md}
        style={[styles.inputWrapper, focusedField === 'email' && { borderColor: Colors.primary, borderWidth: 1.5 }]}>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={Colors.textMuted}
          value={email} onChangeText={setEmail}
          autoCapitalize="none" keyboardType="email-address"
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />
      </NeuView>

      <Text style={styles.label}>Password</Text>
      <NeuView inset radius={BorderRadius.md}
        style={[styles.inputWrapper, focusedField === 'password' && { borderColor: Colors.primary, borderWidth: 1.5 }]}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={Colors.textMuted}
          value={password} onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />
      </NeuView>

      <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotRow}>
        <Text style={[styles.forgotText, { color: Colors.primary }]}>Forgot password?</Text>
      </Pressable>

      <PressableNeu onPress={handleLogin} disabled={isLoading}
        style={[styles.primaryBtn, { backgroundColor: Colors.primary }]}>
        {isLoading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.primaryBtnText}>Sign In</Text>}
      </PressableNeu>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: isDark ? '#2A2E35' : '#C8D0DC' }]} />
        <Text style={[styles.dividerLabel, { color: Colors.textMuted }]}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: isDark ? '#2A2E35' : '#C8D0DC' }]} />
      </View>

      <PressableNeu onPress={() => router.push('/(auth)/register')} style={styles.ghostBtn}>
        <Text style={[styles.ghostBtnText, { color: Colors.text }]}>Create an account</Text>
      </PressableNeu>
    </>
  );

  return (
    <View style={styles.root}>
      {isDesktop && (
        <Animated.View style={[styles.leftPanel, { opacity: fadeAnim, transform: [{ translateX: leftSlide }] }]}>
          <View style={styles.leftInner}>
            <NeuView radius={28} style={styles.brandCircle}>
              <Text style={{ fontSize: 40 }}>✨</Text>
            </NeuView>
            <Text style={styles.brandName}>EchoSpace</Text>
            <Text style={styles.brandTagline}>{'Your emotional\nuniverse awaits.'}</Text>
            <View style={styles.dotRow}>
              {[0.9, 0.45, 0.2].map((o, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: Colors.primary, opacity: o }]} />
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.rightPanel, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.formScroll, isDesktop && styles.formScrollDesktop]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {form}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const getStyles = (Theme: any, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Theme.background },

  leftPanel: {
    flex: 1,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: isDark ? '#151920' : '#D4DBE6',
    borderRightWidth: 1,
    borderRightColor: isDark ? '#1F2428' : '#C8D0DC',
  },
  leftInner: { alignItems: 'center', paddingHorizontal: Spacing.xxl },
  brandCircle: { width: 96, height: 96, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  brandName: { ...Typography.h1, color: Theme.text, fontSize: 38, textAlign: 'center', marginBottom: Spacing.sm },
  brandTagline: { color: Theme.textMuted, fontSize: 18, textAlign: 'center', lineHeight: 28 },
  dotRow: { flexDirection: 'row', gap: 8, marginTop: Spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4 },

  rightPanel: { flex: 1 },
  formScroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  formScrollDesktop: { maxWidth: 420, alignSelf: 'center', width: '100%' },

  title: { ...Typography.h1, color: Theme.text, marginBottom: Spacing.sm },
  titleMobile: { ...Typography.h1, color: Theme.text, marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { color: Theme.textMuted, fontSize: 15, marginBottom: Spacing.xl, textAlign: 'center' },

  label: {
    color: Theme.textMuted, fontSize: 12, fontWeight: '700',
    letterSpacing: 0.8, marginBottom: 6, marginLeft: 2,
    textTransform: 'uppercase',
  },
  inputWrapper: { marginBottom: Spacing.lg },
  input: { padding: Spacing.md, fontSize: 16, color: Theme.text },

  forgotRow: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.xl },
  forgotText: { fontSize: 13, fontWeight: '600' },

  errorBox: {
    backgroundColor: isDark ? 'rgba(255,107,107,0.1)' : 'rgba(255,107,107,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  errorText: { color: Theme.error, textAlign: 'center', fontSize: 14 },

  primaryBtn: { padding: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.md },
  primaryBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerLabel: { fontSize: 13 },

  ghostBtn: {
    padding: Spacing.lg, alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: isDark ? '#2A2E35' : '#C8D0DC',
    backgroundColor: isDark ? '#1C2026' : '#D8DFE9',
  },
  ghostBtnText: { fontSize: 16, fontWeight: '600' },
});