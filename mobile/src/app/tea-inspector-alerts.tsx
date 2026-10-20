import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
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
type AlertTone = 'green' | 'amber' | 'blue';
type InspectorAlert = {
  id: string;
  title: string;
  message: string;
  date: string;
  badge: string;
  icon: IconName;
  tone: AlertTone;
  unread: boolean;
  destination: 'Visits' | 'Farmers' | null;
};

const initialAlerts: InspectorAlert[] = [
  {
    id: 'visit-tomorrow',
    title: 'Upcoming Visit',
    message: 'You have a visit with Nimal Perera tomorrow (03 Oct 2026).',
    date: '02 Oct 2026 • 08:30 AM',
    badge: 'Upcoming',
    icon: 'calendar-check',
    tone: 'green',
    unread: true,
    destination: 'Visits',
  },
  {
    id: 'follow-up',
    title: 'Follow-up Due',
    message: 'Follow-up visit required for Sunil Silva (Next visit: 16 Oct 2026).',
    date: '02 Oct 2026 • 07:45 AM',
    badge: 'Important',
    icon: 'alert',
    tone: 'amber',
    unread: true,
    destination: 'Visits',
  },
  {
    id: 'advisory',
    title: 'Agricultural Advisory',
    message: 'New advisory: Proper use of approved fertilizers for tea.',
    date: '01 Oct 2026 • 11:20 AM',
    badge: 'New',
    icon: 'leaf',
    tone: 'green',
    unread: true,
    destination: 'Farmers',
  },
  {
    id: 'chemical-guidance',
    title: 'Approved Chemical Guidance',
    message: 'Updated list of approved chemicals available in the system.',
    date: '30 Sep 2026 • 04:15 PM',
    badge: 'Updated',
    icon: 'flask-outline',
    tone: 'blue',
    unread: false,
    destination: null,
  },
  {
    id: 'system',
    title: 'System Notification',
    message: 'Your allocation for this season has been updated successfully.',
    date: '28 Sep 2026 • 10:00 AM',
    badge: 'System',
    icon: 'cog',
    tone: 'blue',
    unread: false,
    destination: null,
  },
];

const tabs: { label: DashboardTab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Farmers', icon: 'account-group-outline' },
  { label: 'Visits', icon: 'calendar-month-outline' },
  { label: 'Alerts', icon: 'bell-outline' },
  { label: 'Profile', icon: 'account-outline' },
];

function AlertCard({
  alert,
  onPress,
}: {
  alert: InspectorAlert;
  onPress: () => void;
}) {
  const iconColor = alert.tone === 'green' ? '#10A976' : alert.tone === 'amber' ? '#E99810' : '#3682F2';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${alert.title}${alert.unread ? ', unread' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}>
      <View style={[styles.alertIconBox, styles[`alertIconBox_${alert.tone}`]]}>
        <MaterialCommunityIcons name={alert.icon} size={17} color={iconColor} />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertHeading}>
          <ThemedText type="smallBold" style={styles.alertTitle}>{alert.title}</ThemedText>
          <View style={[styles.alertBadge, styles[`alertBadge_${alert.tone}`]]}>
            <ThemedText type="smallBold" style={[styles.alertBadgeText, styles[`alertBadgeText_${alert.tone}`]]}>
              {alert.badge}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" style={styles.alertMessage}>{alert.message}</ThemedText>
        <ThemedText type="small" style={styles.alertDate}>{alert.date}</ThemedText>
      </View>
    </Pressable>
  );
}

