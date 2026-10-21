import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CollectorDashboardShell } from '@/app/collector-dashboard-shell';

const stats = [
  { icon: 'leaf' as const, label: "Today's Collections", value: '420 kg', note: '↑ 12% vs. yesterday' },
  { icon: 'flask-outline' as const, label: 'Total Weight Collected', value: '12,680 kg' },
  { icon: 'account-tie-hat-outline' as const, label: 'Assigned Farmers', value: '18', note: 'active farmers' },
  { icon: 'cloud-sync-outline' as const, label: 'Pending Sync', value: '3', note: 'records' },
];

function QuickAction({
  icon,
  title,
  subtitle,
  route,
}: {
  icon: 'leaf' | 'account-group' | 'clock-outline';
  title: string;
  subtitle: string;
  route: '/collector-new-collection' | '/collector-collection-history' | '/collector-farmers';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(route)}
      style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
      <View style={styles.actionIcon}>
        <MaterialCommunityIcons name={icon} size={20} color="#237A3A" />
      </View>
      <ThemedText type="smallBold" style={styles.actionTitle}>{title}</ThemedText>
      <ThemedText type="small" style={styles.actionSubtitle}>{subtitle}</ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={15} color="#38734A" style={styles.actionArrow} />
    </Pressable>
  );
}

export default function CollectorHomeScreen() {
  return (
    <CollectorDashboardShell activeTab="Home">
      <View style={styles.hero}>
        <View style={styles.brandIcon}>
          <MaterialCommunityIcons name="leaf" size={24} color="#23823D" />
        </View>
        <View style={styles.welcome}>
          <ThemedText type="smallBold" style={styles.greeting}>Good Morning,</ThemedText>
          <ThemedText type="smallBold" style={styles.name}>Collector</ThemedText>
          <ThemedText type="small" style={styles.area}>Assigned Area: Galle</ThemedText>
        </View>
        <Pressable
          accessibilityLabel="Open notifications"
          accessibilityRole="button"
          onPress={() => router.push('/collector-notifications')}
          style={({ pressed }) => [styles.bellButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="bell-outline" size={23} color="#1D6539" />
          <View style={styles.unreadDot} />
        </Pressable>
        <Pressable
          accessibilityLabel="Open collector profile"
          accessibilityRole="button"
          onPress={() => router.push('/collector-profile')}
          style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="account-hard-hat" size={30} color="#26743A" />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons name={stat.icon} size={24} color="#21803A" />
            </View>
            <ThemedText type="small" style={styles.statLabel}>{stat.label}</ThemedText>
            <ThemedText type="smallBold" style={styles.statValue}>{stat.value}</ThemedText>
            {stat.note && <ThemedText type="small" style={styles.statNote}>{stat.note}</ThemedText>}
          </View>
        ))}
      </View>

      <View style={styles.sectionHeading}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/collector-collection-history')}
          style={styles.viewAll}>
          <ThemedText type="smallBold" style={styles.viewAllText}>View All</ThemedText>
          <MaterialCommunityIcons name="chevron-right" size={17} color="#316D42" />
        </Pressable>
      </View>
      <View style={styles.actions}>
        <QuickAction icon="leaf" title="Record" subtitle="Collection" route="/collector-new-collection" />
        <QuickAction icon="account-group" title="View Assigned" subtitle="Farmers" route="/collector-farmers" />
        <QuickAction icon="clock-outline" title="View Collection" subtitle="History" route="/collector-collection-history" />
      </View>

      <View style={styles.syncBanner}>
        <View style={styles.syncIcon}>
          <MaterialCommunityIcons name="leaf" size={24} color="#25823E" />
        </View>
        <View style={styles.syncText}>
          <ThemedText type="smallBold" style={styles.syncTitle}>Stay on track</ThemedText>
          <ThemedText type="small" style={styles.syncDescription}>
            All collections are updated in real-time.
          </ThemedText>
        </View>
        <MaterialCommunityIcons name="leaf" size={29} color="#77B95D" />
      </View>
    </CollectorDashboardShell>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.86 },
  hero: {
    minHeight: 138,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 12,
    marginHorizontal: -16,
    marginBottom: 3,
    backgroundColor: 'rgba(224,246,223,0.45)',
  },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(225,245,221,0.96)',
    marginRight: 7,
  },
  welcome: { flex: 1, minWidth: 0 },
  greeting: { color: '#25583A', fontSize: 14, lineHeight: 19 },
  name: { color: '#155B35', fontSize: 24, lineHeight: 28 },
  area: { color: '#688376', fontSize: 10, lineHeight: 15, marginTop: 2 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(43,108,59,0.12)',
    marginLeft: 3,
  },
  unreadDot: {
    position: 'absolute',
    right: 7,
    top: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E45743',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1F3DB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: 5,
    marginRight: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginTop: -7,
  },
  statCard: {
    width: '49%',
    minHeight: 113,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D8EEE1',
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 7,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F6E0',
    marginBottom: 4,
  },
  statLabel: { color: '#466452', fontSize: 10, lineHeight: 14 },
  statValue: { color: '#145C3A', fontSize: 18, lineHeight: 23 },
  statNote: { color: '#75877A', fontSize: 9, lineHeight: 12 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 7,
  },
  sectionTitle: { color: '#1D5335', fontSize: 15 },
  viewAll: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  viewAllText: { color: '#426E50', fontSize: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 },
  actionCard: {
    width: '32%',
    minHeight: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDEEE0',
    backgroundColor: 'rgba(247,253,246,0.96)',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#E6F6E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionTitle: { color: '#244B30', fontSize: 9, lineHeight: 13 },
  actionSubtitle: { color: '#697B6E', fontSize: 9, lineHeight: 12 },
  actionArrow: { position: 'absolute', right: 3, bottom: 7 },
  syncBanner: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(226,245,222,0.93)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    marginTop: 9,
  },
  syncIcon: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: '#F8FFF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  syncText: { flex: 1 },
  syncTitle: { color: '#315D3B', fontSize: 9, lineHeight: 13 },
  syncDescription: { color: '#708276', fontSize: 8, lineHeight: 12 },
});
