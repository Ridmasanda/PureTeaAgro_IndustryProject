import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function BottomTab({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.bottomTab}>
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#087A4A' : '#A8B5BB'} />
      <ThemedText style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={16} color="#168C63" />
      <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
      <MaterialCommunityIcons name="chevron-right" size={17} color="#9AAAB0" />
    </Pressable>
  );
}

export default function FieldOfficerProfileScreen() {
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Light');

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView bounces={false} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={21} color="#176A4B" />
              </Pressable>
              <Image accessibilityLabel="PureTeaAgro" source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
            </View>

            <ThemedText type="smallBold" style={styles.title}>Profile & Settings</ThemedText>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account-tie" size={29} color="#0B8C60" />
              </View>
              <View style={styles.profileCopy}>
                <ThemedText type="smallBold" style={styles.name}>Kamal Silva</ThemedText>
                <ThemedText style={styles.role}>Field Officer</ThemedText>
                <ThemedText style={styles.officerId}>FO-00123</ThemedText>
                <ThemedText style={styles.organization}>
                  <MaterialCommunityIcons name="map-marker" size={10} color="#0B9B65" /> Ceylon Tea Board - Thalawakelle
                </ThemedText>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <SettingRow icon="account-outline" label="Edit Profile" />
              <SettingRow icon="lock-outline" label="Change Password" />
              <SettingRow icon="bell-outline" label="Notification Settings" />
              <SettingRow icon="web" label="Language" value={language} onPress={() => setLanguage(language === 'English' ? 'Sinhala' : 'English')} />
              <SettingRow icon="white-balance-sunny" label="Theme" value={theme} onPress={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')} />
            </View>

            <Pressable
              accessibilityLabel="Logout"
              accessibilityRole="button"
              onPress={() => router.replace('/login')}
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="logout" size={16} color="#E54B58" />
              <ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText>
            </Pressable>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
            <BottomTab icon="account-group-outline" label="Farmers" onPress={() => router.push('./field-officer-farmers')} />
            <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
            <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
            <BottomTab icon="account-outline" label="Profile" active />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.35)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  content: { paddingBottom: 18 },
  header: { height: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250,255,251,0.72)' },
  backButton: { position: 'absolute', left: 5, width: 30, height: 30, justifyContent: 'center' },
  logo: { width: 106, height: 25 },
  title: { color: '#174B2F', fontSize: 15, lineHeight: 20, marginHorizontal: 14, marginTop: 3, marginBottom: 10 },
  profileCard: { minHeight: 74, marginHorizontal: 14, borderRadius: 13, backgroundColor: 'rgba(235,250,241,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  avatar: { width: 43, height: 43, borderRadius: 23, backgroundColor: '#D5F9E5', borderWidth: 1, borderColor: '#8AE3B7', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  profileCopy: { flex: 1 },
  name: { color: '#243B42', fontSize: 10, lineHeight: 13 },
  role: { color: '#278B61', fontSize: 8, lineHeight: 11 },
  officerId: { color: '#0A9A60', fontSize: 8, lineHeight: 11, fontWeight: '700' },
  organization: { color: '#718582', fontSize: 7, lineHeight: 10, marginTop: 2 },
  settingsCard: { marginHorizontal: 14, marginTop: 10, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', overflow: 'hidden' },
  settingRow: { minHeight: 35, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#EEF2F0' },
  settingLabel: { color: '#263D43', fontSize: 8, lineHeight: 11, marginLeft: 10, flex: 1 },
  settingValue: { color: '#7E8C93', fontSize: 8, lineHeight: 11, marginRight: 8 },
  logoutButton: { height: 34, marginHorizontal: 14, marginTop: 10, borderRadius: 17, backgroundColor: 'rgba(255,239,241,0.98)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  logoutText: { color: '#E54B58', fontSize: 8, lineHeight: 11, marginLeft: 8 },
  bottomNavigation: { height: 55, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 45 },
  bottomLabel: { color: '#A8B5BB', fontSize: 7, lineHeight: 10 },
  bottomLabelActive: { color: '#087A4A', fontWeight: '700' },
  pressed: { opacity: 0.78 },
});
