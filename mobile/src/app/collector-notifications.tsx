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
type NotificationItem = {
  icon: IconName;
  title: string;
  message: string;
  date: string;
  tone: 'green' | 'yellow';
};

const notifications: NotificationItem[] = [
  {
    icon: 'account',
    title: 'New Assigned Collection',
    message: 'You have been assigned a new collection from Nimal Perera.',
    date: 'Today\n08:24 AM',
    tone: 'green',
  },
  {
    icon: 'check',
    title: 'Collection Confirmed',
    message: 'Collection COL-000123 has been confirmed.',
    date: 'Yesterday\n05:12 PM',
    tone: 'green',
  },
  {
    icon: 'factory',
    title: 'Factory Update',
    message: 'Main Factory is operating normally.',
    date: 'Yesterday\n10:30 AM',
    tone: 'green',
  },
  {
    icon: 'alert',
    title: 'System Alert',
    message: 'Maintenance scheduled for this weekend (Sept 13-14).',
    date: 'Sep 06\n04:15 PM',
    tone: 'yellow',
  },
  {
    icon: 'account',
    title: 'New Assigned Collection',
    message: 'You have been assigned a new collection from Kamala Silva.',
    date: 'Sep 06\n09:05 AM',
    tone: 'green',
  },
  {
    icon: 'check',
    title: 'Collection Confirmed',
    message: 'Collection COL-000121 has been confirmed.',
    date: 'Sep 05\n03:20 PM',
    tone: 'green',
  },
];

const tabs: { label: 'Home' | 'Collections' | 'Notifications' | 'Profile'; icon: IconName }[] = [
  { label: 'Home', icon: 'home-outline' },
  { label: 'Collections', icon: 'clipboard-list-outline' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Profile', icon: 'account-outline' },
];

export default function CollectorNotificationsScreen() {
  const [readItems, setReadItems] = useState<number[]>([]);

  function navigateToTab(tab: (typeof tabs)[number]['label']) {
    if (tab === 'Notifications') {
      return;
    }

    if (tab === 'Home') {
      router.replace('/collector-home');
      return;
    }

    if (tab === 'Collections') {
      router.replace('/collector-collection-history');
      return;
    }

    router.replace('/collector-profile');
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
          </View>

          <View style={styles.heading}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#1E5735" />
            </Pressable>
            <MaterialCommunityIcons name="bell-outline" size={23} color="#176B39" />
            <ThemedText type="smallBold" style={styles.title}>Notifications</ThemedText>
          </View>

          <View style={styles.notificationList}>
            {notifications.map((notification, index) => {
              const read = readItems.includes(index);
              const warning = notification.tone === 'yellow';

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: read }}
                  key={`${notification.title}-${notification.date}`}
                  onPress={() => setReadItems((current) => (
                    current.includes(index) ? current : [...current, index]
                  ))}
                  style={({ pressed }) => [
                    styles.notificationCard,
                    read && styles.notificationCardRead,
                    pressed && styles.pressed,
                  ]}>
                  <View style={[
                    styles.notificationIcon,
                    warning ? styles.warningIcon : styles.greenIcon,
                  ]}>
                    <MaterialCommunityIcons
                      name={notification.icon}
                      size={22}
                      color={warning ? '#E9A314' : '#20803D'}
                    />
                  </View>

                  <View style={styles.notificationBody}>
                    <ThemedText type="smallBold" style={styles.notificationTitle}>
                      {notification.title}
                    </ThemedText>
                    <ThemedText type="small" style={styles.notificationMessage}>
                      {notification.message}
                    </ThemedText>
                  </View>

                  <View style={styles.notificationAside}>
                    <ThemedText type="small" style={styles.notificationDate}>
                      {notification.date}
                    </ThemedText>
                    <MaterialCommunityIcons name="chevron-right" size={19} color="#47775A" />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const selected = tab.label === 'Notifications';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={tab.label}
                onPress={() => navigateToTab(tab.label)}
                style={styles.tabButton}>
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={20}
                  color={selected ? '#14783D' : '#718A7D'}
                />
                <ThemedText type="small" style={[styles.tabLabel, selected && styles.selectedTabLabel]}>
                  {tab.label}
                </ThemedText>
                {selected && <View style={styles.activeTabIndicator} />}
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
    backgroundColor: '#F3FBF2',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(246, 253, 246, 0.79)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 10,
  },
  brand: {
    height: 73,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  logo: {
    width: 92,
    height: 70,
  },
  heading: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 9,
  },
  backButton: {
    width: 27,
    height: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    color: '#17563A',
    fontSize: 18,
    lineHeight: 24,
  },
  notificationList: {
    gap: 8,
  },
  notificationCard: {
    minHeight: 72,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#DCECE0',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  notificationCardRead: {
    backgroundColor: 'rgba(248,252,248,0.96)',
  },
  notificationIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  greenIcon: {
    backgroundColor: '#E2F5DE',
  },
  warningIcon: {
    backgroundColor: '#FFF0C8',
  },
  notificationBody: {
    flex: 1,
    minWidth: 0,
    paddingRight: 3,
  },
  notificationTitle: {
    color: '#28563C',
    fontSize: 10,
    lineHeight: 14,
  },
  notificationMessage: {
    color: '#728479',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },
  notificationAside: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginLeft: 2,
  },
  notificationDate: {
    color: '#829087',
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'right',
  },
  bottomNav: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E0ECE2',
    paddingHorizontal: 7,
    paddingBottom: 3,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    color: '#718A7D',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },
  selectedTabLabel: {
    color: '#14783D',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 31,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#14783D',
  },
  pressed: {
    opacity: 0.86,
  },
});
