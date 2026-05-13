import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { signUp, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.confirm) return setError('All fields required.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    try { await signUp(form.email, form.password, form.username); } 
    catch (err: any) { setError(err.message || 'Registration failed.'); }
  };

  const renderMobileWizard = () => (
    <SafeAreaView style={styles.mobileContainer}>
      <View style={styles.progressRow}>
        <NeuView radius={BorderRadius.round} inset={step < 1} style={[styles.progressDot, step >= 1 && { backgroundColor: Colors.primary }]} />
        <NeuView inset style={styles.progressLine} />
        <NeuView radius={BorderRadius.round} inset={step < 2} style={[styles.progressDot, step >= 2 && { backgroundColor: Colors.primary }]} />
      </View>

      <View style={styles.stepContent}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Let's start</Text>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={form.email} onChangeText={(v) => updateForm('email', v)} autoCapitalize="none" />
            </NeuView>
            <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Username" placeholderTextColor={Colors.textMuted} value={form.username} onChangeText={(v) => updateForm('username', v)} autoCapitalize="none" />
            </NeuView>
            <TouchableOpacity onPress={() => (form.email && form.username) ? setStep(2) : setError('Required')} activeOpacity={0.8}>
              <NeuView radius={BorderRadius.md} style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Next</Text></NeuView>
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
              <TextInput style={styles.input} placeholder="Confirm" placeholderTextColor={Colors.textMuted} value={form.confirm} onChangeText={(v) => updateForm('confirm', v)} secureTextEntry />
            </NeuView>
            <View style={styles.rowButtons}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setStep(1)}><NeuView radius={BorderRadius.md} style={styles.backBtn}><Text style={styles.backBtnText}>Back</Text></NeuView></TouchableOpacity>
              <TouchableOpacity style={{ flex: 2 }} onPress={handleRegister} disabled={isLoading}><NeuView radius={BorderRadius.md} style={styles.primaryBtn}>{isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Join</Text>}</NeuView></TouchableOpacity>
            </View>
          </View>
        )}
        {step === 1 && <TouchableOpacity onPress={() => router.back()} style={styles.footerLink}><Text style={styles.linkText}>Login instead</Text></TouchableOpacity>}
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.root}>
      {isDesktop && <View style={styles.visualPanel}><Text style={styles.visualTitle}>Join Space</Text></View>}
      <SafeAreaView style={[styles.formArea, isDesktop && styles.formAreaDesktop]}>
        {isDesktop ? (
           <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
             <Text style={styles.stepTitle}>Create Account</Text>
             {error ? <Text style={styles.errorText}>{error}</Text> : null}
             {/* Render all inputs for web */}
             <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textMuted} value={form.email} onChangeText={(v) => updateForm('email', v)} /></NeuView>
             <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Username" placeholderTextColor={Colors.textMuted} value={form.username} onChangeText={(v) => updateForm('username', v)} /></NeuView>
             <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textMuted} value={form.password} onChangeText={(v) => updateForm('password', v)} secureTextEntry/></NeuView>
             <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Confirm" placeholderTextColor={Colors.textMuted} value={form.confirm} onChangeText={(v) => updateForm('confirm', v)} secureTextEntry/></NeuView>
             <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}><NeuView radius={BorderRadius.md} style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Create Account</Text></NeuView></TouchableOpacity>
             <TouchableOpacity onPress={() => router.back()} style={styles.footerLink}><Text style={styles.linkText}>Login instead</Text></TouchableOpacity>
           </ScrollView>
        ) : renderMobileWizard()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  visualPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#15181C' },
  visualTitle: { ...Typography.h1, color: Colors.text, fontSize: 40 },
  formArea: { flex: 1 },
  formAreaDesktop: { maxWidth: 500, alignSelf: 'center', width: '100%', justifyContent: 'center' },
  mobileContainer: { flex: 1, padding: Spacing.xl },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.xxl },
  progressDot: { width: 16, height: 16, borderRadius: 8 },
  progressLine: { height: 4, width: 60, marginHorizontal: Spacing.md },
  stepContent: { flex: 1, justifyContent: 'center' },
  stepTitle: { ...Typography.h1, marginBottom: Spacing.xl, textAlign: 'center' },
  inputWrapper: { marginBottom: Spacing.lg, padding: 2 },
  input: { padding: Spacing.md, fontSize: 16, color: Colors.text },
  errorText: { color: Colors.error, marginBottom: Spacing.md, textAlign: 'center' },
  primaryBtn: { backgroundColor: Colors.primary, padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.md },
  primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  rowButtons: { flexDirection: 'row', gap: Spacing.lg },
  backBtn: { padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.md },
  backBtnText: { color: Colors.textMuted, fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: Spacing.xl, alignItems: 'center' },
  linkText: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
});