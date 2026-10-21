import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

export type AdministratorTab =
  | 'Home'
  | 'Users'
  | 'Approvals'
  | 'Assignments'
  | 'Organizations'
  | 'Activity'
  | 'Settings';
type AdminSection = AdministratorTab;
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type StatTone = 'green' | 'blue' | 'red' | 'yellow';
type ActionTone = 'green' | 'blue' | 'purple';
type AdministratorRoute =
  | '/administrator-home'
  | '/administrator-users'
  | '/administrator-approvals'
  | '/administrator-assignments'
  | '/administrator-organizations'
  | '/administrator-activity'
  | '/administrator-notifications'
  | '/administrator-settings';

const stats: {
  label: string;
  value: string;
  note: string;
  icon: IconName;
  tone: StatTone;
  iconColor: string;
  section: AdminSection;
}[] = [
  { label: 'Total Users', value: '245', note: 'All registered users', icon: 'account-group', tone: 'green', iconColor: '#21803A', section: 'Users' },
  { label: 'Active Farmers', value: '128', note: 'Active farmer accounts', icon: 'account-tie-hat', tone: 'green', iconColor: '#21803A', section: 'Users' },
  { label: 'Active Inspectors', value: '32', note: 'Active inspector accounts', icon: 'account-search', tone: 'green', iconColor: '#21803A', section: 'Users' },
  { label: 'Leaf Collectors', value: '18', note: 'Registered collectors', icon: 'leaf', tone: 'green', iconColor: '#21803A', section: 'Users' },
  { label: 'Pending Approvals', value: '12', note: 'Accounts awaiting approval', icon: 'file-document-outline', tone: 'red', iconColor: '#D64B36', section: 'Approvals' },
  { label: 'System Alerts', value: '3', note: 'Important issues', icon: 'alert', tone: 'yellow', iconColor: '#D89405', section: 'Activity' },
];

const quickActions: {
  label: string;
  icon: IconName;
  tone: ActionTone;
  section?: AdminSection;
}[] = [
  { label: 'Manage\nUsers', icon: 'account-cog', tone: 'green', section: 'Users' },
  { label: 'Approve\nAccounts', icon: 'check-circle', tone: 'blue', section: 'Approvals' },
  { label: 'View System\nActivity', icon: 'chart-box-outline', tone: 'purple', section: 'Activity' },
  { label: 'Send\nNotification', icon: 'bell-outline', tone: 'green' },
];

const tabs: { label: AdminSection; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Users', icon: 'account-group-outline' },
  { label: 'Approvals', icon: 'shield-check-outline' },
  { label: 'Assignments', icon: 'account-switch-outline' },
  { label: 'Organizations', icon: 'domain' },
  { label: 'Activity', icon: 'chart-line' },
  { label: 'Settings', icon: 'cog-outline' },
];

function HealthItem({ label, icon }: { label: string; icon: IconName }) {
  return (
    <View style={styles.healthItem}>
      <MaterialCommunityIcons name={icon} size={15} color="#247D49" />
      <ThemedText type="smallBold" style={styles.healthLabel}>{label}</ThemedText>
      <View style={styles.operationalRow}>
        <View style={styles.onlineDot} />
        <ThemedText type="small" style={styles.operationalText}>Operational</ThemedText>
      </View>
    </View>
  );
}

