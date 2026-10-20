import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState, type ComponentProps } from 'react';
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
type NotificationFilter = 'All' | 'Unread' | 'Read';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: IconName;
  color: string;
  state: 'New' | 'Unread' | 'Read';
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 'chemical-approved',
    title: 'Chemical order approved',
    description: 'Your order #CH-0125 has been approved.',
    time: 'Today, 08:15 AM',
    icon: 'flask-outline',
    color: '#18AE78',
    state: 'New',
    unread: true,
  },
  {
    id: 'chemical-rejected',
    title: 'Chemical order rejected',
    description: 'Pesticide order #CH-0119 was rejected.',
    time: 'Yesterday, 04:32 PM',
    icon: 'flask-outline',
    color: '#F05E73',
    state: 'Unread',
    unread: true,
  },
  {
    id: 'field-diary',
    title: 'Field diary submitted',
    description: 'Field diary FD-00125 submitted by FO.',
    time: 'Yesterday, 11:20 AM',
    icon: 'file-document-outline',
    color: '#3985F4',
    state: 'Read',
    unread: false,
  },
  {
    id: 'phi-check',
    title: 'PHI verification required',
    description: 'Batch BATCH-00126 needs PHI check.',
    time: '12 Sep 2026, 02:45 PM',
    icon: 'shield-check-outline',
    color: '#F2A20B',
    state: 'Unread',
    unread: true,
  },
  {
    id: 'batch-update',
    title: 'Processing batch requires update',
    description: 'Batch BATCH-00123 requires update.',
    time: '11 Sep 2026, 10:30 AM',
    icon: 'cog-outline',
    color: '#A456EA',
    state: 'Read',
    unread: false,
  },
  {
    id: 'factory-instruction',
    title: 'Important factory instruction',
    description: 'New guidelines for tea dispatch.',
    time: '10 Sep 2026, 09:00 AM',
    icon: 'information-outline',
    color: '#13B9B4',
    state: 'Read',
    unread: false,
  },
  {
    id: 'dispatch-record',
    title: 'Tea dispatch record requires edit',
    description: 'Dispatch record DISP-00045 needs check.',
    time: '07 Sep 2026, 03:15 PM',
    icon: 'truck-delivery-outline',
    color: '#FF7A31',
    state: 'Unread',
    unread: true,
  },
];

const bottomNavigation: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

