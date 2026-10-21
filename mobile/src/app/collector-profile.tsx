import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CollectorDashboardShell } from '@/app/collector-dashboard-shell';

const details = [
  { icon: 'account-outline' as const, label: 'Collector Name', values: ['Sampath Wickramasinghe'] },
  { icon: 'badge-account-outline' as const, label: 'Collector ID', values: ['COL-003'] },
  { icon: 'factory' as const, label: 'Assigned Factory', values: ['Main Factory'] },
  { icon: 'phone-outline' as const, label: 'Contact Details', values: ['+94 77 123 4567', 'sampath.w@teaagro.lk'] },
];

export default function CollectorProfileScreen() {
  return (
    <CollectorDashboardShell activeTab="Profile">
      <View style={styles.heading}>
        <MaterialCommunityIcons name="account-outline" size={23} color="#24733E" />
        <ThemedText type="smallBold" style={styles.title}>Profile</ThemedText>
      </View>
      <View style={styles.hero}>
        <View style={styles.decoration}>
          <MaterialCommunityIcons name="leaf" size={25} color="#76B65B" />
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-hard-hat" size={43} color="#237A3A" />
          </View>
          <MaterialCommunityIcons name="leaf" size={25} color="#76B65B" />
        </View>
        <ThemedText type="smallBold" style={styles.name}>Sampath Wickramasinghe</ThemedText>
        <ThemedText type="small" style={styles.role}>Collector</ThemedText>
        <View style={styles.idPill}>
          <MaterialCommunityIcons name="badge-account-outline" size={15} color="#37834A" />
          <ThemedText type="smallBold" style={styles.idText}>COL-003</ThemedText>
        </View>
      </View>
      <View style={styles.detailsCard}>
        {details.map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <MaterialCommunityIcons name={item.icon} size={18} color="#287C43" />
            <View style={styles.infoText}>
              <ThemedText type="small" style={styles.infoLabel}>{item.label}</ThemedText>
              {item.values.map((value) => (
                <ThemedText key={value} type="smallBold" style={styles.infoValue}>{value}</ThemedText>
              ))}
            </View>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/login')}
        style={({ pressed }) => [styles.logoutCard, pressed && styles.pressed]}>
        <MaterialCommunityIcons name="logout" size={22} color="#21723C" />
        <View style={styles.logoutText}>
          <ThemedText type="smallBold" style={styles.logoutTitle}>Logout</ThemedText>
          <ThemedText type="small" style={styles.logoutSubtitle}>Sign out from your account</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#5B8665" />
      </Pressable>
      <ThemedText type="small" style={styles.demoLabel}>Sample collector profile</ThemedText>
    </CollectorDashboardShell>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.88 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 9, marginBottom: 8 },
  title: { color: '#174A2A', fontSize: 19, lineHeight: 25 },
  hero: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 11,
    marginBottom: 8,
  },
  decoration: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 3 },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#E2F4DE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D6EDD2',
  },
  name: { color: '#1F6840', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  role: { color: '#738478', fontSize: 10 },
  idPill: {
    minWidth: 92,
    minHeight: 25,
    borderRadius: 13,
    backgroundColor: '#E7F5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 7,
  },
  idText: { color: '#347B46', fontSize: 10 },
  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 11,
    marginBottom: 8,
  },
  infoRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2ED',
    gap: 9,
    paddingVertical: 6,
  },
  infoText: { flex: 1 },
  infoLabel: { color: '#7A897D', fontSize: 9, lineHeight: 13 },
  infoValue: { color: '#36543D', fontSize: 10, lineHeight: 15 },
  logoutCard: {
    minHeight: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 9,
  },
  logoutText: { flex: 1 },
  logoutTitle: { color: '#31583B', fontSize: 11, lineHeight: 15 },
  logoutSubtitle: { color: '#7D8B80', fontSize: 9, lineHeight: 13 },
  demoLabel: { color: '#87958A', fontSize: 9, textAlign: 'center', marginTop: 6, marginBottom: 2 },
});
