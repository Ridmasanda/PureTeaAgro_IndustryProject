import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
type DashboardTab = 'Home' | 'Farmers' | 'Visits' | 'Alerts' | 'Profile';
type ProfileAction = 'Edit Profile' | 'Notification Settings' | 'Change Password' | 'Help & Support' | 'Logout';

const tabs: { label: DashboardTab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Farmers', icon: 'account-group-outline' },
  { label: 'Visits', icon: 'calendar-month-outline' },
  { label: 'Alerts', icon: 'bell-outline' },
  { label: 'Profile', icon: 'account-outline' },
];

const profileActions: { label: ProfileAction; icon: IconName }[] = [
  { label: 'Edit Profile', icon: 'account-outline' },
  { label: 'Notification Settings', icon: 'bell-outline' },
  { label: 'Change Password', icon: 'lock-reset' },
  { label: 'Help & Support', icon: 'lifebuoy' },
];

const actionDescriptions: Record<Exclude<ProfileAction, 'Logout'>, string> = {
  'Edit Profile': 'Your profile details are managed by your Tea Board administrator.',
  'Notification Settings': 'Visit reminders and agricultural advisories are enabled.',
  'Change Password': 'For your security, password changes are managed through account support.',
  'Help & Support': 'Contact Ceylon Tea Board support for help with your inspector account.',
};

