import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState, type ComponentProps } from 'react';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type Tab = ApprovalStatus;

type Registration = {
  id: string;
  name: string;
  role: string;
  district: string;
  submitted: string;
  status: ApprovalStatus;
  avatar: IconName;
};

const initialRegistrations: Registration[] = [
  { id: 'FRM-0021', name: 'Nimal Perera', role: 'Farmer', district: 'Nuwara Eliya', submitted: 'Today', status: 'pending', avatar: 'account-tie-hat' },
  { id: 'INSP-0045', name: 'Kamalani Silva', role: 'Inspector', district: 'Kandy', submitted: 'Today', status: 'pending', avatar: 'account-search' },
  { id: 'COL-0032', name: 'Sampath Wickramasinghe', role: 'Collector', district: 'Matara', submitted: 'Yesterday', status: 'pending', avatar: 'account-tie-hat' },
  { id: 'FRM-0018', name: 'Tharindu Fernando', role: 'Farmer', district: 'Galle', submitted: 'Yesterday', status: 'approved', avatar: 'account-tie-hat' },
  { id: 'INSP-0031', name: 'Dilshan Kumara', role: 'Inspector', district: 'Kegalle', submitted: '2 days ago', status: 'rejected', avatar: 'account-search' },
];

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: 'pending', label: 'Pending', count: 5 },
  { key: 'approved', label: 'Approved', count: 12 },
  { key: 'rejected', label: 'Rejected', count: 3 },
];

