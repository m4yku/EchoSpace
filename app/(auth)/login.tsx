import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';
import { useAuthStore } from '@/src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  
  const { signIn, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // 1. Basic Validation
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }
    
    setError('');
    
    try {
      // 2. Call Supabase Auth via Zustand
      await signIn(email, password);
      
      // 3. EXPLICIT REDIRECT (Ito ang madalas na missing link kapag parang hindi gumagana)
      router.replace('/(tabs)/home');
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={styles.root}>
      {/* WEB VISUAL PANEL */}
      {isDesktop && (
        <View style={styles.visualPanel}>
          <Text style={styles.visualTitle}>Welcome Back</Text>
          <Text style={{ color: Colors.textMuted, marginTop: 8 }}>Reconnect with your emotional space.</Text>
        </View>
      )}

      {/* FORM AREA */}
      <SafeAreaView style={[styles.formArea, isDesktop && styles.formAreaDesktop]}>
        {/* ScrollView with keyboardShouldPersistTaps ensures the button works even if keyboard is open */}
        <ScrollView 
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!isDesktop && <Text style={styles.mobileTitle}>Welcome Back</Text>}
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor={Colors.textMuted} 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none" 
              keyboardType="email-address"
              editable={!isLoading}
            />
          </NeuView>

          <NeuView inset radius={BorderRadius.md} style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor={Colors.textMuted} 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry 
              editable={!isLoading}
            />
          </NeuView>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} disabled={isLoading}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* LOGIN BUTTON */}
          <TouchableOpacity 
            onPress={handleLogin} 
            disabled={isLoading} 
            activeOpacity={0.8}
            style={{ marginBottom: Spacing.xl }}
          >
            <NeuView radius={BorderRadius.md} style={[styles.button, isLoading && { opacity: 0.7 }]}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </NeuView>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  visualPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#15181C' },
  visualTitle: { ...Typography.h1, color: Colors.text, fontSize: 40 },
  formArea: { flex: 1, justifyContent: 'center' },
  formAreaDesktop: { maxWidth: 480, alignSelf: 'center', width: '100%' },
  formContainer: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  mobileTitle: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.xl },
  inputWrapper: { marginBottom: Spacing.lg, padding: 2 },
  input: { padding: Spacing.md, fontSize: 16, color: Colors.text },
  errorText: { color: Colors.error, marginBottom: Spacing.md, textAlign: 'center', fontWeight: 'bold' },
  forgotPassword: { color: Colors.primary, textAlign: 'right', marginBottom: Spacing.xl },
  button: { backgroundColor: Colors.primary, padding: Spacing.lg, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: Colors.textMuted, fontSize: 16 },
  link: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' }
});