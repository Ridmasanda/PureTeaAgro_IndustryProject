import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

const transactions = [
  { id: '0x3FA9...2D11', record: 'COL-0008', error: 'Gas limit exceeded', time: '2025-09-07 04:21 PM' },
  { id: '0x81B2...7F40', record: 'INS-0012', error: 'Confirmation timeout', time: '2025-09-07 02:14 PM' },
];

function MetricCard({
  icon,
  label,
  value,
  change,
  tone,
}: {
  icon: 'cube-outline' | 'check-circle' | 'clock-outline' | 'alert-circle';
  label: string;
  value: string;
  change: string;
  tone: 'green' | 'red';
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, tone === 'red' && styles.metricIconRed]}>
        <MaterialCommunityIcons name={icon} size={17} color={tone === 'red' ? '#E64C4C' : '#168043'} />
      </View>
      <ThemedText type="small" style={styles.metricLabel}>{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.metricValue}>{value}</ThemedText>
      <ThemedText type="small" style={[styles.metricChange, tone === 'red' && styles.metricChangeRed]}>
        {tone === 'red' ? '↓' : '↑'} {change}
      </ThemedText>
    </View>
  );
}

export default function AdministratorBlockchainMonitoringScreen() {
  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    } else if (tab === 'Users') {
      router.replace('/administrator-users');
    } else if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
    } else if (tab === 'Activity') {
      router.replace('/administrator-activity');
    } else if (tab === 'Settings') {
      router.replace('/administrator-settings');
    }
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to system settings"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-settings')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={21} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>Blockchain Monitoring</ThemedText>
            <Pressable
              accessibilityLabel="Refresh blockchain monitoring"
              accessibilityRole="button"
              onPress={() => Alert.alert('Blockchain Network', 'Sample monitoring data is up to date.')}
              style={styles.headerAction}>
              <MaterialCommunityIcons name="lan" size={19} color="#176B32" />
            </Pressable>
          </View>

          <View style={styles.networkCard}>
            <View style={styles.networkIcon}>
              <MaterialCommunityIcons name="lan" size={29} color="#198246" />
            </View>
            <View style={styles.networkCopy}>
              <ThemedText type="smallBold" style={styles.networkTitle}>Blockchain Network</ThemedText>
              <View style={styles.networkStatusRow}>
                <ThemedText type="small" style={styles.networkLabel}>Status</ThemedText>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <ThemedText type="smallBold" style={styles.connectedText}>Connected</ThemedText>
                </View>
              </View>
              <ThemedText type="small" style={styles.networkMeta}>Network: Ethereum (Testnet)</ThemedText>
              <ThemedText type="small" style={styles.networkMeta}>Last Sync: 2 mins ago</ThemedText>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard icon="cube-outline" label="Total Transactions" value="1,248" change="12%" tone="green" />
            <MetricCard icon="check-circle" label="Confirmed" value="1,231" change="12%" tone="green" />
            <MetricCard icon="clock-outline" label="Pending" value="14" change="2%" tone="green" />
            <MetricCard icon="alert-circle" label="Failed" value="3" change="1%" tone="red" />
          </View>

          <View style={styles.sectionHeading}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>Latest Transaction</ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert('Transactions', 'The transaction explorer will be available when the blockchain service is connected.')}
              style={styles.viewAll}>
              <ThemedText type="smallBold" style={styles.viewAllText}>View All</ThemedText>
              <MaterialCommunityIcons name="chevron-right" size={14} color="#34784C" />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Transaction Details', 'Transaction: 0xAB12...7F4C\nRecord: AGR-00124\nType: Green Leaf Collection\nTime: 2025-09-08 10:42 AM')}
            style={({ pressed }) => [styles.latestCard, pressed && styles.pressed]}>
            <View style={styles.transactionIcon}>
              <MaterialCommunityIcons name="cube-outline" size={19} color="#178044" />
            </View>
            <View style={styles.latestCopy}>
              <View style={styles.transactionIdRow}>
                <ThemedText type="smallBold" style={styles.transactionId}>TX ID: 0xAB12...7F4C</ThemedText>
                <MaterialCommunityIcons name="content-copy" size={11} color="#57906A" />
              </View>
              <ThemedText type="small" style={styles.transactionMeta}>Record: AGR-00124</ThemedText>
              <ThemedText type="small" style={styles.transactionMeta}>Type: Green Leaf Collection</ThemedText>
              <ThemedText type="small" style={styles.transactionMeta}>Time: 2025-09-08 10:42 AM</ThemedText>
            </View>
            <View style={styles.latestTrailing}>
              <View style={styles.confirmedPill}>
                <ThemedText type="smallBold" style={styles.confirmedPillText}>Confirmed</ThemedText>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={17} color="#527B61" />
            </View>
          </Pressable>

          <View style={styles.statusCard}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>Transaction Confirmation Status</ThemedText>
            <View style={styles.statusContent}>
              <View style={styles.chartRing}>
                <View style={styles.chartInner}>
                  <ThemedText type="smallBold" style={styles.chartPercent}>98%</ThemedText>
                </View>
              </View>
              <View style={styles.legend}>
                <LegendItem color="#22A85A" label="Confirmed" value="1,231" />
                <LegendItem color="#FFC943" label="Pending" value="14" />
                <LegendItem color="#F04A62" label="Failed" value="3" />
              </View>
            </View>
          </View>

          <View style={styles.failedCard}>
            <View style={styles.failedHeading}>
              <View style={styles.failedTitleWrap}>
                <MaterialCommunityIcons name="alert" size={15} color="#E34B4B" />
                <ThemedText type="smallBold" style={styles.sectionTitle}>Failed Transactions</ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => Alert.alert('Failed Transactions', 'Showing recent failed transactions only.')}
                style={styles.viewAll}>
                <ThemedText type="smallBold" style={styles.viewAllText}>View All</ThemedText>
                <MaterialCommunityIcons name="chevron-right" size={13} color="#34784C" />
              </Pressable>
            </View>
            <View style={styles.failedTableHeader}>
              <ThemedText type="smallBold" style={styles.failedIdColumn}>TX ID</ThemedText>
              <ThemedText type="smallBold" style={styles.failedRecordColumn}>Record</ThemedText>
              <ThemedText type="smallBold" style={styles.failedErrorColumn}>Error</ThemedText>
              <ThemedText type="smallBold" style={styles.failedTimeColumn}>Time</ThemedText>
            </View>
            {transactions.slice(0, 1).map((transaction) => (
              <Pressable
                accessibilityRole="button"
                key={transaction.id}
                onPress={() => Alert.alert('Failed Transaction', `${transaction.id}\n${transaction.record}\n${transaction.error}\n${transaction.time}`)}
                style={styles.failedRow}>
                <ThemedText type="small" numberOfLines={1} style={[styles.failedCell, styles.failedIdColumn]}>{transaction.id}</ThemedText>
                <ThemedText type="small" numberOfLines={1} style={[styles.failedCell, styles.failedRecordColumn]}>{transaction.record}</ThemedText>
                <ThemedText type="small" numberOfLines={1} style={[styles.failedError, styles.failedErrorColumn]}>{transaction.error}</ThemedText>
                <ThemedText type="small" numberOfLines={1} style={[styles.failedCell, styles.failedTimeColumn]}>{transaction.time}</ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.syncCard}>
            <MaterialCommunityIcons name="sync" size={20} color="#168043" />
            <View style={styles.syncCopy}>
              <ThemedText type="smallBold" style={styles.syncTitle}>Last Synchronization</ThemedText>
              <ThemedText type="small" style={styles.syncTime}>2025-09-08 10:35 AM</ThemedText>
            </View>
            <View style={styles.syncBadge}>
              <MaterialCommunityIcons name="check-circle" size={11} color="#168043" />
              <ThemedText type="smallBold" style={styles.syncBadgeText}>Successful</ThemedText>
            </View>
          </View>
          <ThemedText type="small" style={styles.demoNote}>Sample blockchain metrics · live data requires a connected network</ThemedText>
        </ScrollView>
        <AdministratorBottomTabs activeTab="Settings" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="small" style={styles.legendLabel}>{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.legendValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 11, paddingTop: 2, paddingBottom: 7 },
  header: { minHeight: 39, flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  backButton: { width: 33, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 15 },
  headerAction: { width: 32, height: 36, alignItems: 'flex-end', justifyContent: 'center' },
  networkCard: { minHeight: 76, borderWidth: 1, borderColor: '#D6EADF', borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 9, paddingVertical: 6 },
  networkIcon: { width: 51, height: 51, borderRadius: 27, backgroundColor: '#E1F6E0', alignItems: 'center', justifyContent: 'center' },
  networkCopy: { flex: 1, gap: 2 },
  networkTitle: { color: '#315E42', fontSize: 9 },
  networkStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  networkLabel: { color: '#758A7D', fontSize: 7 },
  connectedBadge: { minHeight: 16, borderRadius: 9, backgroundColor: '#E5F7E7', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7 },
  connectedDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#22A653' },
  connectedText: { color: '#32754A', fontSize: 7 },
  networkMeta: { color: '#758A7D', fontSize: 7, lineHeight: 10 },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 5, marginTop: 6 },
  metricCard: { flex: 1, minWidth: 0, minHeight: 75, borderWidth: 1, borderColor: '#D9EAE2', borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 6, paddingVertical: 5 },
  metricIcon: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#E5F6E6', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  metricIconRed: { backgroundColor: '#FCE8E6' },
  metricLabel: { color: '#668172', fontSize: 6, lineHeight: 9 },
  metricValue: { color: '#315D42', fontSize: 11, lineHeight: 14 },
  metricChange: { color: '#19844A', fontSize: 6 },
  metricChangeRed: { color: '#DC4D4D' },
  sectionHeading: { minHeight: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  sectionTitle: { color: '#315E42', fontSize: 9 },
  viewAll: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#34784C', fontSize: 7 },
  latestCard: { minHeight: 62, borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.96)', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 7, paddingVertical: 5 },
  transactionIcon: { width: 30, height: 30, borderRadius: 16, backgroundColor: '#E2F5E2', alignItems: 'center', justifyContent: 'center' },
  latestCopy: { flex: 1, minWidth: 0, gap: 1 },
  transactionIdRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  transactionId: { color: '#416C50', fontSize: 7 },
  transactionMeta: { color: '#819389', fontSize: 6, lineHeight: 8 },
  latestTrailing: { minHeight: 42, alignItems: 'flex-end', justifyContent: 'space-between' },
  confirmedPill: { borderRadius: 9, backgroundColor: '#E2F8E5', paddingHorizontal: 6, paddingVertical: 3 },
  confirmedPillText: { color: '#38804B', fontSize: 6 },
  statusCard: { minHeight: 96, borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.96)', padding: 7, marginTop: 5 },
  statusContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
  chartRing: { width: 59, height: 59, borderRadius: 31, borderWidth: 7, borderColor: '#29A254', alignItems: 'center', justifyContent: 'center' },
  chartInner: { width: 43, height: 43, borderRadius: 23, borderWidth: 1, borderColor: '#DCECE0', alignItems: 'center', justifyContent: 'center' },
  chartPercent: { color: '#3A7450', fontSize: 9 },
  legend: { width: '55%', gap: 5 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendLabel: { flex: 1, color: '#668172', fontSize: 7 },
  legendValue: { color: '#577463', fontSize: 7 },
  failedCard: { borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.96)', marginTop: 5, overflow: 'hidden' },
  failedHeading: { minHeight: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6 },
  failedTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  failedTableHeader: { minHeight: 18, backgroundColor: '#F1FAF4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  failedIdColumn: { width: '25%' },
  failedRecordColumn: { width: '20%' },
  failedErrorColumn: { width: '28%' },
  failedTimeColumn: { width: '27%' },
  failedRow: { minHeight: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  failedCell: { color: '#788B7E', fontSize: 5 },
  failedError: { color: '#D04D4D', fontSize: 5 },
  syncCard: { minHeight: 38, borderWidth: 1, borderColor: '#D9EADF', borderRadius: 9, backgroundColor: 'rgba(237,250,238,0.96)', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, marginTop: 5 },
  syncCopy: { flex: 1 },
  syncTitle: { color: '#3B7650', fontSize: 7 },
  syncTime: { color: '#819389', fontSize: 6 },
  syncBadge: { minHeight: 18, borderRadius: 10, backgroundColor: '#DDF7E0', flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6 },
  syncBadgeText: { color: '#38774A', fontSize: 6 },
  demoNote: { color: '#829184', fontSize: 6, textAlign: 'center', marginTop: 4 },
  pressed: { opacity: 0.83 },
});
