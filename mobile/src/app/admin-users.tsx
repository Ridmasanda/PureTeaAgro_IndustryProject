import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState, type ComponentProps } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Role = 'Farmer' | 'Tea Inspector' | 'Leaf Collector' | 'Administrator';
type Filter = 'All Users' | Role;
type Tone = 'green' | 'blue' | 'orange' | 'purple';

type User = {
  name: string;
  id: string;
  role: Role;
  phone: string;
  location: string;
  icon: IconName;
  tone: Tone;
};

const users: User[] = [
  { name: 'Nimal Perera', id: 'FRM-0021', role: 'Farmer', phone: '+94 77 123 4567', location: 'Galle', icon: 'account-tie-hat', tone: 'green' },
  { name: 'Kamalani Silva', id: 'INSP-0045', role: 'Tea Inspector', phone: '+94 76 987 6543', location: 'Kandy', icon: 'account-search', tone: 'blue' },
  { name: 'Sampath Wickramasinghe', id: 'COL-0032', role: 'Leaf Collector', phone: '+94 77 222 4455', location: 'Matara', icon: 'leaf', tone: 'green' },
  { name: 'Kasun Jayasinghe', id: 'ADM-0007', role: 'Administrator', phone: '+94 70 556 7788', location: 'Colombo', icon: 'account-tie', tone: 'purple' },
];

const filters: Filter[] = ['All Users', 'Farmer', 'Tea Inspector', 'Leaf Collector', 'Administrator'];

