import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type NotificationTone = 'orange' | 'green' | 'blue' | 'purple' | 'slate';

const notifications: { icon: IconName; title: string; message: string; count: string; tone: NotificationTone }[] = [
  { icon: 'alert-outline', title: 'Compliance', message: 'Chemical record needs attention', count: '2', tone: 'orange' },
  { icon: 'sprout-outline', title: 'Harvest', message: 'Your land is eligible for harvesting', count: '1', tone: 'green' },
  { icon: 'clipboard-check-outline', title: 'Inspection', message: 'Inspector visit scheduled', count: '1', tone: 'blue' },
  { icon: 'file-document-outline', title: 'Record', message: 'Agrochemical record approved', count: '1', tone: 'purple' },
  { icon: 'cog-outline', title: 'System', message: 'New approved chemical information', count: '1', tone: 'slate' },
];

export default function NotificationsScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.title}>Notifications</ThemedText>
            <MaterialCommunityIcons name="leaf" size={24} color="#168B3E" />
          </View>
          <View style={styles.notificationList}>
            {notifications.map((notification) => <NotificationRow key={notification.title} {...notification} />)}
          </View>
        </ScrollView>
        <View style={styles.bottomNav}>
          <NavItem icon="home-outline" label="Home" onPress={() => router.replace('/farmer-dashboard')} />
          <NavItem icon="history" label="History" onPress={() => router.push('/inspection-status')} />
          <NavItem icon="bell" label="Notifications" active />
          <NavItem icon="account-outline" label="Profile" onPress={() => router.push('/farmer-profile')} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function NotificationRow({ icon, title, message, count, tone }: { icon: IconName; title: string; message: string; count: string; tone: NotificationTone }) {
  return <Pressable accessibilityRole="button" style={({ pressed }) => [styles.notificationRow, pressed && styles.pressed]}><View style={[styles.notificationIcon, styles[`${tone}Icon`]]}><MaterialCommunityIcons name={icon} size={22} color="#FFF" /></View><View style={styles.copy}><ThemedText type="smallBold" style={styles.notificationTitle}>{title}</ThemedText><ThemedText type="small" style={styles.message}>{message}</ThemedText></View><View style={[styles.count, styles[`${tone}Count`]]}><ThemedText type="smallBold" style={styles.countText}>{count}</ThemedText></View></Pressable>;
}

function NavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={22} color={active ? '#168B3E' : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, active && styles.activeLabel]}>{label}</ThemedText>{active && <View style={styles.indicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#173F25', fontSize: 18 },
  notificationList: { gap: 10 },
  notificationRow: { minHeight: 82, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', gap: 11 },
  notificationIcon: { width: 42, height: 42, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  orangeIcon: { backgroundColor: '#F36B2B' },
  greenIcon: { backgroundColor: '#159447' },
  blueIcon: { backgroundColor: '#287EDB' },
  purpleIcon: { backgroundColor: '#7742D6' },
  slateIcon: { backgroundColor: '#58738C' },
  copy: { flex: 1 },
  notificationTitle: { color: '#244D3A', fontSize: 13 },
  message: { color: '#789080', fontSize: 10, marginTop: 3 },
  count: { width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  orangeCount: { backgroundColor: '#FFF7F1', borderColor: '#FFD4BE' },
  greenCount: { backgroundColor: '#F1FFF3', borderColor: '#BEE8C5' },
  blueCount: { backgroundColor: '#F3F9FF', borderColor: '#C9E1FA' },
  purpleCount: { backgroundColor: '#FAF7FF', borderColor: '#DED1FA' },
  slateCount: { backgroundColor: '#F5F8FA', borderColor: '#D5E0E7' },
  countText: { color: '#168B3E', fontSize: 12 },
  bottomNav: { height: 61, borderTopWidth: 1, borderTopColor: '#D9E9DC', backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 58 },
  navLabel: { color: '#648074', fontSize: 8, marginTop: 2 },
  activeLabel: { color: '#168B3E', fontWeight: '700' },
  indicator: { width: 20, height: 2, borderRadius: 1, backgroundColor: '#168B3E', marginTop: 3 },
  pressed: { opacity: 0.8 },
});
