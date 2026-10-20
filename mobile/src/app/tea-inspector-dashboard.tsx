import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ComponentProps } from 'react';
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
type DashboardTab = 'Home' | 'Farmers' | 'Visits' | 'Alerts' | 'Profile';

const tabs: { label: DashboardTab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Farmers', icon: 'account-group-outline' },
  { label: 'Visits', icon: 'calendar-month-outline' },
  { label: 'Alerts', icon: 'bell-outline' },
  { label: 'Profile', icon: 'account-outline' },
];

const todayVisits = [
  { name: 'Nimal Perera', location: 'Kandy - Land 001', time: '09:30 AM' },
  { name: 'Sunil Silva', location: 'Gampola - Land 002', time: '11:00 AM' },
  { name: 'Kamal Fernando', location: 'Matale - Land 003', time: '02:30 PM' },
];

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: 'green' | 'blue' | 'amber';
}) {
  return (
    <View style={[styles.summaryCard, styles[`summaryCard_${tone}`]]}>
      <View style={[styles.summaryIcon, styles[`summaryIcon_${tone}`]]}>
        <MaterialCommunityIcons
          name={icon}
          size={15}
          color={tone === 'green' ? '#07815A' : tone === 'blue' ? '#1478B8' : '#B96508'}
        />
      </View>
      <ThemedText type="small" style={styles.summaryLabel}>{label}</ThemedText>
      <ThemedText type="subtitle" style={[styles.summaryValue, styles[`summaryValue_${tone}`]]}>
        {value}
      </ThemedText>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  primary = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        primary ? styles.quickActionPrimary : styles.quickActionSecondary,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.quickActionIcon, primary && styles.quickActionIconPrimary]}>
        <MaterialCommunityIcons name={icon} size={15} color={primary ? '#FFFFFF' : '#087B56'} />
      </View>
      <ThemedText type="smallBold" style={[styles.quickActionLabel, primary && styles.quickActionLabelPrimary]}>
        {label}
      </ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={18} color={primary ? '#D8F4E9' : '#087B56'} />
    </Pressable>
  );
}

