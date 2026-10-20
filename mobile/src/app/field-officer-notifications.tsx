import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

type Notification = {
  icon: IconName;
  title: string;
  message: string;
  date: string;
  status: string;
  tone: 'green' | 'yellow' | 'blue' | 'purple';
  unread?: boolean;
};

const notifications: Notification[] = [
  {
    icon: 'account-check-outline',
    title: 'Field visit assigned',
    message: 'You have been assigned a field visit for Nimal Perera.',
    date: '12 Sep 2026 • 09:15 AM',
    status: 'New',
    tone: 'green',
    unread: true,
  },
  {
    icon: 'file-document-outline',
    title: 'Collection record needs attention',
    message: 'One collection record requires review and verification.',
    date: '11 Sep 2026 • 04:32 PM',
    status: 'Unread',
    tone: 'yellow',
    unread: true,
  },
  {
    icon: 'flag-outline',
    title: 'New instruction from Manager',
    message: 'Please check the updated guidelines for agrochemical records.',
    date: '10 Sep 2026 • 11:20 AM',
    status: 'Unread',
    tone: 'blue',
    unread: true,
  },
  {
    icon: 'calendar-month-outline',
    title: 'Daily report reminder',
    message: 'Submit your daily field report before end of day.',
    date: '10 Sep 2026 • 08:00 AM',
    status: 'Read',
    tone: 'purple',
  },
];

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <Pressable
      accessibilityLabel={`${notification.title}. ${notification.message}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.notificationCard, pressed && styles.pressed]}>
      <View style={[styles.notificationIcon, styles[`${notification.tone}Icon`]]}>
        <MaterialCommunityIcons
          name={notification.icon}
          size={20}
          color={styles[`${notification.tone}IconColor`].color}
        />
      </View>
      <View style={styles.notificationCopy}>
        <View style={styles.notificationTitleRow}>
          <ThemedText type="smallBold" style={styles.notificationTitle}>
            {notification.title}
          </ThemedText>
          <View style={[styles.statusBadge, styles[`${notification.tone}Badge`]]}>
            <ThemedText style={[styles.statusText, styles[`${notification.tone}Text`]]}>
              {notification.status}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.message}>{notification.message}</ThemedText>
        <ThemedText style={styles.date}>{notification.date}</ThemedText>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={19} color="#91A8B1" />
      {notification.unread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default function FieldOfficerNotificationsScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView bounces={false} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#2D4554" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>Notifications</ThemedText>
              <Image accessibilityLabel="PureTeaAgro" source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
            </View>

            <View style={styles.notificationList}>
              {notifications.map((notification) => (
                <NotificationCard key={notification.title} notification={notification} />
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.32)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  content: { paddingBottom: 16 },
  header: { height: 66, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: 'rgba(250,255,251,0.72)' },
  backButton: { width: 30, height: 32, justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#283D4B', fontSize: 18, lineHeight: 24, marginLeft: 5 },
  logo: { width: 72, height: 22 },
  notificationList: { gap: 9, paddingHorizontal: 9, paddingTop: 9 },
  notificationCard: { minHeight: 88, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.94)', borderWidth: 1, borderColor: '#E0F0E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 10 },
  notificationIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  greenIcon: { backgroundColor: '#DDF8E9' },
  yellowIcon: { backgroundColor: '#FFF2C9' },
  blueIcon: { backgroundColor: '#DDF2FF' },
  purpleIcon: { backgroundColor: '#F0E2FF' },
  greenIconColor: { color: '#0B9A64' },
  yellowIconColor: { color: '#E28A00' },
  blueIconColor: { color: '#1A9BD2' },
  purpleIconColor: { color: '#9346E6' },
  notificationCopy: { flex: 1, minWidth: 0 },
  notificationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  notificationTitle: { color: '#263B49', fontSize: 9, lineHeight: 12, flex: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  greenBadge: { backgroundColor: '#D9F5E5' },
  yellowBadge: { backgroundColor: '#DDF4FF' },
  blueBadge: { backgroundColor: '#DDF4FF' },
  purpleBadge: { backgroundColor: '#F0DFFF' },
  statusText: { fontSize: 7, lineHeight: 9 },
  greenText: { color: '#1A9960' },
  yellowText: { color: '#167BAE' },
  blueText: { color: '#167BAE' },
  purpleText: { color: '#9346E6' },
  message: { color: '#73858D', fontSize: 8, lineHeight: 11, marginTop: 3 },
  date: { color: '#9BAAB0', fontSize: 7, lineHeight: 10, marginTop: 5 },
  unreadDot: { position: 'absolute', top: 12, left: 44, width: 5, height: 5, borderRadius: 3, backgroundColor: '#F04E5E' },
  pressed: { opacity: 0.82 },
});
