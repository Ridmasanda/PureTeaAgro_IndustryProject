import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export type AdministratorUserRole =
  | 'Farmer'
  | 'Tea Inspector'
  | 'Leaf Collector'
  | 'Administrator';

export type AdministratorUser = {
  id: string;
  name: string;
  role: AdministratorUserRole;
  status: 'Active' | 'Pending' | 'Suspended';
  nic: string;
  mobile: string;
  email: string;
  location: string;
  registrationDate: string;
  organization: string;
  lastLogin: string;
};

export const administratorUsers: AdministratorUser[] = [
  {
    id: 'FRM-0021',
    name: 'Nimal Perera',
    role: 'Farmer',
    status: 'Active',
    nic: '987654321V',
    mobile: '+94 77 123 4567',
    email: 'nimal.perera@example.lk',
    location: 'Galle',
    registrationDate: '2025-08-09',
    organization: 'Thalawakale Tea Factory',
    lastLogin: '2025-09-08 08:32 AM',
  },
  {
    id: 'INSP-0045',
    name: 'Kamalani Silva',
    role: 'Tea Inspector',
    status: 'Active',
    nic: '925678901V',
    mobile: '+94 76 987 6543',
    email: 'kamalani.silva@example.lk',
    location: 'Kandy',
    registrationDate: '2025-07-18',
    organization: 'Central Inspection Office',
    lastLogin: '2025-09-08 07:48 AM',
  },
  {
    id: 'COL-0032',
    name: 'Sampath Wickramasinghe',
    role: 'Leaf Collector',
    status: 'Active',
    nic: '901234567V',
    mobile: '+94 77 223 4455',
    email: 'sampath.w@example.lk',
    location: 'Matara',
    registrationDate: '2025-06-21',
    organization: 'Thalawakale Tea Factory',
    lastLogin: '2025-09-08 06:55 AM',
  },
  {
    id: 'ADM-0007',
    name: 'Kasun Jayasinghe',
    role: 'Administrator',
    status: 'Active',
    nic: '887654321V',
    mobile: '+94 70 556 7788',
    email: 'kasun.j@example.lk',
    location: 'Colombo',
    registrationDate: '2025-05-02',
    organization: 'PureTeaAgro',
    lastLogin: '2025-09-08 08:10 AM',
  },
];

type UserFilter = 'All Users' | AdministratorUser['role'];

const filters: UserFilter[] = ['All Users', 'Farmer', 'Tea Inspector', 'Leaf Collector', 'Administrator'];
const filterLabels: Record<UserFilter, string> = {
  'All Users': 'All Users',
  Farmer: 'Farmers',
  'Tea Inspector': 'Tea Inspectors',
  'Leaf Collector': 'Leaf Collectors',
  Administrator: 'Administrators',
};

const roleIcons: Record<AdministratorUser['role'], IconName> = {
  Farmer: 'account-tie-hat',
  'Tea Inspector': 'account-search',
  'Leaf Collector': 'leaf',
  Administrator: 'account-cog',
};