export default function TeaInspectorDashboardScreen() {
  const { fullName, inspectorId, district, mobile, organization } = useLocalSearchParams<{
    fullName?: string;
    inspectorId?: string;
    district?: string;
    mobile?: string;
    organization?: string;
  }>();
  const firstName = fullName?.trim().split(/\s+/)[0] || 'Inspector';
  const accountParams = { fullName, inspectorId, district, mobile, organization };

  const navigateToTab = (tab: DashboardTab) => {
    if (tab === 'Home') {
      router.replace({ pathname: './tea-inspector-dashboard', params: accountParams });
    } else if (tab === 'Farmers') {
      router.replace({ pathname: './tea-inspector-farmers', params: accountParams });
    } else if (tab === 'Visits') {
      router.replace({ pathname: './tea-inspector-visits', params: accountParams });
    } else if (tab === 'Alerts') {
      router.replace({ pathname: './tea-inspector-alerts', params: accountParams });
    } else {
      router.replace({ pathname: './tea-inspector-profile', params: accountParams });
    }
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
          <View style={styles.brandMark}>
            <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.brandLogo} />
          </View>
          <ThemedText type="smallBold" style={styles.brandName}>PureTeaAgro</ThemedText>
          <View style={styles.headerSpacer} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open alerts"
            onPress={() => navigateToTab('Alerts')}
            style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#26384A" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.greeting}>
            <View style={styles.greetingCopy}>
              <ThemedText type="small" style={styles.greetingOverline}>Good morning,</ThemedText>
              <ThemedText type="subtitle" style={styles.greetingName}>{firstName}</ThemedText>
              <ThemedText type="small" style={styles.greetingSubtitle}>
                Together for safe and sustainable tea
              </ThemedText>
            </View>
            <View pointerEvents="none" style={styles.leafWatermark}>
              <MaterialCommunityIcons name="leaf" size={128} color="#0A9A68" />
              <MaterialCommunityIcons name="leaf" size={84} color="#0A9A68" style={styles.watermarkLeaf} />
            </View>
          </View>

          <View style={styles.summaryRow}>
            <SummaryCard icon="account-group" label="Assigned Farmers" value="18" tone="green" />
            <SummaryCard icon="calendar" label="Upcoming Visits" value="5" tone="blue" />
            <SummaryCard icon="bell" label="Follow-ups Pending" value="3" tone="amber" />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="lightning-bolt" size={15} color="#07815A" />
              <ThemedText type="smallBold" style={styles.sectionTitleText}>Quick Actions</ThemedText>
            </View>
            <View style={styles.quickActions}>
              <QuickAction
                icon="account-group"
                label="View Farmers"
                primary
                onPress={() => navigateToTab('Farmers')}
              />
              <QuickAction
                icon="briefcase-plus"
                label="Record a Visit"
                onPress={() => navigateToTab('Visits')}
              />
              <QuickAction
                icon="bell"
                label="View Alerts"
                onPress={() => navigateToTab('Alerts')}
              />
            </View>
          </View>

          <View style={[styles.section, styles.visitsSection]}>
            <View style={styles.visitsHeader}>
              <View style={styles.sectionTitle}>
                <MaterialCommunityIcons name="calendar-month" size={14} color="#07815A" />
                <ThemedText type="smallBold" style={styles.sectionTitleText}>Today&apos;s Visits</ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigateToTab('Visits')}>
                <ThemedText type="smallBold" style={styles.viewAll}>View All</ThemedText>
              </Pressable>
            </View>
            <View style={styles.visitsList}>
              {todayVisits.slice(0, 3).map((visit) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Visit ${visit.name}, ${visit.location}, ${visit.time}`}
                  key={`${visit.name}-${visit.time}`}
                  onPress={() => navigateToTab('Visits')}
                  style={({ pressed }) => [styles.visitCard, pressed && styles.pressed]}>
                  <View style={styles.visitIcon}>
                    <MaterialCommunityIcons name="leaf" size={15} color="#07815A" />
                  </View>
                  <View style={styles.visitCopy}>
                    <ThemedText type="smallBold" style={styles.visitName}>{visit.name}</ThemedText>
                    <ThemedText type="small" style={styles.visitLocation}>{visit.location}</ThemedText>
                  </View>
                  <ThemedText type="smallBold" style={styles.visitTime}>{visit.time}</ThemedText>
                  <MaterialCommunityIcons name="chevron-right" size={15} color="#9BA9B9" />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {tabs.map(({ label, icon }) => {
            const selected = label === 'Home';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
                key={label}
                onPress={() => navigateToTab(label)}
                style={styles.tabButton}>
                <View style={styles.tabIconWrap}>
                  <MaterialCommunityIcons name={icon} size={19} color={selected ? '#07815A' : '#9BA9B9'} />
                  {label === 'Alerts' ? <View style={styles.tabNotificationDot} /> : null}
                </View>
                <ThemedText type="small" style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                  {label}
                </ThemedText>
                {selected ? <View style={styles.activeTabIndicator} /> : null}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 55,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#E7EEEA',
    gap: 7,
  },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#07815A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandLogo: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  brandName: {
    color: '#123B2C',
    fontSize: 14,
  },
  headerSpacer: {
    flex: 1,
  },
  notificationButton: {
    width: 34,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    right: 5,
    top: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E94552',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  greeting: {
    height: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(239,251,245,0.94)',
  },
  greetingCopy: {
    zIndex: 1,
  },
  greetingOverline: {
    color: '#53677B',
    fontSize: 9,
    lineHeight: 13,
  },
  greetingName: {
    color: '#17283A',
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '700',
  },
  greetingSubtitle: {
    color: '#54836D',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 1,
  },
  leafWatermark: {
    position: 'absolute',
    right: -22,
    top: -34,
    opacity: 0.17,
    transform: [{ rotate: '-35deg' }],
  },
  watermarkLeaf: {
    position: 'absolute',
    right: 51,
    top: 42,
    transform: [{ rotate: '70deg' }],
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 6,
  },
  summaryCard: {
    flex: 1,
    minHeight: 91,
    borderRadius: 11,
    borderWidth: 1,
    padding: 8,
  },
  summaryCard_green: {
    backgroundColor: 'rgba(241,252,247,0.94)',
    borderColor: '#D8F1E5',
  },
  summaryCard_blue: {
    backgroundColor: 'rgba(242,249,253,0.94)',
    borderColor: '#DAEAF4',
  },
  summaryCard_amber: {
    backgroundColor: 'rgba(255,252,242,0.94)',
    borderColor: '#F2E8CB',
  },
  summaryIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  summaryIcon_green: {
    backgroundColor: '#DDF8EB',
  },
  summaryIcon_blue: {
    backgroundColor: '#E1F1FB',
  },
  summaryIcon_amber: {
    backgroundColor: '#FFF0C5',
  },
  summaryLabel: {
    color: '#53647A',
    fontSize: 8,
    lineHeight: 10,
    minHeight: 21,
  },
  summaryValue: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 1,
  },
  summaryValue_green: {
    color: '#087B56',
  },
  summaryValue_blue: {
    color: '#1677B8',
  },
  summaryValue_amber: {
    color: '#B96209',
  },
  section: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  sectionTitle: {
    minHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitleText: {
    color: '#25384A',
    fontSize: 10,
    lineHeight: 14,
  },
  quickActions: {
    gap: 5,
    marginTop: 4,
  },
  quickAction: {
    minHeight: 38,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    gap: 8,
  },
  quickActionPrimary: {
    backgroundColor: '#087A58',
  },
  quickActionSecondary: {
    backgroundColor: 'rgba(240,252,246,0.88)',
    borderWidth: 1,
    borderColor: '#DDF2E8',
  },
  quickActionIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#D9F7E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  quickActionLabel: {
    flex: 1,
    color: '#254337',
    fontSize: 10,
  },
  quickActionLabelPrimary: {
    color: '#FFFFFF',
  },
  visitsSection: {
    marginTop: 9,
  },
  visitsHeader: {
    minHeight: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewAll: {
    color: '#087B56',
    fontSize: 8,
  },
  visitsList: {
    gap: 5,
  },
  visitCard: {
    minHeight: 51,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E7EEF0',
    backgroundColor: 'rgba(255,255,255,0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 7,
  },
  visitIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#E1F8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitCopy: {
    flex: 1,
    gap: 1,
  },
  visitName: {
    color: '#27384C',
    fontSize: 9,
    lineHeight: 12,
  },
  visitLocation: {
    color: '#708096',
    fontSize: 8,
    lineHeight: 11,
  },
  visitTime: {
    color: '#53657B',
    fontSize: 8,
    marginRight: 0,
  },
  bottomBar: {
    minHeight: 44,
    paddingHorizontal: 6,
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: '#E8EDF0',
    backgroundColor: 'rgba(255,255,255,0.97)',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    position: 'relative',
  },
  tabIconWrap: {
    position: 'relative',
  },
  tabLabel: {
    color: '#9BA9B9',
    fontSize: 7,
    lineHeight: 10,
  },
  tabLabelSelected: {
    color: '#07815A',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#07815A',
  },
  tabNotificationDot: {
    position: 'absolute',
    right: -2,
    top: -1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E94552',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 92,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#A6ABB3',
    marginTop: 3,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.82,
  },
});