import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Tone = 'green' | 'blue' | 'purple' | 'orange' | 'yellow';

const stats: { icon: IconName; label: string; value: string; detail: string; tone: Tone }[] = [
  { icon: 'account-group-outline', label: 'Total Users', value: '245', detail: 'All registered users', tone: 'green' },
  { icon: 'account-tie-hat-outline', label: 'Active Farmers', value: '128', detail: 'Active farmer accounts', tone: 'green' },
  { icon: 'account-search-outline', label: 'Active Inspectors', value: '32', detail: 'Active inspector accounts', tone: 'green' },
  { icon: 'leaf', label: 'Leaf Collectors', value: '18', detail: 'Registered collectors', tone: 'green' },
  { icon: 'file-clock-outline', label: 'Pending Approvals', value: '12', detail: 'Accounts awaiting approval', tone: 'orange' },
  { icon: 'alert-outline', label: 'System Alerts', value: '3', detail: 'Important issues', tone: 'yellow' },
];

const actions: { icon: IconName; label: string; tone: Tone }[] = [
  { icon: 'account-cog-outline', label: 'Manage Users', tone: 'green' },
  { icon: 'check-circle-outline', label: 'Approve Accounts', tone: 'blue' },
  { icon: 'chart-line', label: 'View System Activity', tone: 'purple' },
  { icon: 'bell-outline', label: 'Send Notification', tone: 'green' },
];

export default function AdminDashboardScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Image source={require('@/assets/images/icon.png')} style={styles.brandLogo} resizeMode="contain" />
              <View>
                <ThemedText type="small" style={styles.greeting}>Good Morning,</ThemedText>
                <ThemedText type="subtitle" style={styles.adminName}>Administrator</ThemedText>
                <ThemedText type="small" style={styles.headerCaption}>PureTeaAgro System Overview</ThemedText>
              </View>
            </View>
            <Pressable accessibilityLabel="Notifications" onPress={() => Alert.alert('System Notifications', 'You have 3 system alerts.')} style={styles.notificationButton}>
              <MaterialCommunityIcons name="bell-outline" size={23} color="#176338" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          <View style={styles.statsGrid}>{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}><MaterialCommunityIcons name="flash-outline" size={23} color="#168B3E" /><ThemedText type="smallBold" style={styles.sectionTitle}>Quick Actions</ThemedText></View>
            <Pressable onPress={() => Alert.alert('Quick Actions', 'Choose an action from the dashboard.')}><ThemedText type="smallBold" style={styles.viewAll}>View All ›</ThemedText></Pressable>
          </View>
          <View style={styles.actionsGrid}>{actions.map((action) => <QuickAction key={action.label} {...action} />)}</View>

          <View style={styles.healthCard}>
            <View style={styles.healthHeader}><View style={styles.healthTitleRow}><MaterialCommunityIcons name="heart-pulse" size={20} color="#168B3E" /><ThemedText type="smallBold" style={styles.healthTitle}>System Health Summary</ThemedText></View><Pressable onPress={() => Alert.alert('System Health', 'All monitored services are operational.')}><ThemedText type="smallBold" style={styles.viewAll}>View Details</ThemedText></Pressable></View>
            <View style={styles.healthItems}><HealthItem label="Backend API" /><HealthItem label="Database" /><HealthItem label="Authentication" /><HealthItem label="Notifications" /></View>
          </View>
        </ScrollView>
        <View style={styles.bottomNav}>
          <AdminNavItem icon="home" label="Home" active />
          <AdminNavItem icon="account-group-outline" label="Users" onPress={() => router.push('/admin-users')} />
          <AdminNavItem icon="shield-check-outline" label="Approvals" onPress={() => router.push('/admin-approvals')} />
          <AdminNavItem icon="chart-line" label="Activity" onPress={() => Alert.alert('System Activity', 'System activity will be available here.')} />
          <AdminNavItem icon="cog-outline" label="Settings" onPress={() => Alert.alert('Settings', 'Administrator settings will be available here.')} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function StatCard({ icon, label, value, detail, tone }: (typeof stats)[number]) {
  return <Pressable accessibilityRole="button" onPress={() => Alert.alert(label, detail)} style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}><View style={[styles.statIcon, styles[`${tone}Icon`]]}><MaterialCommunityIcons name={icon} size={22} color={tone === 'orange' ? '#D7552C' : tone === 'yellow' ? '#D69B00' : '#168B3E'} /></View><View style={styles.statCopy}><ThemedText type="smallBold" style={styles.statLabel}>{label}</ThemedText><ThemedText type="subtitle" style={styles.statValue}>{value}</ThemedText><ThemedText type="small" style={styles.statDetail}>{detail}</ThemedText></View><MaterialCommunityIcons name="chevron-right" size={19} color="#39785B" /></Pressable>;
}

