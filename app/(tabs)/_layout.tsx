import React, { useMemo } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NeuView } from '@/src/components/ui/NeuView';

// --- MOBILE: PILL-SHAPED FLOATING TAB BAR ---
function MobileFloatingTabBar({ state, descriptors, navigation, Colors }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <NeuView radius={999} style={[styles_static.mobileTabBar, { bottom: Math.max(insets.bottom + 10, Spacing.lg) }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCompose = route.name === 'compose_placeholder';
        const onPress = () => isCompose ? router.push('/echo/compose') : navigation.navigate(route.name);

        if (isCompose) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.8}>
              <NeuView radius={30} style={[styles_static.mobileComposeBtn, { backgroundColor: Colors.primary }]}>
                <Ionicons name="add" size={28} color="#FFF" />
              </NeuView>
            </TouchableOpacity>
          );
        }

        let iconName = '';
        if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
        if (route.name === 'echoes') iconName = isFocused ? 'chatbubble' : 'chatbubble-outline';
        if (route.name === 'spaces') iconName = isFocused ? 'grid' : 'grid-outline';
        if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles_static.mobileTabItem}>
            {isFocused ? (
              <NeuView inset radius={12} style={{ padding: 6 }}>
                 <Ionicons name={iconName as any} size={20} color={Colors.primary} />
              </NeuView>
            ) : (
              <View style={{ padding: 6 }}>
                <Ionicons name={iconName as any} size={20} color={Colors.textMuted} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </NeuView>
  );
}

// --- WEB: VERTICAL SIDEBAR ---
function DesktopSidebar({ Colors, isDark }: { Colors: any, isDark: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const styles = useMemo(() => getStyles(Colors, isDark), [Colors, isDark]);

  const NAV_ITEMS = [
    { name: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline', path: '/(tabs)/home' },
    { name: 'echoes', label: 'Echoes', icon: 'chatbubble', iconOutline: 'chatbubble-outline', path: '/(tabs)/echoes' },
    { name: 'spaces', label: 'Spaces', icon: 'grid', iconOutline: 'grid-outline', path: '/(tabs)/spaces' },
  ];

  return (
    <View style={styles.desktopSidebar}>
      <View>
        <Text style={[Typography.h1, { color: Colors.text, fontSize: 24, marginBottom: 40 }]}>✨ EchoSpace</Text>
        <View style={styles.sidebarLinks}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.path);
            return (
              <TouchableOpacity key={item.name} onPress={() => router.push(item.path as any)} style={{ marginBottom: Spacing.md }}>
                 {isActive ? (
                   <NeuView inset radius={BorderRadius.md} style={styles.sidebarItemActive}>
                     <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
                     <Text style={[styles.sidebarItemLabelActive, { color: Colors.primary }]}>{item.label}</Text>
                   </NeuView>
                 ) : (
                   <View style={styles.sidebarItem}>
                     <Ionicons name={item.iconOutline as any} size={24} color={Colors.textMuted} />
                     <Text style={[styles.sidebarItemLabel, { color: Colors.textMuted }]}>{item.label}</Text>
                   </View>
                 )}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity onPress={() => router.push('/echo/compose')} activeOpacity={0.8}>
          <NeuView radius={BorderRadius.md} style={[styles.sidebarComposeBtn, { backgroundColor: Colors.primary }]}>
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.sidebarComposeText}>Send Echo</Text>
          </NeuView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; 
  const isDark = useColorScheme() === 'dark';
  const Colors = isDark ? DarkColors : LightColors;

  const styles = useMemo(() => getStyles(Colors, isDark), [Colors, isDark]);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.background }}>
      {isDesktop && <DesktopSidebar Colors={Colors} isDark={isDark} />}
      <View style={{ flex: 1 }}>
        <Tabs 
          tabBar={(props) => (isDesktop ? null : <MobileFloatingTabBar {...props} Colors={Colors} />)} 
          screenOptions={{ 
            headerShown: false,
          }}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="echoes" />
          <Tabs.Screen name="compose_placeholder" />
          <Tabs.Screen name="spaces" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </View>
  );
}

// Dynamic styles function
const getStyles = (Colors: any, isDark: boolean) => StyleSheet.create({
  desktopSidebar: { 
    width: 260, 
    backgroundColor: Colors.surface, 
    borderRightWidth: 1, 
    borderRightColor: isDark ? '#15181C' : '#D6DCE4', 
    padding: Spacing.xl, 
    justifyContent: 'space-between' 
  },
  sidebarLinks: { marginBottom: 40 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  sidebarItemActive: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  sidebarItemLabel: { fontSize: 16, fontWeight: '600' },
  sidebarItemLabelActive: { fontSize: 16, fontWeight: 'bold' },
  sidebarComposeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, gap: Spacing.sm },
  sidebarComposeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

// Static styles for mobile tab bar logic
const styles_static = StyleSheet.create({
  mobileTabBar: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm },
  mobileTabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mobileComposeBtn: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: -20 },
});