export default function TeaInspectorProfileScreen() {
  const { fullName, inspectorId, district, mobile, organization } = useLocalSearchParams<{
    fullName?: string;
    inspectorId?: string;
    district?: string;
    mobile?: string;
    organization?: string;
  }>();
  const [activeAction, setActiveAction] = useState<ProfileAction | null>(null);

  const navigateToTab = (tab: Exclude<DashboardTab, 'Profile'>) => {
    if (tab === 'Farmers') {
      router.replace({
        pathname: './tea-inspector-farmers',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    if (tab === 'Visits') {
      router.replace({
        pathname: './tea-inspector-visits',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    if (tab === 'Alerts') {
      router.replace({
        pathname: './tea-inspector-alerts',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    router.replace({
      pathname: './tea-inspector-dashboard',
      params: { tab, fullName, inspectorId, district, mobile, organization },
    });
  };

  const handleAction = (action: ProfileAction) => {
    if (action === 'Logout') {
      setActiveAction(null);
      router.replace('/');
      return;
    }
    setActiveAction(action);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.background}>
      <View pointerEvents="none" style={styles.backgroundWash} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#374B5B" />
          </Pressable>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="sprout" size={18} color="#058A54" />
            <ThemedText type="smallBold" style={styles.brandText}>
              pureTea<ThemedText type="smallBold" style={styles.brandTextGreen}>Agro</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText type="smallBold" style={styles.pageTitle}>Tea Inspector Profile</ThemedText>

          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account-tie" size={34} color="#087B45" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="smallBold" style={styles.profileName}>{fullName || 'Nimal Perera'}</ThemedText>
              <ThemedText type="smallBold" style={styles.employeeId}>Employee ID: {inspectorId || 'TI-0021'}</ThemedText>
              <ProfileDetail icon="phone-outline" value={mobile || '+94 77 123 4567'} />
              <ProfileDetail icon="map-marker-outline" value={district ? `${district} District` : 'Thalawakale District'} />
              <ProfileDetail icon="office-building-outline" value={organization || 'Ceylon Tea Board'} />
              <View style={styles.roleBadge}>
                <MaterialCommunityIcons name="flag-variant-outline" size={10} color="#13834F" />
                <ThemedText type="smallBold" style={styles.roleBadgeText}>Tea Inspector</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.settingsCard}>
            {profileActions.map((action, index) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={action.label}
                key={action.label}
                onPress={() => handleAction(action.label)}
                style={({ pressed }) => [
                  styles.settingRow,
                  index < profileActions.length - 1 && styles.settingDivider,
                  pressed && styles.pressed,
                ]}>
                <View style={styles.settingIcon}>
                  <MaterialCommunityIcons name={action.icon} size={14} color="#128354" />
                </View>
                <ThemedText type="smallBold" style={styles.settingTitle}>{action.label}</ThemedText>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#91A0AE" />
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={() => handleAction('Logout')}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="logout" size={14} color="#E6474F" />
            <ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomBar}>
          {tabs.map(({ label, icon }) => {
            const selected = label === 'Profile';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
                key={label}
                onPress={() => {
                  if (!selected) navigateToTab(label);
                }}
                style={styles.tabButton}>
                <MaterialCommunityIcons name={icon} size={17} color={selected ? '#087B56' : '#92A1B1'} />
                <ThemedText type="small" style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                  {label}
                </ThemedText>
                {selected ? <View style={styles.activeTabIndicator} /> : null}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.homeIndicator} />

        <Modal
          transparent
          visible={activeAction !== null}
          animationType="fade"
          onRequestClose={() => setActiveAction(null)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveAction(null)}>
            <View style={styles.modalCard}>
              <View style={styles.modalIcon}>
                <MaterialCommunityIcons
                  name={activeAction === 'Notification Settings' ? 'bell-check-outline' : 'information-outline'}
                  size={20}
                  color="#087B56"
                />
              </View>
              <ThemedText type="smallBold" style={styles.modalTitle}>{activeAction}</ThemedText>
              <ThemedText type="small" style={styles.modalMessage}>
                {activeAction && activeAction !== 'Logout' ? actionDescriptions[activeAction] : ''}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => setActiveAction(null)}
                style={styles.modalButton}>
                <ThemedText type="smallBold" style={styles.modalButtonText}>Got it</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

function ProfileDetail({ icon, value }: { icon: IconName; value: string }) {
  return (
    <View style={styles.profileDetail}>
      <MaterialCommunityIcons name={icon} size={10} color="#188558" />
      <ThemedText type="small" style={styles.profileMeta}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#EFF5EB',
  },
  backgroundWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 49,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 30,
    height: 34,
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  brandText: {
    color: '#172632',
    fontSize: 12,
    lineHeight: 16,
  },
  brandTextGreen: {
    color: '#098E55',
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 13,
    paddingTop: 6,
    paddingBottom: 12,
  },
  pageTitle: {
    color: '#07583E',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 11,
  },
  profileCard: {
    minHeight: 133,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    shadowColor: '#233B2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    marginTop: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#7DD5B0',
    backgroundColor: '#DDF8EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#08BA7E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 1,
  },
  profileName: {
    color: '#202E3E',
    fontSize: 11,
    lineHeight: 15,
  },
  employeeId: {
    color: '#087848',
    fontSize: 8,
    lineHeight: 11,
    marginBottom: 2,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileMeta: {
    color: '#657589',
    fontSize: 7,
    lineHeight: 10,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    minHeight: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#B9EFD2',
    backgroundColor: '#DFF9EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 3,
    marginTop: 7,
  },
  roleBadgeText: {
    color: '#087A4C',
    fontSize: 7,
    lineHeight: 10,
  },
  settingsCard: {
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.97)',
    marginTop: 12,
    paddingHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#233B2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  settingRow: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  settingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EF',
  },
  settingIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: '#E5F8ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    flex: 1,
    color: '#293646',
    fontSize: 9,
    lineHeight: 13,
  },
  logoutButton: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255,245,243,0.96)',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  logoutText: {
    color: '#E6474F',
    fontSize: 9,
  },
  bottomBar: {
    minHeight: 54,
    paddingHorizontal: 7,
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226,234,231,0.92)',
    backgroundColor: 'rgba(255,255,255,0.97)',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    position: 'relative',
  },
  tabLabel: {
    color: '#92A1B1',
    fontSize: 7,
    lineHeight: 10,
  },
  tabLabelSelected: {
    color: '#087B56',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -3,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#087B56',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 92,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9BA4AE',
    marginTop: 4,
    marginBottom: 5,
  },
  pressed: {
    opacity: 0.82,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(19,35,28,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  modalIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5F8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  modalTitle: {
    color: '#26394D',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#6D7D8E',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
  },
  modalButton: {
    minHeight: 30,
    minWidth: 100,
    borderRadius: 7,
    backgroundColor: '#087B56',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
});