export default function TeaInspectorAlertsScreen() {
  const { fullName, inspectorId, district, mobile, organization } = useLocalSearchParams<{
    fullName?: string;
    inspectorId?: string;
    district?: string;
    mobile?: string;
    organization?: string;
  }>();
  const [alerts, setAlerts] = useState(initialAlerts);
  const unreadCount = alerts.filter((alert) => alert.unread).length;

  const navigateToTab = (tab: Exclude<DashboardTab, 'Alerts'>) => {
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
    if (tab === 'Profile') {
      router.replace({
        pathname: './tea-inspector-profile',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    router.replace({
      pathname: './tea-inspector-dashboard',
      params: { tab, fullName, inspectorId, district, mobile, organization },
    });
  };

  const openAlert = (alert: InspectorAlert) => {
    setAlerts((current) => current.map((item) => (
      item.id === alert.id ? { ...item, unread: false } : item
    )));
    if (alert.destination) navigateToTab(alert.destination);
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
          <ThemedText type="smallBold" style={styles.headerTitle}>Alerts</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mark all alerts as read"
            disabled={!unreadCount}
            onPress={() => setAlerts((current) => current.map((alert) => ({ ...alert, unread: false })))}
            style={({ pressed }) => [
              styles.markReadButton,
              !unreadCount && styles.markReadButtonDisabled,
              pressed && styles.pressed,
            ]}>
            <MaterialCommunityIcons name="check-all" size={12} color={unreadCount ? '#168454' : '#82938A'} />
            <ThemedText type="smallBold" style={[styles.markReadText, !unreadCount && styles.markReadTextDisabled]}>
              Mark All as Read
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onPress={() => openAlert(alert)} />
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {tabs.map(({ label, icon }) => {
            const selected = label === 'Alerts';
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
                <View>
                  <MaterialCommunityIcons name={icon} size={20} color={selected ? '#07815A' : '#99A9BA'} />
                  {label === 'Alerts' && unreadCount > 0 ? <View style={styles.tabNotificationDot} /> : null}
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
    backgroundColor: '#F6FAF6',
  },
  backgroundWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.53)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 55,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#1D2D43',
    fontSize: 17,
    lineHeight: 22,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#12A567',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#14704C',
    fontSize: 9,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingBottom: 13,
  },
  markReadButton: {
    minHeight: 24,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#1AA56F',
    backgroundColor: 'rgba(255,255,255,0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  markReadButtonDisabled: {
    borderColor: '#D5E1D9',
  },
  markReadText: {
    color: '#168454',
    fontSize: 8,
    lineHeight: 11,
  },
  markReadTextDisabled: {
    color: '#82938A',
  },
  alertsList: {
    gap: 8,
  },
  alertCard: {
    minHeight: 74,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 9,
    gap: 9,
    shadowColor: '#263B31',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  alertIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  alertIconBox_green: {
    backgroundColor: '#DFF7EC',
  },
  alertIconBox_amber: {
    backgroundColor: '#FFF1C9',
  },
  alertIconBox_blue: {
    backgroundColor: '#E1EEFF',
  },
  alertContent: {
    flex: 1,
    gap: 2,
  },
  alertHeading: {
    minHeight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  alertTitle: {
    flex: 1,
    color: '#253449',
    fontSize: 9,
    lineHeight: 13,
  },
  alertBadge: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  alertBadge_green: {
    backgroundColor: '#E1F6EA',
  },
  alertBadge_amber: {
    backgroundColor: '#FFF1D8',
  },
  alertBadge_blue: {
    backgroundColor: '#EAF2FF',
  },
  alertBadgeText: {
    fontSize: 6,
    lineHeight: 9,
  },
  alertBadgeText_green: {
    color: '#168454',
  },
  alertBadgeText_amber: {
    color: '#C77B08',
  },
  alertBadgeText_blue: {
    color: '#3975C6',
  },
  readState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  readDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  unreadDot: {
    backgroundColor: '#F29400',
  },
  readDotMuted: {
    backgroundColor: '#BDC8D2',
  },
  readLabel: {
    fontSize: 7,
    lineHeight: 10,
  },
  unreadLabel: {
    color: '#C77B08',
  },
  readLabelMuted: {
    color: '#A0ADBA',
  },
  alertMessage: {
    color: '#6B7D91',
    fontSize: 8,
    lineHeight: 12,
  },
  alertDate: {
    color: '#96A5B3',
    fontSize: 7,
    lineHeight: 10,
    marginTop: 2,
  },
  bottomBar: {
    minHeight: 54,
    paddingHorizontal: 7,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226,234,231,0.9)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    position: 'relative',
  },
  tabLabel: {
    color: '#99A9BA',
    fontSize: 8,
    lineHeight: 12,
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
  tabNotificationDot: {
    position: 'absolute',
    right: -2,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E94552',
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
});
