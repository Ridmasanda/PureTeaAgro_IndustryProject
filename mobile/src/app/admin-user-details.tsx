import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type User = { name: string; id: string; role: string; phone: string; location: string; icon: IconName; tone: 'green' | 'blue' | 'purple' };

const users: User[] = [
  { name: 'Nimal Perera', id: 'FRM-0021', role: 'Farmer', phone: '+94 77 123 4567', location: 'Galle', icon: 'account-tie-hat', tone: 'green' },
  { name: 'Kamalani Silva', id: 'INSP-0045', role: 'Tea Inspector', phone: '+94 76 987 6543', location: 'Kandy', icon: 'account-search', tone: 'blue' },
  { name: 'Sampath Wickramasinghe', id: 'COL-0032', role: 'Leaf Collector', phone: '+94 77 222 4455', location: 'Matara', icon: 'leaf', tone: 'green' },
  { name: 'Kasun Jayasinghe', id: 'ADM-0007', role: 'Administrator', phone: '+94 70 556 7788', location: 'Colombo', icon: 'account-tie', tone: 'purple' },
];

export default function AdminUserDetailsScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const user = users.find((item) => item.id === userId) ?? users[0];
  const detailRows: [IconName, string, string][] = [
    ['account-outline', 'Full Name', user.name],
    ['card-account-details-outline', 'NIC', user.id === 'FRM-0021' ? '987654321V' : 'Not provided'],
    ['phone-outline', 'Contact', user.phone],
    ['account-key-outline', 'Role', user.role],
    ['calendar-outline', 'Registration Date', '2025-08-09'],
    ['clock-check-outline', 'Account Status', 'Active'],
    ['domain', 'Organization', user.role === 'Farmer' ? 'Thalawakale Tea Factory' : 'PureTeaAgro'],
    ['login', 'Last Login', '2025-09-08  08:32 AM'],
  ];

  return <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}><StatusBar style="dark" /><View pointerEvents="none" style={styles.overlay} /><SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.header}><Pressable accessibilityLabel="Go back to user management" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" /></Pressable><ThemedText type="smallBold" style={styles.title}>User Details</ThemedText><View style={styles.headerSpace} /></View><View style={styles.profileCard}><View style={[styles.avatar, styles[`${user.tone}Avatar`]]}><MaterialCommunityIcons name={user.icon} size={37} color={user.tone === 'purple' ? '#244B8B' : '#16723C'} /></View><View style={styles.profileCopy}><ThemedText type="smallBold" style={styles.name}>{user.name}</ThemedText><ThemedText type="small" style={styles.userId}>User ID: {user.id}</ThemedText><View style={styles.roleBadge}><MaterialCommunityIcons name="check" size={12} color="#168B3E" /><ThemedText type="smallBold" style={styles.roleBadgeText}>{user.role}</ThemedText></View></View><View style={styles.activeBadge}><View style={styles.activeDot} /><ThemedText type="smallBold" style={styles.activeText}>Active</ThemedText></View></View><View style={styles.detailsCard}>{detailRows.map(([icon, label, value]) => <DetailRow key={label} icon={icon} label={label} value={value} />)}</View><View style={styles.managementCard}><View style={styles.managementTitleRow}><MaterialCommunityIcons name="shield-account" size={20} color="#168B3E" /><ThemedText type="smallBold" style={styles.managementTitle}>Role Management</ThemedText></View><View style={styles.managementActions}><ManagementAction icon="account-plus" label="Assign Role" tone="green" /><ManagementAction icon="pencil" label="Change Role" tone="blue" /><ManagementAction icon="close-circle" label="Revoke Role" tone="red" /></View><View style={styles.note}><MaterialCommunityIcons name="information" size={16} color="#347D72" /><ThemedText type="small" style={styles.noteText}>Role changes require confirmation and will be recorded in the audit log.</ThemedText></View></View></ScrollView><View style={styles.bottomNav}><AdminNavItem icon="home-outline" label="Home" onPress={() => router.replace('/admin-dashboard')} /><AdminNavItem icon="account-group" label="Users" active onPress={() => router.replace('/admin-users')} /><AdminNavItem icon="shield-check-outline" label="Approvals" /><AdminNavItem icon="chart-line" label="Activity" /><AdminNavItem icon="cog-outline" label="Settings" /></View></SafeAreaView></ImageBackground>;
}

function DetailRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.detailRow}><View style={styles.detailIcon}><MaterialCommunityIcons name={icon} size={16} color="#168B3E" /></View><ThemedText type="small" style={styles.detailLabel}>{label}</ThemedText><ThemedText type="smallBold" style={styles.detailValue}>{value}</ThemedText></View>;
}

function ManagementAction({ icon, label, tone }: { icon: IconName; label: string; tone: 'green' | 'blue' | 'red' }) {
  const colors = { green: '#168B3E', blue: '#248AA5', red: '#E53945' };
  return <Pressable onPress={() => Alert.alert(label, `${label} confirmation is required before changing this account.`)} style={[styles.managementAction, { backgroundColor: tone === 'green' ? '#E6FAEA' : tone === 'blue' ? '#E7F7FF' : '#FFF0F0' }]}><MaterialCommunityIcons name={icon} size={22} color={colors[tone]} /><ThemedText type="smallBold" style={styles.managementActionText}>{label}</ThemedText></Pressable>;
}

function AdminNavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={active ? '#168B3E' : '#7190A7'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F5FFF6', opacity: 0.7 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#174A2C', fontSize: 18 },
  headerSpace: { width: 36 },
  profileCard: { borderRadius: 14, borderWidth: 1, borderColor: '#CDE7DC', backgroundColor: 'rgba(255,255,255,0.92)', padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 64, height: 64, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  greenAvatar: { backgroundColor: '#DDF6E2' },
  blueAvatar: { backgroundColor: '#DDF2FF' },
  purpleAvatar: { backgroundColor: '#E7E7FF' },
  profileCopy: { flex: 1 },
  name: { color: '#245C4A', fontSize: 15 },
  userId: { color: '#648B91', fontSize: 10 },
  roleBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 12, backgroundColor: '#D9F6DC', paddingHorizontal: 7, paddingVertical: 3, marginTop: 5 },
  roleBadgeText: { color: '#268C48', fontSize: 9 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 14, backgroundColor: '#D9F6DC', paddingHorizontal: 10, paddingVertical: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#159447' },
  activeText: { color: '#268C48', fontSize: 9 },
  detailsCard: { borderRadius: 14, borderWidth: 1, borderColor: '#CDE7DC', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 11, paddingVertical: 8, marginTop: 10 },
  detailRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E7F1EA', gap: 7 },
  detailIcon: { width: 26, height: 26, borderRadius: 14, backgroundColor: '#E7F8EA', alignItems: 'center', justifyContent: 'center' },
  detailLabel: { width: 99, color: '#71909A', fontSize: 9 },
  detailValue: { flex: 1, color: '#376276', fontSize: 10 },
  managementCard: { borderRadius: 14, borderWidth: 1, borderColor: '#CDE7DC', backgroundColor: 'rgba(255,255,255,0.9)', padding: 10, marginTop: 12 },
  managementTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  managementTitle: { color: '#245C4A', fontSize: 14 },
  managementActions: { flexDirection: 'row', gap: 8 },
  managementAction: { flex: 1, minHeight: 75, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 3 },
  managementActionText: { color: '#376276', fontSize: 9, textAlign: 'center' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#EDF8F5', borderRadius: 9, padding: 9, marginTop: 10 },
  noteText: { flex: 1, color: '#527A80', fontSize: 9 },
  bottomNav: { height: 68, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#7190A7', fontSize: 9, marginTop: 2 },
  navLabelActive: { color: '#168B3E', fontWeight: '700' },
  navIndicator: { width: 28, height: 2, backgroundColor: '#168B3E', borderRadius: 2, marginTop: 4 },
});