export function AdministratorBottomTabs({
  activeTab,
  onSelect,
  onRoute,
}: {
  activeTab: AdministratorTab;
  onSelect: (tab: AdministratorTab) => void;
  onRoute?: (route: AdministratorRoute) => void;
}) {
  return (
    <View style={tabStyles.bottomNav}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.label;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={tab.label}
            onPress={() => {
              if (tab.label === 'Users') {
                onRoute?.('/administrator-users');
                return;
              }
              if (tab.label === 'Approvals') {
                onRoute?.('/administrator-approvals');
                return;
              }
              if (tab.label === 'Assignments') {
                onRoute?.('/administrator-assignments');
                return;
              }
              if (tab.label === 'Organizations') {
                onRoute?.('/administrator-organizations');
                return;
              }
              if (tab.label === 'Activity') {
                onRoute?.('/administrator-activity');
                return;
              }
              if (tab.label === 'Settings') {
                onRoute?.('/administrator-settings');
                return;
              }
              onSelect(tab.label);
            }}
            style={tabStyles.tabButton}>
            <MaterialCommunityIcons
              name={tab.icon}
              size={20}
              color={selected ? '#176B32' : '#7D8C82'}
            />
            <ThemedText
              type="small"
              style={[tabStyles.tabLabel, selected && tabStyles.tabLabelSelected]}>
              {tab.label}
            </ThemedText>
            {selected && <View style={tabStyles.activeTabMark} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function AdministratorHomeScreen() {
  const { section: requestedSection } = useLocalSearchParams<{ section?: string }>();
  const [activeSection, setActiveSection] = useState<AdminSection>(() =>
    tabs.find((tab) => tab.label === requestedSection)?.label ?? 'Home',
  );

  function openSection(section: AdminSection) {
    if (section === 'Users') {
      router.push('/administrator-users');
      return;
    }
    if (section === 'Approvals') {
      router.push('/administrator-approvals');
      return;
    }
    if (section === 'Assignments') {
      router.push('/administrator-assignments');
      return;
    }
    if (section === 'Organizations') {
      router.push('/administrator-organizations');
      return;
    }
    if (section === 'Activity') {
      router.push('/administrator-activity');
      return;
    }
    if (section === 'Settings') {
      router.push('/administrator-settings');
      return;
    }
    setActiveSection(section);
  }

  function selectTab(section: AdminSection) {
    if (section === 'Users') {
      router.push('/administrator-users');
      return;
    }
    if (section === 'Approvals') {
      router.push('/administrator-approvals');
      return;
    }
    if (section === 'Assignments') {
      router.push('/administrator-assignments');
      return;
    }
    if (section === 'Organizations') {
      router.push('/administrator-organizations');
      return;
    }
    if (section === 'Activity') {
      router.push('/administrator-activity');
      return;
    }
    if (section === 'Settings') {
      router.push('/administrator-settings');
      return;
    }
    setActiveSection(section);
  }

  function handleQuickAction(label: string, section?: AdminSection) {
    if (section) {
      openSection(section);
      return;
    }
    router.push('/administrator-notifications');
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.brandBlock}>
              <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
              <ThemedText type="smallBold" style={styles.brandName}>pureTeaAgro</ThemedText>
            </View>
            <View style={styles.welcome}>
              <ThemedText type="smallBold" style={styles.greeting}>Good Morning,</ThemedText>
              <ThemedText type="smallBold" style={styles.adminName}>Administrator</ThemedText>
              <ThemedText type="small" style={styles.overviewText}>PureTeaAgro System Overview</ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Open system notifications"
              accessibilityRole="button"
              onPress={() => router.push('/administrator-notifications')}
              style={styles.notificationButton}>
              <MaterialCommunityIcons name="bell-outline" size={21} color="#176B32" />
              <View style={styles.notificationDot} />
            </Pressable>
            <View style={styles.adminAvatar}>
              <MaterialCommunityIcons name="account-tie" size={26} color="#176B32" />
            </View>
          </View>

          {activeSection === 'Home' ? (
            <>
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <Pressable
                    accessibilityRole="button"
                    key={stat.label}
                    onPress={() => openSection(stat.section)}
                    style={({ pressed }) => [
                      styles.statCard,
                      statToneStyles[stat.tone].card,
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.statIcon, statToneStyles[stat.tone].icon]}>
                      <MaterialCommunityIcons name={stat.icon} size={23} color={stat.iconColor} />
                    </View>
                    <View style={styles.statContent}>
                      <ThemedText type="small" style={styles.statLabel}>{stat.label}</ThemedText>
                      <ThemedText type="smallBold" style={styles.statValue}>{stat.value}</ThemedText>
                      <ThemedText type="small" style={styles.statNote}>{stat.note}</ThemedText>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={17} color="#52816A" />
                  </Pressable>
                ))}
              </View>

              <View style={styles.sectionHeading}>
                <View style={styles.sectionTitleWrap}>
                  <MaterialCommunityIcons name="flash" size={19} color="#247D49" />
                  <ThemedText type="smallBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => openSection('Activity')}
                  style={styles.viewAll}>
                  <ThemedText type="smallBold" style={styles.viewAllText}>View All</ThemedText>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#38734A" />
                </Pressable>
              </View>

              <View style={styles.actionsGrid}>
                {quickActions.map((action) => (
                  <Pressable
                    accessibilityRole="button"
                    key={action.label}
                    onPress={() => handleQuickAction(action.label, action.section)}
                    style={({ pressed }) => [styles.actionCard, actionToneStyles[action.tone].card, pressed && styles.pressed]}>
                    <View style={[styles.actionIcon, actionToneStyles[action.tone].icon]}>
                      <MaterialCommunityIcons name={action.icon} size={22} color={actionToneStyles[action.tone].color} />
                    </View>
                    <ThemedText type="smallBold" style={styles.actionLabel}>{action.label}</ThemedText>
                  </Pressable>
                ))}
              </View>

              <View style={styles.healthCard}>
                <View style={styles.healthHeader}>
                  <View style={styles.healthTitleWrap}>
                    <MaterialCommunityIcons name="heart-pulse" size={22} color="#19854A" />
                    <ThemedText type="smallBold" style={styles.healthTitle}>System Health Summary</ThemedText>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openSection('Activity')}
                    style={styles.detailsButton}>
                    <ThemedText type="smallBold" style={styles.detailsText}>View Details</ThemedText>
                    <MaterialCommunityIcons name="chevron-right" size={15} color="#337548" />
                  </Pressable>
                </View>
                <View style={styles.healthGrid}>
                  <HealthItem label="Backend API" icon="api" />
                  <HealthItem label="Database" icon="database-outline" />
                  <HealthItem label="Authentication" icon="shield-check-outline" />
                  <HealthItem label="Notifications" icon="bell-outline" />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.sectionPlaceholder}>
              <View style={styles.placeholderIcon}>
                <MaterialCommunityIcons
                  name={tabs.find((tab) => tab.label === activeSection)?.icon ?? 'home'}
                  size={34}
                  color="#217843"
                />
              </View>
              <ThemedText type="smallBold" style={styles.placeholderTitle}>{activeSection}</ThemedText>
              <ThemedText type="small" style={styles.placeholderText}>
                {activeSection} management will be available when connected to the administrator service.
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <AdministratorBottomTabs
          activeTab={activeSection}
          onSelect={selectTab}
          onRoute={(route) => router.push(route)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  backgroundOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.78)' },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 14, paddingBottom: 10 },
  hero: {
    minHeight: 122,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -14,
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 9,
    backgroundColor: 'rgba(230,248,226,0.55)',
  },
  brandBlock: { width: 74, alignItems: 'center', marginRight: 7 },
  logo: { width: 61, height: 59 },
  brandName: { color: '#1B6937', fontSize: 9, marginTop: -7 },
  welcome: { flex: 1, minWidth: 0 },
  greeting: { color: '#267443', fontSize: 12, lineHeight: 16 },
  adminName: { color: '#155B35', fontSize: 21, lineHeight: 25 },
  overviewText: { color: '#688376', fontSize: 9, lineHeight: 14, marginTop: 2 },
  notificationButton: { width: 34, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  notificationDot: { position: 'absolute', top: 7, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E45743', borderWidth: 1, borderColor: '#FFFFFF' },
  adminAvatar: { width: 42, height: 42, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#D6EBD5', marginLeft: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8, marginTop: 7 },
  statCard: { width: '49%', minHeight: 78, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 7, gap: 7 },
  greenCard: { backgroundColor: 'rgba(250,255,252,0.96)', borderColor: '#D5EAE0' },
  blueCard: { backgroundColor: 'rgba(249,253,255,0.96)', borderColor: '#D5E6EE' },
  redCard: { backgroundColor: 'rgba(255,249,247,0.97)', borderColor: '#F1DCD6' },
  yellowCard: { backgroundColor: 'rgba(255,252,242,0.97)', borderColor: '#EFE5C8' },
  statIcon: { width: 34, height: 34, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  greenIcon: { backgroundColor: '#E0F5E4' },
  blueIcon: { backgroundColor: '#DDF0FA' },
  redIcon: { backgroundColor: '#FDE6E1' },
  yellowIcon: { backgroundColor: '#FFF0C8' },
  greenIconColor: { color: '#21803A' },
  blueIconColor: { color: '#327EA1' },
  redIconColor: { color: '#D64B36' },
  yellowIconColor: { color: '#D89405' },
  statContent: { flex: 1, minWidth: 0 },
  statLabel: { color: '#3D6657', fontSize: 9, lineHeight: 12 },
  statValue: { color: '#185D3B', fontSize: 16, lineHeight: 20 },
  statNote: { color: '#769087', fontSize: 7, lineHeight: 10 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 7 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionTitle: { color: '#18543A', fontSize: 14 },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#38734A', fontSize: 9 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  actionCard: { flex: 1, minHeight: 77, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 7, paddingHorizontal: 3 },
  greenAction: { backgroundColor: 'rgba(237,251,239,0.96)', borderColor: '#D7EEDD' },
  blueAction: { backgroundColor: 'rgba(238,248,253,0.96)', borderColor: '#D7E9F2' },
  purpleAction: { backgroundColor: 'rgba(246,243,255,0.97)', borderColor: '#E4DDF5' },
  actionIcon: { width: 33, height: 33, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  greenActionIcon: { backgroundColor: '#D8F2DC' },
  blueActionIcon: { backgroundColor: '#D9EFF9' },
  purpleActionIcon: { backgroundColor: '#E8DFFD' },
  greenActionColor: { color: '#18743B' },
  blueActionColor: { color: '#2B83A5' },
  purpleActionColor: { color: '#7558B5' },
  actionLabel: { color: '#325B47', fontSize: 8, lineHeight: 11, textAlign: 'center' },
  pressed: { opacity: 0.85 },
  healthCard: { borderRadius: 12, borderWidth: 1, borderColor: '#D9E9DD', backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 9, paddingVertical: 8, marginTop: 9 },
  healthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  healthTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  healthTitle: { color: '#285A40', fontSize: 10 },
  detailsButton: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { color: '#337548', fontSize: 8 },
  healthGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E6EFE8', paddingTop: 7 },
  healthItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E6EFE8', paddingHorizontal: 2 },
  healthLabel: { color: '#47705A', fontSize: 7, lineHeight: 11, textAlign: 'center', marginTop: 2 },
  operationalRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#21A35A' },
  operationalText: { color: '#668574', fontSize: 6, lineHeight: 9 },
  sectionPlaceholder: { flex: 1, minHeight: 280, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  placeholderIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E2F4DE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  placeholderTitle: { color: '#174A2A', fontSize: 19 },
  placeholderText: { color: '#687A6D', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 5 },
});

const statToneStyles: Record<StatTone, { card: object; icon: object }> = {
  green: { card: styles.greenCard, icon: styles.greenIcon },
  blue: { card: styles.blueCard, icon: styles.blueIcon },
  red: { card: styles.redCard, icon: styles.redIcon },
  yellow: { card: styles.yellowCard, icon: styles.yellowIcon },
};

const actionToneStyles: Record<ActionTone, { card: object; icon: object; color: string }> = {
  green: { card: styles.greenAction, icon: styles.greenActionIcon, color: '#18743B' },
  blue: { card: styles.blueAction, icon: styles.blueActionIcon, color: '#2B83A5' },
  purple: { card: styles.purpleAction, icon: styles.purpleActionIcon, color: '#7558B5' },
};

const tabStyles = StyleSheet.create({
  bottomNav: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E2EEE3',
    paddingHorizontal: 4,
    paddingBottom: 3,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: { color: '#839087', fontSize: 8, lineHeight: 12, marginTop: 2 },
  tabLabelSelected: { color: '#176B32', fontWeight: '700' },
  activeTabMark: {
    position: 'absolute',
    bottom: -5,
    height: 2,
    width: 24,
    borderRadius: 2,
    backgroundColor: '#176B32',
  },
});
