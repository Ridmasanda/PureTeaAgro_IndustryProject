import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type ProfileSetting = 'Edit Profile' | 'Change Password' | 'Notification Settings' | 'Language' | 'Theme' | 'Logout';

const green = '#07824D';

const navItems: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

const settings: { title: ProfileSetting; icon: IconName; value?: string }[] = [
  { title: 'Edit Profile', icon: 'account-edit-outline' },
  { title: 'Change Password', icon: 'lock-outline' },
  { title: 'Notification Settings', icon: 'bell-outline' },
  { title: 'Language', icon: 'web', value: 'English' },
  { title: 'Theme', icon: 'white-balance-sunny', value: 'Light' },
];

export default function FactoryOfficerProfileScreen() {
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Light');
  const [activeModal, setActiveModal] = useState<ProfileSetting | null>(null);

  const chooseOption = (option: string) => {
    if (activeModal === 'Language') setLanguage(option);
    if (activeModal === 'Theme') setTheme(option);
    setActiveModal(null);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={19} color="#43564A" />
          </Pressable>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={13} color={green} />
            <ThemedText type="smallBold" style={styles.brandText}>PureTeaAgro</ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile settings"
            onPress={() => setActiveModal('Notification Settings')}
            style={styles.headerButton}>
            <MaterialCommunityIcons name="cog-outline" size={17} color="#31473A" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText type="smallBold" style={styles.pageTitle}>Profile</ThemedText>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <MaterialCommunityIcons name="account-tie" size={31} color="#13844E" />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="smallBold" style={styles.profileName}>Kamal Silva</ThemedText>
              <ThemedText type="small" style={styles.profileMeta}>Employee ID: FO-00123</ThemedText>
              <View style={styles.profileDetail}>
                <MaterialCommunityIcons name="phone-outline" size={10} color="#62776A" />
                <ThemedText type="small" style={styles.profileMeta}>+94 77 123 4567</ThemedText>
              </View>
              <View style={styles.profileDetail}>
                <MaterialCommunityIcons name="factory" size={10} color="#62776A" />
                <ThemedText type="small" style={styles.profileMeta}>Ceylon Tea Factory</ThemedText>
              </View>
              <View style={styles.roleBadge}>
                <ThemedText type="smallBold" style={styles.roleBadgeText}>Factory Officer</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.settingsCard}>
            {settings.map((setting, index) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={setting.title}
                key={setting.title}
                onPress={() => setActiveModal(setting.title)}
                style={[styles.settingRow, index < settings.length - 1 && styles.settingDivider]}>
                <View style={styles.settingIcon}>
                  <MaterialCommunityIcons name={setting.icon} size={14} color={green} />
                </View>
                <ThemedText type="small" style={styles.settingTitle}>{setting.title}</ThemedText>
                {setting.value ? (
                  <ThemedText type="small" style={styles.settingValue}>
                    {setting.title === 'Language' ? language : theme}
                  </ThemedText>
                ) : null}
                <MaterialCommunityIcons name="chevron-right" size={15} color="#8A988F" />
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveModal('Logout')}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="logout" size={14} color="#E24A4A" />
            <ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomNav}>
          {navItems.map(([label, icon]) => {
            const selected = label === 'Profile';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                key={label}
                onPress={() => {
                  if (label === 'Home') router.replace('/factory-officer-dashboard');
                  else if (label === 'Books') router.replace('/factory-books');
                  else if (label === 'Alerts') router.replace('/factory-officer-notifications');
                  else if (label === 'Reports') router.replace('/factory-reports');
                }}
                style={styles.navItem}>
                <MaterialCommunityIcons name={icon} size={17} color={selected ? green : '#7B8780'} />
                <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ProfileModal
          setting={activeModal}
          onClose={() => setActiveModal(null)}
          onChoose={chooseOption}
          onLogout={() => {
            setActiveModal(null);
            router.replace('/');
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

function ProfileModal({
  setting,
  onClose,
  onChoose,
  onLogout,
}: {
  setting: ProfileSetting | null;
  onClose: () => void;
  onChoose: (option: string) => void;
  onLogout: () => void;
}) {
  const options =
    setting === 'Language'
      ? ['English', 'Sinhala', 'Tamil']
      : setting === 'Theme'
        ? ['Light', 'Dark', 'System']
        : setting === 'Logout'
          ? ['Log out of your account?']
          : setting === 'Edit Profile'
            ? ['Profile details can be updated by your administrator.']
            : setting === 'Change Password'
              ? ['Password changes are managed securely from your account settings.']
              : ['Push notifications enabled', 'Email notifications enabled'];

  return (
    <Modal transparent visible={setting !== null} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <ThemedText type="smallBold" style={styles.modalTitle}>{setting}</ThemedText>
          {setting === 'Logout' ? (
            <View style={styles.modalActions}>
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancelButton}>
                <ThemedText type="smallBold" style={styles.cancelText}>Cancel</ThemedText>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={onLogout} style={styles.confirmButton}>
                <ThemedText type="smallBold" style={styles.confirmText}>Logout</ThemedText>
              </Pressable>
            </View>
          ) : (
            <>
              {options.map((option) => (
                <Pressable
                  accessibilityRole={setting === 'Language' || setting === 'Theme' ? 'button' : undefined}
                  key={option}
                  onPress={() => {
                    if (setting === 'Language' || setting === 'Theme') onChoose(option);
                  }}
                  style={styles.modalOption}>
                  <ThemedText type="small" style={styles.modalOptionText}>{option}</ThemedText>
                  {setting === 'Language' || setting === 'Theme' ? (
                    <MaterialCommunityIcons name="chevron-right" size={15} color="#819087" />
                  ) : null}
                </Pressable>
              ))}
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalClose}>
                <ThemedText type="smallBold" style={styles.modalCloseText}>Done</ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(249, 253, 247, 0.74)' },
  safeArea: { flex: 1 },
  header: { height: 39, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  backButton: { width: 27, height: 32, justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  brandText: { color: '#087344', fontSize: 9 },
  headerButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  content: { flexGrow: 1, paddingHorizontal: 11, paddingTop: 2, paddingBottom: 12 },
  pageTitle: { color: '#24362B', fontSize: 15, marginBottom: 6 },
  profileCard: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 8, borderRadius: 11, borderWidth: 1, borderColor: '#DDEBE1', backgroundColor: 'rgba(255,255,255,0.96)' },
  profileAvatar: { width: 39, height: 39, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#10A66C', backgroundColor: '#D8F5E3' },
  profileInfo: { flex: 1 },
  profileName: { color: '#304337', fontSize: 9, lineHeight: 12 },
  profileMeta: { color: '#7B8980', fontSize: 6, lineHeight: 9 },
  profileDetail: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, marginTop: 2, borderRadius: 7, backgroundColor: '#DDF5E5' },
  roleBadgeText: { color: '#16804A', fontSize: 6 },
  settingsCard: { marginTop: 8, paddingHorizontal: 8, borderRadius: 11, borderWidth: 1, borderColor: '#E2EAE1', backgroundColor: 'rgba(255,255,255,0.96)' },
  settingRow: { minHeight: 37, flexDirection: 'row', alignItems: 'center', gap: 7 },
  settingDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E6ECE6' },
  settingIcon: { width: 21, height: 21, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#E4F5E9' },
  settingTitle: { flex: 1, color: '#425348', fontSize: 8 },
  settingValue: { color: '#849188', fontSize: 7, marginRight: 2 },
  logoutButton: { minHeight: 31, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 7, borderRadius: 9, borderWidth: 1, borderColor: '#F0DEDC', backgroundColor: 'rgba(255,245,243,0.94)' },
  logoutText: { color: '#E14B4B', fontSize: 8 },
  pressed: { opacity: 0.82 },
  bottomNav: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E4EAE4', backgroundColor: 'rgba(255,255,255,0.98)' },
  navItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', gap: 1 },
  navLabel: { color: '#78837B', fontSize: 7, lineHeight: 10 },
  navLabelSelected: { color: green, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'center', paddingHorizontal: 27, backgroundColor: 'rgba(22, 37, 27, 0.35)' },
  modalCard: { padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' },
  modalTitle: { color: '#294533', fontSize: 12, marginBottom: 6 },
  modalOption: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8EEE8' },
  modalOptionText: { color: '#48594D', fontSize: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 13 },
  cancelButton: { minHeight: 31, justifyContent: 'center', paddingHorizontal: 13, borderRadius: 8, backgroundColor: '#EEF3EF' },
  cancelText: { color: '#53645A', fontSize: 9 },
  confirmButton: { minHeight: 31, justifyContent: 'center', paddingHorizontal: 13, borderRadius: 8, backgroundColor: '#E94E4E' },
  confirmText: { color: '#FFFFFF', fontSize: 9 },
  modalClose: { alignSelf: 'flex-end', paddingHorizontal: 8, paddingTop: 9 },
  modalCloseText: { color: green, fontSize: 9 },
});
