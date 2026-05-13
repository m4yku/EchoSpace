import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/src/constants/designTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- MOBILE: PILL-SHAPED FLOATING TAB BAR ---
function MobileFloatingTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.mobileTabBar, { bottom: Math.max(insets.bottom + 10, Spacing.lg) }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCompose = route.name === 'compose_placeholder';

        const onPress = () => {
          if (isCompose) router.push('/echo/compose');
          else navigation.navigate(route.name);
        };

        if (isCompose) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.mobileComposeBtn} activeOpacity={0.8}>
              <Ionicons name="add" size={32} color={Colors.background} />
            </TouchableOpacity>
          );
        }

        let iconName = '';
        if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
        if (route.name === 'echoes') iconName = isFocused ? 'chatbubble' : 'chatbubble-outline';
        if (route.name === 'spaces') iconName = isFocused ? 'grid' : 'grid-outline';
        if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

        const label = route.name.charAt(0).toUpperCase() + route.name.slice(1);

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.mobileTabItem}>
            <Ionicons name={iconName as any} size={24} color={isFocused ? Colors.primary : Colors.textMuted} />
            <Text style={[styles.mobileTabLabel, { color: isFocused ? Colors.primary : Colors.textMuted }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// --- WEB: VERTICAL SIDEBAR ---
function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: 'home', label: 'Home Feed', icon: 'home', iconOutline: 'home-outline', path: '/(tabs)/home' },
    { name: 'echoes', label: 'My Echoes', icon: 'chatbubble', iconOutline: 'chatbubble-outline', path: '/(tabs)/echoes' },
    { name: 'spaces', label: 'Spaces', icon: 'grid', iconOutline: 'grid-outline', path: '/(tabs)/spaces' },
  ];

  return (
    <View style={styles.desktopSidebar}>
      <View>
        <Text style={styles.sidebarLogo}>✨ EchoSpace</Text>
        <View style={styles.sidebarLinks}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.path);
            return (
              <TouchableOpacity key={item.name} style={[styles.sidebarItem, isActive && styles.sidebarItemActive]} onPress={() => router.push(item.path as any)}>
                <Ionicons name={(isActive ? item.icon : item.iconOutline) as any} size={24} color={isActive ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.sidebarItemLabel, isActive && styles.sidebarItemLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.sidebarComposeBtn} onPress={() => router.push('/echo/compose')}>
          <Ionicons name="add-circle" size={24} color={Colors.background} />
          <Text style={styles.sidebarComposeText}>Send Echo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sidebarProfile} onPress={() => router.push('/(tabs)/profile')}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>J</Text></View>
        <Text style={styles.profileName}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- MAIN EXPORT ---
export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; 

  return (
    <View style={styles.layoutRoot}>
      {isDesktop && <DesktopSidebar />}
      <View style={styles.mainContent}>
        <Tabs tabBar={(props) => (isDesktop ? null : <MobileFloatingTabBar {...props} />)} screenOptions={{ headerShown: false }}>
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

const styles = StyleSheet.create({
  layoutRoot: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  mainContent: { flex: 1, backgroundColor: Colors.background },

  // Mobile Pill Styles
  mobileTabBar: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10, borderWidth: 1, borderColor: Colors.surface + '80' },
  mobileTabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  mobileTabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  mobileComposeBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: -28, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8, marginHorizontal: Spacing.sm },

  // Desktop Sidebar Styles
  desktopSidebar: { width: 280, height: '100%', backgroundColor: Colors.surface, borderRightWidth: 1, borderRightColor: Colors.background, padding: Spacing.xl, justifyContent: 'space-between' },
  sidebarLogo: { ...Typography.h1, color: Colors.text, fontSize: 28, marginBottom: 40 },
  sidebarLinks: { gap: Spacing.sm, marginBottom: 40 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, gap: Spacing.md },
  sidebarItemActive: { backgroundColor: Colors.primary + '20' },
  sidebarItemLabel: { color: Colors.textMuted, fontSize: 18, fontWeight: '600' },
  sidebarItemLabelActive: { color: Colors.primary, fontWeight: 'bold' },
  sidebarComposeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm },
  sidebarComposeText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' },
  sidebarProfile: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.background, borderRadius: BorderRadius.md, gap: Spacing.md },
  profileAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  profileAvatarText: { color: Colors.background, fontWeight: 'bold', fontSize: 18 },
  profileName: { color: Colors.text, fontSize: 16, fontWeight: '600' },
});