import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Screen = 'main' | 'notifications' | 'language' | 'security' | 'support';

const menu: [IconName, string, Screen][] = [
  ['bell-outline', 'Notification Preferences', 'notifications'],
  ['translate', 'Language', 'language'],
  ['shield-lock-outline', 'Password & Security', 'security'],
  ['help-circle-outline', 'Help & Support', 'support'],
];

export default function SettingsScreen() {
  const { screen } = useLocalSearchParams<{ screen?: Screen }>();
  const [current, setCurrent] = useState<Screen>(screen ?? 'main');
  const showScreen = (nextScreen: Screen) => setCurrent(nextScreen);
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header title={current === 'main' ? 'Settings' : menu.find((item) => item[2] === current)?.[1] ?? 'Settings'} onBack={current === 'main' ? () => router.back() : () => setCurrent('main')} />
          {current === 'main' && <MainSettings onNavigate={showScreen} />}
          {current === 'notifications' && <NotificationSettings onDone={() => setCurrent('main')} />}
          {current === 'language' && <LanguageSettings onDone={() => setCurrent('main')} />}
          {current === 'security' && <SecuritySettings onDone={() => setCurrent('main')} />}
          {current === 'support' && <SupportSettings />}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return <View style={styles.header}><Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" /></Pressable><ThemedText type="smallBold" style={styles.headerTitle}>{title}</ThemedText><Image source={require('@/assets/images/icon.png')} style={styles.headerLogo} resizeMode="contain" /></View>;
}

function MainSettings({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return <><View style={styles.profileSummary}><View style={styles.avatar}><MaterialCommunityIcons name="account" size={36} color="#168B3E" /></View><View><ThemedText type="smallBold" style={styles.name}>Saman Kumara</ThemedText><ThemedText type="small" style={styles.farmerId}>Farmer ID: FRM-00124</ThemedText><View style={styles.verified}><MaterialCommunityIcons name="check-circle" size={12} color="#168B3E" /><ThemedText type="smallBold" style={styles.verifiedText}>Verified</ThemedText></View></View></View><View style={styles.menuCard}>{menu.map(([icon, label, screen]) => <SettingRow key={label} icon={icon} label={label} onPress={() => onNavigate(screen)} detail={label === 'Language' ? 'Sinhala / English / Tamil' : undefined} />)}<SettingRow icon="information-outline" label="About PureTeaAgro" onPress={() => onNavigate('support')} /></View><Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.logout}><MaterialCommunityIcons name="logout" size={19} color="#D52C2C" /><ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText></Pressable><LeafDecoration /></>;
}

function SettingRow({ icon, label, detail, onPress }: { icon: IconName; label: string; detail?: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}><View style={styles.rowIcon}><MaterialCommunityIcons name={icon} size={18} color="#168B3E" /></View><View style={styles.rowCopy}><ThemedText type="small" style={styles.rowLabel}>{label}</ThemedText>{detail && <ThemedText type="small" style={styles.rowDetail}>{detail}</ThemedText>}</View><MaterialCommunityIcons name="chevron-right" size={19} color="#39785B" /></Pressable>;
}

function NotificationSettings({ onDone }: { onDone: () => void }) {
  const options: [IconName, string][] = [['alert-outline', 'Compliance Alerts'], ['sprout-outline', 'Harvest Updates'], ['clipboard-check-outline', 'Inspection Updates'], ['file-check-outline', 'Record Status'], ['bell-outline', 'System Notifications']];
  return <PreferenceList options={options} onDone={onDone} />;
}

function PreferenceList({ options, onDone }: { options: [IconName, string][]; onDone: () => void }) {
  const [values, setValues] = useState(options.map(() => true));
  return <><ThemedText type="small" style={styles.subtitle}>Choose what you want to receive</ThemedText><View style={styles.menuCard}>{options.map(([icon, label], index) => <View key={label} style={styles.preferenceRow}><View style={styles.rowIcon}><MaterialCommunityIcons name={icon} size={18} color="#168B3E" /></View><ThemedText type="small" style={styles.rowLabel}>{label}</ThemedText><Switch value={values[index]} onValueChange={(value) => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} trackColor={{ false: '#C8DCCB', true: '#8BD09A' }} thumbColor={values[index] ? '#168B3E' : '#F5FFF6'} /></View>)}</View><SaveButton onDone={onDone} /></>;
}

function LanguageSettings({ onDone }: { onDone: () => void }) {
  const [language, setLanguage] = useState('English');
  const languageLetters = { Sinhala: 'සි', English: 'E', Tamil: 'த' };
  return <><ThemedText type="small" style={styles.subtitle}>Select your preferred language</ThemedText><View style={styles.menuCard}>{['Sinhala', 'English', 'Tamil'].map((option) => <Pressable key={option} onPress={() => setLanguage(option)} style={[styles.languageRow, language === option && styles.selectedRow]}><View style={styles.languageIcon}><ThemedText type="smallBold" style={styles.languageLetter}>{languageLetters[option as keyof typeof languageLetters]}</ThemedText></View><View style={styles.rowCopy}><ThemedText type="smallBold" style={styles.rowLabel}>{option}</ThemedText><ThemedText type="small" style={styles.rowDetail}>{option === 'Sinhala' ? 'සිංහල' : option === 'Tamil' ? 'தமிழ்' : 'English'}</ThemedText></View><MaterialCommunityIcons name={language === option ? 'radiobox-marked' : 'radiobox-blank'} size={21} color={language === option ? '#168B3E' : '#A4CDB0'} /></Pressable>)}</View><SaveButton onDone={onDone} /></>;
}

