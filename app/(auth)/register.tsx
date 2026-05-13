import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, ActivityIndicator, Animated, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; 
  
  // --- BULLETPROOF THEME LOGIC ---
  const isDark = useColorScheme() === 'dark';
  const Colors = (isDark ? DarkColors : LightColors) || DarkColors;
  const styles = useMemo(() => getStyles(Colors, isDark), [isDark, Colors]);
  
  const { signUp, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const panelFadeAnim = useRef(new Animated.Value(0)).current;
  const slideXAnim = useRef(new Animated.Value(50)).current; 
  const slideYAnim = useRef(new Animated.Value(30)).current; 
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  const stepFadeAnim = useRef(new Animated.Value(0)).current;
  const stepSlideAnim = useRef(new Animated.Value(20)).current;

  const leftPanelSlide = slideXAnim.interpolate({ inputRange: [0, 50], outputRange: [0, -50] });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideXAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(slideYAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  useEffect(() => {
    stepFadeAnim.setValue(0);
    stepSlideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(stepFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(stepSlideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
    ]).start();
  }, [step, isDesktop]);

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.confirm) return setError('All fields required.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    try { 
      await signUp(form.email, form.password, form.username); 
      router.replace('/(tabs)/home');
    } catch (err: any) { setError(err.message || 'Registration failed.'); }
  };

  const renderMobileWizard = () => (
    <SafeAreaView style={styles.mobileContainer}>
      <View style={styles.progressRow}>
        <NeuView radius={BorderRadius.round} inset={step < 1} style={[styles.progressDot, step >= 1 && { backgroundColor: Colors.primary }]} />
        <NeuView inset style={styles.progressLine} />
        <NeuView radius={BorderRadius.round} inset={step < 2} style={[styles.progressDot, step >= 2 && { backgroundColor: Colors.primary }]} />
      </View>

      <Animated.View style={[styles.stepContent, { opacity: stepFadeAnim, transform: [{ translateY: stepSlideAnim }] }]}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Let's start</Text>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={form.email} onChangeText={(v) => updateForm('email', v)} autoCapitalize="none" keyboardType="email-address" />
            </NeuView>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Username" placeholderTextColor={Colors.textMuted} value={form.username} onChangeText={(v) => updateForm('username', v)} autoCapitalize="none" />
            </NeuView>
            
            <TouchableOpacity onPress={() => (form.email && form.username) ? setStep(2) : setError('Required')} activeOpacity={0.8} style={{ marginTop: Spacing.md }}>
              <View style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Secure it</Text>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textMuted} value={form.password} onChangeText={(v) => updateForm('password', v)} secureTextEntry />
            </NeuView>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={Colors.textMuted} value={form.confirm} onChangeText={(v) => updateForm('confirm', v)} secureTextEntry />
            </NeuView>
            <View style={styles.rowButtons}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setStep(1)} activeOpacity={0.7}>
                <View style={styles.backBtn}><Text style={styles.backBtnText}>Back</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 2 }} onPress={handleRegister} disabled={isLoading} activeOpacity={0.8}>
                <View style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}>
                  {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Join EchoSpace</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {step === 1 && (
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.footerLink}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );

  const renderWebForm = () => (
    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Animated.View style={{ opacity: stepFadeAnim, transform: [{ translateY: stepSlideAnim }] }}>
        <Text style={styles.desktopTitle}>Create Account</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={form.email} onChangeText={(v) => updateForm('email', v)} autoCapitalize="none" keyboardType="email-address" />
        </NeuView>
        <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Username" placeholderTextColor={Colors.textMuted} value={form.username} onChangeText={(v) => updateForm('username', v)} autoCapitalize="none" />
        </NeuView>
        <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textMuted} value={form.password} onChangeText={(v) => updateForm('password', v)} secureTextEntry/>
        </NeuView>
        <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={Colors.textMuted} value={form.confirm} onChangeText={(v) => updateForm('confirm', v)} secureTextEntry/>
        </NeuView>
        
        <TouchableOpacity onPress={handleRegister} disabled={isLoading} activeOpacity={0.8} style={{ marginTop: Spacing.md }}>
          <View style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.footerLink}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      {isDesktop && (
        <Animated.View style={[styles.leftPanel, { opacity: panelFadeAnim, transform: [{ translateX: leftPanelSlide }] }]}>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <NeuView radius={BorderRadius.xl * 2} style={styles.artOuter}>
              <NeuView inset radius={BorderRadius.xl * 1.5} style={styles.artInner}>
                <NeuView radius={BorderRadius.round} style={styles.artCore}>
                  <Text style={{ fontSize: 48 }}>✨</Text>
                </NeuView>
              </NeuView>
            </NeuView>
          </Animated.View>
          <Text style={styles.visualTitle}>Join Space</Text>
          <Text style={styles.visualTagline}>A tactile environment for emotional resonance.</Text>
        </Animated.View>
      )}

      {isDesktop ? (
        <Animated.View style={[styles.rightPanel, { opacity: panelFadeAnim, transform: [{ translateX: slideXAnim }] }]}>
          <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            {renderWebForm()}
          </SafeAreaView>
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: panelFadeAnim, transform: [{ translateY: slideYAnim }] }}>
           {renderMobileWizard()}
        </Animated.View>
      )}
    </View>
  );
}

// Fixed boolean parameter 'isDark'
const getStyles = (Theme: any, isDark: boolean) => StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Theme?.background, width: '100%', height: '100%' },
  leftPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: isDark ? '#15181C' : '#D6DCE4', padding: Spacing.xl },
  artOuter: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xxl },
  artInner: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  artCore: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme?.background },
  visualTitle: { ...Typography.h1, color: Theme?.text, fontSize: 40, marginBottom: Spacing.sm, textAlign: 'center' },
  visualTagline: { ...Typography.body, color: Theme?.textMuted, fontSize: 18, textAlign: 'center', maxWidth: 350 },
  rightPanel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formContainer: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl, width: '100%', minWidth: 320, maxWidth: 480 },
  desktopTitle: { ...Typography.h1, marginBottom: Spacing.xxl, textAlign: 'center', color: Theme?.text },
  mobileContainer: { flex: 1, width: '100%', padding: Spacing.xl, backgroundColor: Theme?.background },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xxl },
  progressDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: isDark ? '#15181C' : '#D6DCE4' },
  progressLine: { height: 4, width: 80, marginHorizontal: Spacing.md },
  stepContent: { flex: 1, justifyContent: 'center', paddingBottom: Spacing.xxl },
  stepTitle: { ...Typography.h1, marginBottom: Spacing.xl, textAlign: 'center', color: Theme?.text },
  inputWrapper: { marginBottom: Spacing.lg, padding: 2 },
  input: { padding: Spacing.md, fontSize: 16, color: Theme?.text },
  errorText: { color: Theme?.error, marginBottom: Spacing.md, textAlign: 'center', fontWeight: 'bold' },
  primaryBtn: { backgroundColor: Theme?.primary, padding: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.md, shadowColor: Theme?.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  rowButtons: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  backBtn: { padding: Spacing.lg, alignItems: 'center', backgroundColor: Theme?.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: isDark ? '#2A2E35' : '#C0C9D6' },
  backBtnText: { color: Theme?.textMuted, fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: Spacing.xl, alignItems: 'center' },
  linkText: { color: Theme?.primary, fontSize: 16, fontWeight: 'bold' },
});