export default function AdministratorUsersScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<UserFilter>('All Users');
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);

  const visibleUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return administratorUsers.filter((user) => {
      const matchesRole = activeFilter === 'All Users' || user.role === activeFilter;
      const matchesSearch = !normalizedSearch
        || `${user.name} ${user.id} ${user.nic} ${user.mobile}`.toLowerCase().includes(normalizedSearch);
      return matchesRole && matchesSearch;
    });
  }, [activeFilter, search]);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
      return;
    }
    if (tab === 'Users') {
      return;
    }
    if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
      return;
    }
    router.replace({ pathname: '/administrator-home', params: { section: tab } });
  }

  function showUserAction(action: string, user: AdministratorUser) {
    setOpenActionsFor(null);
    Alert.alert(
      action,
      `${action} for ${user.name} will be available when the administrator service is connected.`,
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>User Management</ThemedText>
            <Pressable
              accessibilityLabel="Add user"
              accessibilityRole="button"
              onPress={() => Alert.alert('Add User', 'User registration is available from the registration screen.')}
              style={styles.addButton}>
              <MaterialCommunityIcons name="account-plus-outline" size={22} color="#176B32" />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={18} color="#527C67" />
            <TextInput
              accessibilityLabel="Search users"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setSearch}
              placeholder="Search by name, NIC, User ID or mobile number..."
              placeholderTextColor="#819287"
              style={styles.searchInput}
              value={search}
            />
            {search.length > 0 && (
              <Pressable accessibilityLabel="Clear search" onPress={() => setSearch('')}>
                <MaterialCommunityIcons name="close-circle" size={17} color="#819087" />
              </Pressable>
            )}
          </View>

          <ThemedText type="smallBold" style={styles.filterHeading}>Filter by Role</ThemedText>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterList}
            showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}>
                  <ThemedText type="smallBold" style={[styles.filterText, selected && styles.filterTextSelected]}>
                    {filterLabels[filter]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.usersList}>
            {visibleUsers.map((user) => {
              const actionsOpen = openActionsFor === user.id;
              return (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.avatar}>
                      <MaterialCommunityIcons name={roleIcons[user.role]} size={27} color="#247843" />
                    </View>
                    <View style={styles.userInfo}>
                      <ThemedText type="smallBold" style={styles.userName}>{user.name}</ThemedText>
                      <ThemedText type="small" style={styles.userId}>User ID: {user.id}</ThemedText>
                      <View style={styles.roleLine}>
                        <MaterialCommunityIcons name={roleIcons[user.role]} size={12} color="#248048" />
                        <ThemedText type="smallBold" style={styles.roleText}>{user.role}</ThemedText>
                      </View>
                      <View style={styles.userMeta}>
                        <MaterialCommunityIcons name="phone-outline" size={12} color="#49845D" />
                        <ThemedText type="small" style={styles.metaText}>{user.mobile}</ThemedText>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#49845D" />
                        <ThemedText type="small" style={styles.metaText}>{user.location}</ThemedText>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, user.status === 'Pending' && styles.statusPending]}>
                      <View style={[styles.statusDot, user.status === 'Pending' && styles.statusDotPending]} />
                      <ThemedText type="smallBold" style={[styles.statusText, user.status === 'Pending' && styles.statusTextPending]}>
                        {user.status}
                      </ThemedText>
                    </View>
                    <Pressable
                      accessibilityLabel={`More actions for ${user.name}`}
                      accessibilityRole="button"
                      onPress={() => setOpenActionsFor(actionsOpen ? null : user.id)}
                      style={styles.moreButton}>
                      <MaterialCommunityIcons name="dots-vertical" size={19} color="#47765A" />
                    </Pressable>
                  </View>
                  <View style={styles.cardButtons}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push({ pathname: '/administrator-user-details', params: { userId: user.id } })}
                      style={({ pressed }) => [styles.viewButton, pressed && styles.pressed]}>
                      <MaterialCommunityIcons name="eye-outline" size={14} color="#FFFFFF" />
                      <ThemedText type="smallBold" style={styles.viewButtonText}>View</ThemedText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => showUserAction('Manage User', user)}
                      style={({ pressed }) => [styles.manageButton, pressed && styles.pressed]}>
                      <MaterialCommunityIcons name="cog-outline" size={14} color="#35734C" />
                      <ThemedText type="smallBold" style={styles.manageButtonText}>Manage</ThemedText>
                    </Pressable>
                  </View>
                  {actionsOpen && (
                    <View style={styles.userActions}>
                      {['Activate', 'Suspend', 'Reset Password', 'View Activity'].map((action) => (
                        <Pressable
                          key={action}
                          onPress={() => showUserAction(action, user)}
                          style={styles.userAction}>
                          <ThemedText type="small" style={styles.userActionText}>{action}</ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
            {visibleUsers.length === 0 && (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons name="account-search-outline" size={30} color="#789080" />
                <ThemedText type="smallBold" style={styles.emptyTitle}>No users found</ThemedText>
                <ThemedText type="small" style={styles.emptyText}>Try a different search or role filter.</ThemedText>
              </View>
            )}
          </View>

          <View style={styles.actionsPanel}>
            <View style={styles.actionsHeader}>
              <MaterialCommunityIcons name="cog" size={17} color="#21743D" />
              <ThemedText type="smallBold" style={styles.actionsTitle}>Actions</ThemedText>
            </View>
            <View style={styles.bulkActions}>
              {[
                { label: 'View User', icon: 'eye-outline' as const },
                { label: 'Activate', icon: 'account-check-outline' as const },
                { label: 'Suspend', icon: 'account-cancel-outline' as const },
                { label: 'Reset Password', icon: 'lock-reset' as const },
                { label: 'View Activity', icon: 'history' as const },
              ].map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() => {
                    const user = visibleUsers[0];
                    if (!user) {
                      Alert.alert('No users', 'There are no users available for this action.');
                      return;
                    }
                    if (action.label === 'View User') {
                      router.push({ pathname: '/administrator-user-details', params: { userId: user.id } });
                      return;
                    }
                    showUserAction(action.label, user);
                  }}
                  style={({ pressed }) => [styles.bulkAction, pressed && styles.pressed]}>
                  <MaterialCommunityIcons name={action.icon} size={14} color="#286F43" />
                  <ThemedText type="small" style={styles.bulkActionText}>{action.label}</ThemedText>
                </Pressable>
              ))}
            </View>
            <ThemedText type="small" style={styles.demoNote}>Sample user accounts · not connected to a server</ThemedText>
          </View>
        </ScrollView>
        <AdministratorBottomTabs activeTab="Users" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 4, paddingBottom: 9 },
  header: { minHeight: 46, flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 17 },
  addButton: { width: 34, height: 38, alignItems: 'flex-end', justifyContent: 'center' },
  searchBox: {
    minHeight: 39,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D5E8DD',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, minWidth: 0, height: 38, color: '#274936', fontSize: 10, paddingHorizontal: 8 },
  filterHeading: { color: '#326348', fontSize: 10, marginTop: 8, marginBottom: 5 },
  filterList: { gap: 6, paddingBottom: 2 },
  filterChip: { minHeight: 28, borderRadius: 16, borderWidth: 1, borderColor: '#CFE4D9', backgroundColor: 'rgba(255,255,255,0.91)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  filterChipSelected: { backgroundColor: '#11743C', borderColor: '#11743C' },
  filterText: { color: '#537563', fontSize: 8 },
  filterTextSelected: { color: '#FFFFFF' },
  usersList: { gap: 7, marginTop: 7 },
  userCard: { borderRadius: 12, borderWidth: 1, borderColor: '#D7E9DF', backgroundColor: 'rgba(255,255,255,0.95)', padding: 8 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 43, height: 43, borderRadius: 23, backgroundColor: '#E1F3DF', alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1, borderColor: '#D4EBD3' },
  userInfo: { flex: 1, minWidth: 0, paddingTop: 1 },
  userName: { color: '#28553C', fontSize: 10, lineHeight: 13 },
  userId: { color: '#758B7D', fontSize: 8, lineHeight: 11 },
  roleLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  roleText: { color: '#36754A', fontSize: 8 },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  metaText: { color: '#70887A', fontSize: 7, marginRight: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, backgroundColor: '#DFF5E1', paddingHorizontal: 8, paddingVertical: 4, marginLeft: 3 },
  statusPending: { backgroundColor: '#FFF1C8' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#218B4B' },
  statusDotPending: { backgroundColor: '#D69712' },
  statusText: { color: '#287043', fontSize: 7 },
  statusTextPending: { color: '#926300' },
  moreButton: { width: 20, height: 26, alignItems: 'flex-end', justifyContent: 'center', marginLeft: 2 },
  cardButtons: { flexDirection: 'row', gap: 7, marginLeft: 51, marginTop: 5 },
  viewButton: { minWidth: 70, minHeight: 25, borderRadius: 14, backgroundColor: '#11743C', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 10 },
  viewButtonText: { color: '#FFFFFF', fontSize: 8 },
  manageButton: { minWidth: 80, minHeight: 25, borderRadius: 14, borderWidth: 1, borderColor: '#CFE5D7', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 10 },
  manageButtonText: { color: '#35734C', fontSize: 8 },
  userActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingTop: 7, borderTopWidth: 1, borderTopColor: '#E8F0EA' },
  userAction: { minHeight: 25, borderRadius: 7, backgroundColor: '#F0F7F1', justifyContent: 'center', paddingHorizontal: 8 },
  userActionText: { color: '#466A52', fontSize: 8 },
  emptyCard: { minHeight: 150, borderRadius: 12, backgroundColor: '#FFFFFFE8', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 16 },
  emptyTitle: { color: '#315E42', fontSize: 12 },
  emptyText: { color: '#758579', fontSize: 9, textAlign: 'center' },
  actionsPanel: { borderRadius: 12, borderWidth: 1, borderColor: '#D6EADD', backgroundColor: 'rgba(225,248,229,0.9)', padding: 8, marginTop: 9 },
  actionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  actionsTitle: { color: '#326448', fontSize: 10 },
  bulkActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 5 },
  bulkAction: { minHeight: 27, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.84)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 7 },
  bulkActionText: { color: '#4A6D57', fontSize: 7 },
  demoNote: { color: '#829184', fontSize: 7, textAlign: 'center', marginTop: 6 },
  pressed: { opacity: 0.84 },
});