function SecuritySettings({ onDone }: { onDone: () => void }) {
  const [twoFactor, setTwoFactor] = useState(true);
  return <><View style={styles.menuCard}><SettingRow icon="lock-outline" label="Change Password" detail="Update your password" onPress={() => router.push('/reset-password')} /><View style={styles.preferenceRow}><View style={styles.rowIcon}><MaterialCommunityIcons name="shield-key-outline" size={18} color="#168B3E" /></View><View style={styles.rowCopy}><ThemedText type="small" style={styles.rowLabel}>Two-Factor Authentication</ThemedText><ThemedText type="small" style={styles.rowDetail}>Add extra security</ThemedText></View><Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: '#C8DCCB', true: '#8BD09A' }} thumbColor={twoFactor ? '#168B3E' : '#F5FFF6'} /></View><SettingRow icon="shield-check-outline" label="Login Activity" detail="View recent logins" onPress={() => undefined} /></View><SaveButton onDone={onDone} /></>;
}

function SupportSettings() {
  return <View style={styles.support}><Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} /><ThemedText type="subtitle" style={styles.supportTitle}>PureTeaAgro</ThemedText><ThemedText type="small" style={styles.supportText}>Safer Tea  |  Greener Future</ThemedText><ThemedText type="small" style={styles.version}>Version 1.0.0</ThemedText><Pressable style={styles.primaryButton} onPress={() => undefined}><MaterialCommunityIcons name="headset" size={20} color="#FFF" /><ThemedText type="smallBold" style={styles.primaryText}>Chat with Support</ThemedText></Pressable></View>;
}

function SaveButton({ onDone }: { onDone: () => void }) {
  return <Pressable style={styles.primaryButton} onPress={onDone}><ThemedText type="smallBold" style={styles.primaryText}>Save Changes</ThemedText></Pressable>;
}

function LeafDecoration() {
  return <View style={styles.decoration}><MaterialCommunityIcons name="leaf" size={50} color="#A5DFA8" /><MaterialCommunityIcons name="leaf" size={42} color="#B9E8B8" /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 }, safeArea: { flex: 1 }, content: { paddingHorizontal: 14, paddingBottom: 24, flexGrow: 1 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' }, headerTitle: { color: '#173F25', fontSize: 17 }, headerLogo: { width: 34, height: 34 }, profileSummary: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 12 }, avatar: { width: 68, height: 68, borderRadius: 35, backgroundColor: '#D5F0D9', borderWidth: 2, borderColor: '#6BBC7A', alignItems: 'center', justifyContent: 'center' }, name: { color: '#174B32', fontSize: 17 }, farmerId: { color: '#5A806B', fontSize: 10, marginTop: 2 }, verified: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#C9F0CF', borderRadius: 12, paddingHorizontal: 7, paddingVertical: 2, marginTop: 5 }, verifiedText: { color: '#168B3E', fontSize: 9 }, menuCard: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', overflow: 'hidden', marginBottom: 14 }, settingRow: { minHeight: 54, paddingHorizontal: 11, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 9 }, rowIcon: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#E5F7E8', alignItems: 'center', justifyContent: 'center' }, rowCopy: { flex: 1 }, rowLabel: { color: '#315945', fontSize: 11 }, rowDetail: { color: '#789080', fontSize: 9, marginTop: 1 }, languageLetter: { color: '#168B3E', fontSize: 15 }, logout: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: '#F09B9B', backgroundColor: 'rgba(255,246,246,0.95)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, logoutText: { color: '#D52C2C', fontSize: 11 }, subtitle: { color: '#527565', fontSize: 11, marginBottom: 12 }, preferenceRow: { minHeight: 56, paddingHorizontal: 11, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 9 }, languageRow: { minHeight: 68, paddingHorizontal: 11, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 9 }, languageIcon: { width: 38, height: 38, borderRadius: 20, backgroundColor: '#E5F7E8', alignItems: 'center', justifyContent: 'center' }, selectedRow: { backgroundColor: '#F0FFF2' }, primaryButton: { minHeight: 45, borderRadius: 23, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 18 }, primaryText: { color: '#FFF', fontSize: 11 }, support: { alignItems: 'center', paddingTop: 34 }, logo: { width: 116, height: 116 }, supportTitle: { color: '#07863C', fontSize: 21, marginTop: 8 }, supportText: { color: '#527565', fontSize: 11 }, version: { color: '#789080', fontSize: 10, marginTop: 20 }, decoration: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 28 }, pressed: { opacity: 0.8 },
});
