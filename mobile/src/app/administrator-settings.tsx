import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type SettingsItem = {
  title: string;
  description: string;
  icon: IconName;
  action: () => void;
  trailing?: 'chevron' | 'language';
};

const languages = ['English', 'Sinhala', 'Tamil'];

export default function AdministratorSettingsScreen() {
  const [language, setLanguage] = useState('English');

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    } else if (tab === 'Users') {
      router.replace('/administrator-users');
    } else if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
    } else if (tab === 'Activity') {
      router.replace('/administrator-activity');
    } else {
      return;
    }
  }

  function showSettingsInfo(title: string, description: string) {
    Alert.alert(title, `${description}\n\nThis setting will be available when the administrator service is connected.`);
  }

  function cycleLanguage() {
    const nextLanguage = languages[(languages.indexOf(language) + 1) % languages.length];
    setLanguage(nextLanguage);
  }

  function confirmLogout() {
    Alert.alert('Log out', 'Are you sure you want to sign out from your administrator account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/login') },
    ]);
  }

  const settings: SettingsItem[] = [
    {
      title: 'Account Security',
      description: 'Manage your account security settings',
      icon: 'shield-check',
      action: () => showSettingsInfo('Account Security', 'Manage administrator security settings.'),
    },
    {
      title: 'Password Policy',
      description: 'Set password rules and requirements',
      icon: 'lock',
      action: () => showSettingsInfo('Password Policy', 'Configure password rules and requirements.'),
    },
    {
      title: 'Notification Settings',
      description: 'Configure system notifications',
      icon: 'bell',
      action: () => router.push('/administrator-notifications'),
    },
    {
      title: 'Blockchain Monitoring',
      description: 'View transaction and network status',
      icon: 'lan',
      action: () => router.push('/administrator-blockchain-monitoring'),
    },
    {
      title: 'Language',
      description: 'Select your preferred language',
      icon: 'web',
      action: cycleLanguage,
      trailing: 'language',
    },
    {
      title: 'Organization Configuration',
      description: 'Manage organization details and settings',
      icon: 'domain',
      action: () => showSettingsInfo('Organization Configuration', 'Manage organization details and settings.'),
    },
    {
      title: 'Backup Settings',
      description: 'Configure automatic backups',
      icon: 'cloud-upload',
      action: () => showSettingsInfo('Backup Settings', 'Configure automatic system backups.'),
    },
    {
      title: 'About System',
      description: 'Version, build and system information',
      icon: 'information',
      action: () => Alert.alert('About System', 'PureTeaAgro Administrator App\nVersion 1.0.0\nBuild: Demo'),
    },
    {
      title: 'Logout',
      description: 'Sign out from your account',
      icon: 'logout',
      action: confirmLogout,
    },
  ];

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>System Settings</ThemedText>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="cog" size={21} color="#176B32" />
            </View>
          </View>

          <View style={styles.settingsList}>
            {settings.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item.title}
                onPress={item.action}
                style={({ pressed }) => [styles.settingCard, pressed && styles.pressed]}>
                <View style={[styles.settingIcon, item.title === 'Logout' && styles.logoutIcon]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={19}
                    color={item.title === 'Logout' ? '#19834A' : '#1B713F'}
                  />
                </View>
                <View style={styles.settingCopy}>
                  <ThemedText type="smallBold" style={styles.settingTitle}>{item.title}</ThemedText>
                  <ThemedText type="small" style={styles.settingDescription}>{item.description}</ThemedText>
                </View>
                {item.trailing === 'language' ? (
                  <View style={styles.languageControl}>
                    <ThemedText type="smallBold" style={styles.languageText}>{language}</ThemedText>
                    <MaterialCommunityIcons name="chevron-down" size={13} color="#39754F" />
                  </View>
                ) : (
                  <MaterialCommunityIcons name="chevron-right" size={18} color="#537C65" />
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="leaf" size={19} color="#168246" />
            <ThemedText type="smallBold" style={styles.footerTitle}>Together for a Sustainable Tea Future</ThemedText>
            <ThemedText type="small" style={styles.footerVersion}>PureTeaAgro · Administrator</ThemedText>
          </View>
        </ScrollView>
        <AdministratorBottomTabs activeTab="Settings" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 3, paddingBottom: 8 },
  header: { minHeight: 43, flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 17 },
  headerIcon: { width: 34, height: 38, alignItems: 'flex-end', justifyContent: 'center' },
  settingsList: { gap: 7 },
  settingCard: { minHeight: 56, borderWidth: 1, borderColor: '#D6EAE0', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 9, paddingVertical: 7 },
  settingIcon: { width: 34, height: 34, borderRadius: 18, backgroundColor: '#E3F5E3', alignItems: 'center', justifyContent: 'center' },
  logoutIcon: { backgroundColor: '#E9F6E9' },
  settingCopy: { flex: 1, minWidth: 0 },
  settingTitle: { color: '#315E42', fontSize: 9, lineHeight: 14 },
  settingDescription: { color: '#819388', fontSize: 7, lineHeight: 11, marginTop: 1 },
  languageControl: { minWidth: 61, height: 21, borderRadius: 12, backgroundColor: '#E4F7E9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 6 },
  languageText: { color: '#34734A', fontSize: 7 },
  footer: { minHeight: 75, alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 'auto', paddingTop: 12 },
  footerTitle: { color: '#3D7C4E', fontSize: 8, fontStyle: 'italic', textAlign: 'center' },
  footerVersion: { color: '#7D9484', fontSize: 7 },
  pressed: { opacity: 0.82 },
});