export default function AdminUsersScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All Users');
  const visibleUsers = useMemo(() => users.filter((user) => {
    const matchesRole = filter === 'All Users' || user.role === filter;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${user.name} ${user.id} ${user.role} ${user.phone}`.toLowerCase().includes(normalizedQuery);
    return matchesRole && matchesQuery;
  }), [filter, query]);

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back to admin dashboard" accessibilityRole="button" onPress={() => router.replace('/admin-dashboard')} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" /></Pressable>
            <ThemedText type="smallBold" style={styles.title}>User Management</ThemedText>
            <Pressable accessibilityLabel="Add user" accessibilityRole="button" onPress={() => undefined} style={styles.addButton}><MaterialCommunityIcons name="account-plus-outline" size={22} color="#168B3E" /></Pressable>
          </View>

          <View style={styles.searchWrap}><MaterialCommunityIcons name="magnify" size={21} color="#277B5D" /><TextInput value={query} onChangeText={setQuery} placeholder="Search by name, NIC, User ID or mobile number..." placeholderTextColor="#7F9AA8" style={styles.searchInput} /></View>
          <ThemedText type="smallBold" style={styles.filterLabel}>Filter by Role</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>{filters.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}><ThemedText type="smallBold" style={[styles.filterText, filter === item && styles.filterTextActive]}>{item === 'All Users' ? item : item === 'Tea Inspector' ? 'Tea Inspectors' : `${item}s`}</ThemedText></Pressable>)}</ScrollView>

          <View style={styles.userList}>{visibleUsers.map((user) => <UserCard key={user.id} user={user} />)}</View>
          {visibleUsers.length === 0 && <View style={styles.empty}><MaterialCommunityIcons name="account-search-outline" size={35} color="#8BAA98" /><ThemedText type="smallBold" style={styles.emptyText}>No users found</ThemedText></View>}

          <View style={styles.actionsCard}>
            <View style={styles.actionsHeader}><MaterialCommunityIcons name="cog-outline" size={19} color="#168B3E" /><ThemedText type="smallBold" style={styles.actionsTitle}>Actions</ThemedText></View>
            <View style={styles.actionsRow}><ActionButton icon="eye-outline" label="View User" /><ActionButton icon="account-check-outline" label="Activate" /><ActionButton icon="pause-circle-outline" label="Suspend" /><ActionButton icon="lock-reset" label="Reset Password" /><ActionButton icon="history" label="View Activity" /></View>
          </View>
        </ScrollView>
        <View style={styles.bottomNav}><AdminNavItem icon="home-outline" label="Home" onPress={() => router.replace('/admin-dashboard')} /><AdminNavItem icon="account-group" label="Users" active /><AdminNavItem icon="shield-check-outline" label="Approvals" onPress={() => router.replace('/admin-approvals')} /><AdminNavItem icon="chart-line" label="Activity" /><AdminNavItem icon="cog-outline" label="Settings" /></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function UserCard({ user }: { user: User }) {
  return <View style={styles.userCard}><View style={[styles.avatar, styles[`${user.tone}Avatar`]]}><MaterialCommunityIcons name={user.icon} size={25} color={user.tone === 'purple' ? '#244B8B' : '#16723C'} /></View><View style={styles.userInfo}><View style={styles.userHeading}><View style={styles.nameCopy}><ThemedText type="smallBold" style={styles.userName}>{user.name}</ThemedText><ThemedText type="small" style={styles.userId}>User ID: {user.id}</ThemedText></View><View style={styles.activeBadge}><ThemedText type="smallBold" style={styles.activeText}>Active</ThemedText></View><Pressable accessibilityLabel={`More options for ${user.name}`} onPress={() => undefined}><MaterialCommunityIcons name="dots-vertical" size={20} color="#245C4A" /></Pressable></View><View style={styles.roleRow}><MaterialCommunityIcons name="check-decagram" size={13} color="#168B3E" /><ThemedText type="small" style={styles.roleText}>{user.role}</ThemedText></View><View style={styles.metaRow}><MaterialCommunityIcons name="phone-outline" size={13} color="#168B3E" /><ThemedText type="small" style={styles.metaText}>{user.phone}</ThemedText><MaterialCommunityIcons name="map-marker-outline" size={13} color="#168B3E" /><ThemedText type="small" style={styles.metaText}>{user.location}</ThemedText></View><View style={styles.cardButtons}><Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/admin-user-details', params: { userId: user.id } })} style={styles.viewButton}><MaterialCommunityIcons name="eye-outline" size={14} color="#FFF" /><ThemedText type="smallBold" style={styles.viewText}>View</ThemedText></Pressable><Pressable onPress={() => undefined} style={styles.manageButton}><MaterialCommunityIcons name="cog-outline" size={14} color="#168B3E" /><ThemedText type="smallBold" style={styles.manageText}>Manage</ThemedText></Pressable></View></View></View>;
}

function ActionButton({ icon, label }: { icon: IconName; label: string }) {
  return <Pressable onPress={() => undefined} style={styles.actionButton}><MaterialCommunityIcons name={icon} size={14} color="#168B3E" /><ThemedText type="smallBold" style={styles.actionLabel}>{label}</ThemedText></Pressable>;
}

function AdminNavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={active ? '#168B3E' : '#7190A7'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F5FFF6', opacity: 0.7 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#174A2C', fontSize: 18 },
  addButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' },
  searchWrap: { minHeight: 43, borderRadius: 22, borderWidth: 1, borderColor: '#B9E0D7', backgroundColor: 'rgba(255,255,255,0.93)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 7 },
  searchInput: { flex: 1, color: '#245C4A', fontSize: 12, paddingVertical: 8 },
  filterLabel: { color: '#35644D', fontSize: 11, marginTop: 9, marginBottom: 6 },
  filterList: { gap: 6, paddingBottom: 9 },
  filterChip: { borderRadius: 17, borderWidth: 1, borderColor: '#C8E3DF', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 13, paddingVertical: 7 },
  filterChipActive: { backgroundColor: '#168B3E', borderColor: '#168B3E' },
  filterText: { color: '#35705D', fontSize: 10 },
  filterTextActive: { color: '#FFF' },
  userList: { gap: 8 },
  userCard: { borderRadius: 13, borderWidth: 1, borderColor: '#CDE7DC', backgroundColor: 'rgba(255,255,255,0.91)', padding: 10, flexDirection: 'row', gap: 9 },
  avatar: { width: 43, height: 43, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  greenAvatar: { backgroundColor: '#DDF6E2' },
  blueAvatar: { backgroundColor: '#DDF2FF' },
  orangeAvatar: { backgroundColor: '#FFE8DB' },
  purpleAvatar: { backgroundColor: '#E7E7FF' },
  userInfo: { flex: 1 },
  userHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  nameCopy: { flex: 1 },
  userName: { color: '#245C4A', fontSize: 11 },
  userId: { color: '#648B91', fontSize: 9, lineHeight: 13 },
  activeBadge: { borderRadius: 13, backgroundColor: '#D9F6DC', paddingHorizontal: 10, paddingVertical: 4 },
  activeText: { color: '#268C48', fontSize: 9 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  roleText: { color: '#35644D', fontSize: 9 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { color: '#628384', fontSize: 8, marginRight: 4 },
  cardButtons: { flexDirection: 'row', gap: 9, marginTop: 6 },
  viewButton: { minWidth: 74, height: 23, borderRadius: 13, backgroundColor: '#08702F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  viewText: { color: '#FFF', fontSize: 9 },
  manageButton: { minWidth: 82, height: 23, borderRadius: 13, borderWidth: 1, borderColor: '#B8DED0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  manageText: { color: '#168B3E', fontSize: 9 },
  empty: { alignItems: 'center', paddingVertical: 35, gap: 7 },
  emptyText: { color: '#628384' },
  actionsCard: { borderRadius: 12, backgroundColor: '#DDF7E6', borderWidth: 1, borderColor: '#BCE9CB', marginTop: 12, padding: 9 },
  actionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  actionsTitle: { color: '#246043', fontSize: 11 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  actionButton: { flex: 1, minHeight: 31, borderRadius: 6, backgroundColor: '#F7FFF8', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 2 },
  actionLabel: { color: '#39785B', fontSize: 7, textAlign: 'center' },
  bottomNav: { height: 68, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#7190A7', fontSize: 9, marginTop: 2 },
  navLabelActive: { color: '#168B3E', fontWeight: '700' },
  navIndicator: { width: 28, height: 2, backgroundColor: '#168B3E', borderRadius: 2, marginTop: 4 },
});