export default function FactoryOfficerNotificationsScreen() {
  const [filter, setFilter] = useState<NotificationFilter>('All');
  const [notifications, setNotifications] = useState(initialNotifications);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === 'Unread') return notification.unread;
        if (filter === 'Read') return !notification.unread;
        return true;
      }),
    [filter, notifications],
  );

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false, state: 'Read' }
          : notification,
      ),
    );
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
            accessibilityLabel="Back to dashboard"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#3B5144" />
          </Pressable>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={15} color="#07824D" />
            <ThemedText type="smallBold" style={styles.brandName}>
              PureTeaAgro
            </ThemedText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.bellButton}>
            <MaterialCommunityIcons name="bell-badge" size={19} color="#147A4A" />
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <ThemedText type="smallBold" style={styles.title}>
            Notifications
          </ThemedText>
          <ThemedText type="small" style={styles.unreadSummary}>
            {notifications.filter((item) => item.unread).length} unread
          </ThemedText>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Unread', 'Read'] as NotificationFilter[]).map((item) => {
            const selected = filter === item;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.filterButton, selected && styles.filterButtonSelected]}>
                <ThemedText type="smallBold" style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {item}
                </ThemedText>
                {item === 'Unread' ? (
                  <View style={styles.filterCount}>
                    <ThemedText type="smallBold" style={styles.filterCountText}>
                      {notifications.filter((notification) => notification.unread).length}
                    </ThemedText>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}>
          {visibleNotifications.map((notification) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${notification.title}. ${notification.unread ? 'Unread' : 'Read'}`}
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={({ pressed }) => [styles.notificationCard, pressed && styles.cardPressed]}>
              <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}17` }]}>
                <MaterialCommunityIcons name={notification.icon} size={17} color={notification.color} />
              </View>
              <View style={styles.notificationBody}>
                <ThemedText type="smallBold" style={styles.notificationTitle}>
                  {notification.title}
                </ThemedText>
                <ThemedText type="small" style={styles.notificationDescription}>
                  {notification.description}
                </ThemedText>
                <ThemedText type="small" style={styles.notificationTime}>
                  {notification.time}
                </ThemedText>
              </View>
              <View style={styles.notificationTrailing}>
                <View
                  style={[
                    styles.stateBadge,
                    notification.state === 'New' && styles.newBadge,
                    notification.state === 'Unread' && styles.unreadBadge,
                    notification.state === 'Read' && styles.readBadge,
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={[
                      styles.stateBadgeText,
                      notification.state === 'New' && styles.newBadgeText,
                      notification.state === 'Unread' && styles.unreadBadgeText,
                      notification.state === 'Read' && styles.readBadgeText,
                    ]}>
                    {notification.state}
                  </ThemedText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={17} color="#B2BDB5" />
              </View>
            </Pressable>
          ))}
          {visibleNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bell-check-outline" size={28} color="#7C9C86" />
              <ThemedText type="small" style={styles.emptyText}>
                No {filter.toLowerCase()} notifications.
              </ThemedText>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavigation.map(([label, icon]) => {
            const selected = label === 'Alerts';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                key={label}
                onPress={() => {
                  if (label === 'Home') router.replace('/factory-officer-dashboard');
                  else if (label === 'Books') router.replace('/factory-books');
                  else if (label === 'Reports') router.replace('/factory-reports');
                  else if (label === 'Profile') router.replace('/factory-officer-profile');
                  else if (label !== 'Alerts') router.replace('/factory-officer-dashboard');
                }}
                style={styles.navItem}>
                <View style={styles.navIconWrap}>
                  <MaterialCommunityIcons name={icon} size={18} color={selected ? '#07824D' : '#7B8780'} />
                  {label === 'Alerts' && notifications.some((item) => item.unread) ? (
                    <View style={styles.navDot} />
                  ) : null}
                </View>
                <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(249, 253, 247, 0.76)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },
  backButton: {
    width: 28,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  brandName: {
    color: '#087344',
    fontSize: 10,
  },
  bellButton: {
    width: 28,
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleRow: {
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },
  title: {
    color: '#26352C',
    fontSize: 16,
  },
  unreadSummary: {
    color: '#718077',
    fontSize: 9,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  filterButton: {
    minWidth: 58,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EAE5',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  filterButtonSelected: {
    borderColor: '#07824D',
    backgroundColor: '#07824D',
  },
  filterText: {
    color: '#69766D',
    fontSize: 9,
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  filterCount: {
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#E8F5EC',
  },
  filterCountText: {
    color: '#087344',
    fontSize: 7,
  },
  notificationsList: {
    flexGrow: 1,
    gap: 6,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 9,
  },
  notificationCard: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(225, 233, 225, 0.9)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#344B39',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.82,
  },
  notificationIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBody: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    color: '#35443A',
    fontSize: 9,
    lineHeight: 12,
  },
  notificationDescription: {
    color: '#6F7B73',
    fontSize: 8,
    lineHeight: 11,
    marginTop: 1,
  },
  notificationTime: {
    color: '#9AA39C',
    fontSize: 7,
    lineHeight: 10,
    marginTop: 2,
  },
  notificationTrailing: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minWidth: 39,
  },
  stateBadge: {
    minWidth: 25,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadge: {
    backgroundColor: '#DDF5E6',
  },
  unreadBadge: {
    backgroundColor: '#E5F1FF',
  },
  readBadge: {
    backgroundColor: '#EDF1F4',
  },
  stateBadgeText: {
    fontSize: 7,
    lineHeight: 9,
  },
  newBadgeText: {
    color: '#0A9254',
  },
  unreadBadgeText: {
    color: '#3478D3',
  },
  readBadgeText: {
    color: '#697782',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    gap: 8,
  },
  emptyText: {
    color: '#718077',
    fontSize: 11,
  },
  bottomNav: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E4EAE4',
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  navItem: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  navIconWrap: {
    position: 'relative',
  },
  navDot: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F44356',
  },
  navLabel: {
    color: '#79847D',
    fontSize: 7,
    lineHeight: 10,
  },
  navLabelSelected: {
    color: '#07824D',
    fontWeight: '700',
  },
});
