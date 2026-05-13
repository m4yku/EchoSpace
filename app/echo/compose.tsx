import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';

export default function ComposeEchoScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.webContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <NeuView radius={20} style={{ padding: 8 }}><Ionicons name="close" size={24} color={Colors.text} /></NeuView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Echo</Text>
          <TouchableOpacity onPress={() => router.back()} disabled={!message.trim()}>
             <NeuView radius={BorderRadius.round} style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]}>
               <Text style={styles.sendText}>Send</Text>
             </NeuView>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <NeuView inset radius={BorderRadius.md} style={styles.inputArea}>
            <TextInput style={styles.input} placeholder="What's resonating?" placeholderTextColor={Colors.textMuted} multiline autoFocus value={message} onChangeText={setMessage} />
          </NeuView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  webContainer: { flex: 1, width: '100%', maxWidth: 768, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  headerTitle: { ...Typography.body, color: Colors.text, fontWeight: 'bold' },
  sendBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  sendText: { color: '#FFF', fontWeight: 'bold' },
  content: { flex: 1, padding: Spacing.md },
  inputArea: { flex: 1, padding: Spacing.md },
  input: { flex: 1, color: Colors.text, fontSize: 20, textAlignVertical: 'top' },
});