export default function AdminApprovalsScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>('pending');
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const visibleRegistrations = useMemo(
    () => registrations.filter((registration) => registration.status === selectedTab),
    [registrations, selectedTab],
  );

  const updateStatus = (id: string, status: ApprovalStatus) => {
    setRegistrations((current) =>
      current.map((registration) => (registration.id === id ? { ...registration, status } : registration)),
    );
  };

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back to admin dashboard" accessibilityRole="button" onPress={() => router.replace('/admin-dashboard')} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={25} color="#173F25" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.title}>Registration Approvals</ThemedText>
            <View style={styles.headerSpace} />
          </View>

          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: selectedTab === tab.key }} onPress={() => setSelectedTab(tab.key)} style={[styles.tab, selectedTab === tab.key && styles.activeTab]}>
                <ThemedText type="smallBold" style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</ThemedText>
                <View style={[styles.count, selectedTab === tab.key && styles.activeCount]}><ThemedText type="smallBold" style={[styles.countText, selectedTab === tab.key && styles.activeCountText]}>{tab.count}</ThemedText></View>
              </Pressable>
            ))}
          </View>

          {visibleRegistrations.map((registration) => (
            <ApprovalCard key={registration.id} registration={registration} onStatusChange={updateStatus} />
          ))}
          {visibleRegistrations.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={42} color="#73A88C" />
              <ThemedText type="smallBold" style={styles.emptyTitle}>No {selectedTab} registrations</ThemedText>
              <ThemedText type="small" style={styles.emptyText}>New registration requests will appear here.</ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <AdminNavItem icon="home-outline" label="Home" onPress={() => router.replace('/admin-dashboard')} />
          <AdminNavItem icon="account-group-outline" label="Users" onPress={() => router.replace('/admin-users')} />
          <AdminNavItem icon="shield-check" label="Approvals" active />
          <AdminNavItem icon="domain" label="Organizations" />
          <AdminNavItem icon="cog-outline" label="Settings" />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function ApprovalCard({ registration, onStatusChange }: { registration: Registration; onStatusChange: (id: string, status: ApprovalStatus) => void }) {
  const isPending = registration.status === 'pending';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.newBadge}><ThemedText type="smallBold" style={styles.newBadgeText}>{isPending ? 'New Registration' : registration.status[0].toUpperCase() + registration.status.slice(1)}</ThemedText></View>
        <ThemedText type="small" style={styles.date}>{registration.submitted}</ThemedText>
      </View>
      <View style={styles.profileRow}>
        <View style={styles.avatar}><MaterialCommunityIcons name={registration.avatar} size={29} color="#08702F" /></View>
        <View style={styles.profileCopy}>
          <ThemedText type="smallBold" style={styles.name}>{registration.name}</ThemedText>
          <MetaRow icon="account-outline" text={`Requested Role: ${registration.role}`} />
          <MetaRow icon="map-marker-outline" text={`District: ${registration.district}`} />
          <MetaRow icon="calendar-check-outline" text={`Submitted: ${registration.submitted}`} />
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#17624B" />
      </View>
      <Pressable accessibilityRole="button" onPress={() => Alert.alert('Registration Details', `${registration.name}\n${registration.role} · ${registration.district}\nRequest ID: ${registration.id}`)} style={styles.detailsButton}>
        <ThemedText type="smallBold" style={styles.detailsText}>View Details</ThemedText>
      </Pressable>
      {isPending && (
        <View style={styles.actionRow}>
          <Pressable accessibilityRole="button" onPress={() => onStatusChange(registration.id, 'approved')} style={styles.approveButton}>
            <MaterialCommunityIcons name="check" size={17} color="#FFF" />
            <ThemedText type="smallBold" style={styles.approveText}>Approve</ThemedText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => onStatusChange(registration.id, 'rejected')} style={styles.rejectButton}>
            <MaterialCommunityIcons name="close" size={17} color="#EA3341" />
            <ThemedText type="smallBold" style={styles.rejectText}>Reject</ThemedText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => Alert.alert('Registration Details', `Request ID: ${registration.id}\nSubmitted: ${registration.submitted}`)} style={styles.infoButton}>
            <MaterialCommunityIcons name="information" size={17} color="#1689E8" />
            <ThemedText type="smallBold" style={styles.infoText}>More Info</ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function MetaRow({ icon, text }: { icon: IconName; text: string }) {
  return <View style={styles.metaRow}><MaterialCommunityIcons name={icon} size={13} color="#168B3E" /><ThemedText type="small" style={styles.metaText}>{text}</ThemedText></View>;
}

function AdminNavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={active ? '#168B3E' : '#7190A7'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F5FFF6', opacity: 0.7 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerSpace: { width: 36 },
  title: { color: '#075132', fontSize: 19, lineHeight: 24 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 13 },
  tab: { flex: 1, height: 38, borderRadius: 21, borderWidth: 1, borderColor: '#BDE5D9', backgroundColor: 'rgba(255,255,255,0.72)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  activeTab: { backgroundColor: '#07863E', borderColor: '#07863E' },
  tabText: { color: '#1B6958', fontSize: 10 },
  activeTabText: { color: '#FFF' },
  count: { minWidth: 19, height: 19, paddingHorizontal: 4, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF4E8' },
  activeCount: { backgroundColor: '#E0F4E7' },
  countText: { color: '#3D7A67', fontSize: 9 },
  activeCountText: { color: '#14733F' },
  card: { borderRadius: 13, borderWidth: 1, borderColor: '#BFE8D9', backgroundColor: 'rgba(255,255,255,0.91)', padding: 10, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  newBadge: { borderRadius: 10, backgroundColor: '#FFF3CA', paddingHorizontal: 10, paddingVertical: 4 },
  newBadgeText: { color: '#E58D14', fontSize: 9 },
  date: { color: '#5BAA98', fontSize: 9 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatar: { width: 48, height: 48, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF5D5' },
  profileCopy: { flex: 1 },
  name: { color: '#1E5A4D', fontSize: 12, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  metaText: { color: '#4A7780', fontSize: 9, lineHeight: 14 },
  detailsButton: { height: 24, borderRadius: 8, backgroundColor: '#E8F9F1', justifyContent: 'center', paddingHorizontal: 10, marginTop: 7, marginBottom: 9 },
  detailsText: { color: '#277A5C', fontSize: 9 },
  actionRow: { flexDirection: 'row', gap: 8 },
  approveButton: { flex: 1.1, height: 29, borderRadius: 16, backgroundColor: '#078B43', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  approveText: { color: '#FFF', fontSize: 9 },
  rejectButton: { flex: 1, height: 29, borderRadius: 16, borderWidth: 1, borderColor: '#FFBFC1', backgroundColor: '#FFF8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  rejectText: { color: '#DE2C38', fontSize: 9 },
  infoButton: { flex: 1, height: 29, borderRadius: 16, borderWidth: 1, borderColor: '#A9D8FF', backgroundColor: '#F3FAFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  infoText: { color: '#1689E8', fontSize: 9 },
  emptyState: { alignItems: 'center', paddingVertical: 58 },
  emptyTitle: { color: '#23654D', marginTop: 10 },
  emptyText: { color: '#70928A', fontSize: 10, marginTop: 4 },
  bottomNav: { height: 68, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#7190A7', fontSize: 8, marginTop: 2, textAlign: 'center' },
  navLabelActive: { color: '#168B3E', fontWeight: '700' },
  navIndicator: { width: 28, height: 2, backgroundColor: '#168B3E', borderRadius: 2, marginTop: 4 },
});
