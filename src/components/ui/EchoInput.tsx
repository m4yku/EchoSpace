// src/components/ui/EchoInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { LightColors, DarkColors, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from './NeuView';

interface EchoInputProps extends TextInputProps {
  label: string;
  isDark: boolean;
  error?: string;
}

export function EchoInput({ label, isDark, error, value, ...props }: EchoInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const Colors = isDark ? DarkColors : LightColors;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: Colors.textMuted }]}>{label}</Text>
      <NeuView 
        inset 
        radius={BorderRadius.md}
        style={[
          styles.inputWrapper,
          isFocused && { borderColor: Colors.primary, borderWidth: 1.5 },
          !!error && { borderColor: Colors.error, borderWidth: 1.5 }
        ]}
      >
        <TextInput
          {...props}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, { color: Colors.text }]}
        />
      </NeuView>
      {!!error && <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: {
    fontSize: 12, fontWeight: '700', letterSpacing: 0.8,
    marginBottom: 6, marginLeft: 2, textTransform: 'uppercase',
  },
  inputWrapper: { height: 54, justifyContent: 'center' },
  input: { padding: Spacing.md, fontSize: 16 },
  errorText: { fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '600' }
});