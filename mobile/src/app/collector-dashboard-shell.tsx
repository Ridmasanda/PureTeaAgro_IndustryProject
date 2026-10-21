import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export type CollectorTab =
  | 'Home'
  | 'Farmers'
  | 'Collections'
  | 'Profile';
type CollectorRoute = '/collector-home' | '/collector-farmers' | '/collector-collection-history' | '/collector-profile';

export default function CollectorDashboardShellRoute() {
  return <Redirect href="/collector-home" />;
}

const tabs: { label: CollectorTab; icon: 'home' | 'account-group-outline' | 'clipboard-text-outline' | 'account-outline'; route: CollectorRoute }[] = [
  { label: 'Home', icon: 'home', route: '/collector-home' },
  { label: 'Farmers', icon: 'account-group-outline', route: '/collector-farmers' },
  { label: 'Collections', icon: 'clipboard-text-outline', route: '/collector-collection-history' },
  { label: 'Profile', icon: 'account-outline', route: '/collector-profile' },
];

export function CollectorDashboardShell({
  activeTab,
  scrollable = true,
  children,
}: {
  activeTab: CollectorTab;
  scrollable?: boolean;
  children: ReactNode;
}) {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const selected = activeTab === tab.label;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={tab.label}
                onPress={() => router.replace(tab.route)}
                style={styles.tabButton}>
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={21}
                  color={selected ? '#176B32' : '#7D8C82'}
                />
                <ThemedText type="small" style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                  {tab.label}
                </ThemedText>
                {selected && <View style={styles.activeTabMark} />}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(246,253,245,0.72)',
  },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 10 },
  bottomNav: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: '#E2EEE3',
    paddingHorizontal: 8,
    paddingBottom: 3,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 51,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: { color: '#839087', fontSize: 10, lineHeight: 14, marginTop: 3 },
  tabLabelSelected: { color: '#176B32', fontWeight: '700' },
  activeTabMark: {
    position: 'absolute',
    bottom: -6,
    height: 2,
    width: 30,
    borderRadius: 2,
    backgroundColor: '#176B32',
  },
});