function QuickAction({ icon, label, tone }: (typeof actions)[number]) {
  return <Pressable accessibilityRole="button" onPress={label === 'Manage Users' ? () => router.push('/admin-users') : () => Alert.alert(label, `${label} is ready for administrator actions.`)} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}><View style={[styles.actionIcon, styles[`${tone}ActionIcon`]]}><MaterialCommunityIcons name={icon} size={23} color="#FFF" /></View><ThemedText type="smallBold" style={styles.actionText}>{label}</ThemedText></Pressable>;
}

function HealthItem({ label }: { label: string }) {
  return <View style={styles.healthItem}><ThemedText type="smallBold" style={styles.healthLabel}>{label}</ThemedText><View style={styles.operational}><View style={styles.statusDot} /><ThemedText type="small" style={styles.operationalText}>Operational</ThemedText></View></View>;
}

function AdminNavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={22} color={active ? '#168B3E' : '#7190A7'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F5FFF6', opacity: 0.68 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 18 },
  header: { minHeight: 118, borderRadius: 18, backgroundColor: 'rgba(234, 255, 237, 0.85)', paddingHorizontal: 12, paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandLogo: { width: 68, height: 68 },
  greeting: { color: '#1B7740', fontSize: 12 },
  adminName: { color: '#174A2C', fontSize: 25, lineHeight: 29, fontWeight: '800' },
  headerCaption: { color: '#4F7960', fontSize: 11 },
  notificationButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2FFF3', alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: '#E32B2B' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { width: '48.5%', minHeight: 91, borderRadius: 13, borderWidth: 1, borderColor: '#D2EBDD', backgroundColor: 'rgba(255,255,255,0.91)', padding: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statIcon: { width: 37, height: 37, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  greenIcon: { backgroundColor: '#DDF7E2' },
  blueIcon: { backgroundColor: '#E0F3FF' },
  purpleIcon: { backgroundColor: '#EEE9FF' },
  orangeIcon: { backgroundColor: '#FFE5DF' },
  yellowIcon: { backgroundColor: '#FFF0C6' },
  statCopy: { flex: 1 },
  statLabel: { color: '#276044', fontSize: 10, lineHeight: 13 },
  statValue: { color: '#174A2C', fontSize: 22, lineHeight: 25, fontWeight: '800' },
  statDetail: { color: '#739483', fontSize: 8, lineHeight: 11 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { color: '#174A2C', fontSize: 16 },
  viewAll: { color: '#39785B', fontSize: 10 },
  actionsGrid: { flexDirection: 'row', gap: 8 },
  actionCard: { flex: 1, minHeight: 83, borderRadius: 11, borderWidth: 1, borderColor: '#D2EBDD', backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', padding: 7, gap: 5 },
  actionIcon: { width: 37, height: 37, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  greenActionIcon: { backgroundColor: '#55B96C' },
  blueActionIcon: { backgroundColor: '#3D9DD1' },
  purpleActionIcon: { backgroundColor: '#8176D8' },
  orangeActionIcon: { backgroundColor: '#E9784B' },
  yellowActionIcon: { backgroundColor: '#E2AC28' },
  actionText: { color: '#276044', fontSize: 9, textAlign: 'center' },
  healthCard: { borderRadius: 13, borderWidth: 1, borderColor: '#D2EBDD', backgroundColor: 'rgba(255,255,255,0.9)', marginTop: 14, padding: 12 },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  healthTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  healthTitle: { color: '#276044', fontSize: 12 },
  healthItems: { flexDirection: 'row', justifyContent: 'space-between' },
  healthItem: { flex: 1, borderRightWidth: 1, borderRightColor: '#E1F0E4', paddingHorizontal: 5 },
  healthLabel: { color: '#376950', fontSize: 8, textAlign: 'center' },
  operational: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#159447' },
  operationalText: { color: '#159447', fontSize: 8 },
  bottomNav: { height: 68, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#7190A7', fontSize: 9, marginTop: 2 },
  navLabelActive: { color: '#168B3E', fontWeight: '700' },
  navIndicator: { width: 28, height: 2, backgroundColor: '#168B3E', borderRadius: 2, marginTop: 4 },
  pressed: { opacity: 0.78 },
});
