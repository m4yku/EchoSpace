import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/src/constants/designTokens';
import { NeuView } from '@/src/components/ui/NeuView';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.webContainer}>
        <NeuView inset style={styles.card}>
           <Text style={styles.title}>Profile</Text>
        </NeuView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  webContainer: { flex: 1, width: '100%', maxWidth: 768, alignSelf: 'center', padding: Spacing.lg, justifyContent: 'center' },
  card: { padding: Spacing.xl, alignItems: 'center', borderRadius: 24 },
  title: { ...Typography.h2, color: Colors.text }
});