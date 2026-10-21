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
type LogType = 'Application Logs' | 'Blockchain Records';
type ActivityLog = {
  id: string;
  time: string;
  date: string;
  userId: string;
  role: string;
  action: string;
  module: string;
  icon: IconName;
  logType: LogType;
};

const logs: ActivityLog[] = [
  { id: 'LOG-1001', time: '10:35 AM', date: '2025-09-08', userId: 'FRM-0021', role: 'Farmer', action: 'Added chemical record', module: 'Mobile App', icon: 'leaf', logType: 'Application Logs' },
  { id: 'LOG-1002', time: '10:42 AM', date: '2025-09-08', userId: 'INS-0003', role: 'Inspector', action: 'Approved record', module: 'Mobile App', icon: 'check-circle-outline', logType: 'Blockchain Records' },
  { id: 'LOG-1003', time: '11:10 AM', date: '2025-09-08', userId: 'COL-0002', role: 'Collector', action: 'Recorded collection', module: 'Mobile App', icon: 'leaf', logType: 'Blockchain Records' },
  { id: 'LOG-1004', time: '11:25 AM', date: '2025-09-08', userId: 'ADM-0001', role: 'Admin', action: 'Created user', module: 'Web Dashboard', icon: 'monitor', logType: 'Application Logs' },
  { id: 'LOG-1005', time: '12:05 PM', date: '2025-09-08', userId: 'ADM-0001', role: 'Admin', action: 'Updated organization', module: 'Web Dashboard', icon: 'monitor', logType: 'Application Logs' },
  { id: 'LOG-1006', time: '12:40 PM', date: '2025-09-08', userId: 'FAC-0002', role: 'Factory Officer', action: 'Processed green leaf', module: 'Web Dashboard', icon: 'leaf', logType: 'Blockchain Records' },
  { id: 'LOG-1007', time: '01:15 PM', date: '2025-09-08', userId: 'SYS-0001', role: 'System', action: 'System backup', module: 'System', icon: 'cog-outline', logType: 'Application Logs' },
  { id: 'LOG-1008', time: '02:30 PM', date: '2025-09-08', userId: 'FRM-0032', role: 'Farmer', action: 'Updated profile', module: 'Mobile App', icon: 'leaf', logType: 'Application Logs' },
];

const userOptions = ['All Users', 'Farmer', 'Inspector', 'Collector', 'Admin', 'System'];
const actionOptions = ['All Actions', 'Created', 'Updated', 'Approved', 'Recorded', 'Processed'];
const moduleOptions = ['All Modules', 'Mobile App', 'Web Dashboard', 'System'];

function FilterSelect({
  label,
  value,
  options,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  icon: IconName;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.filterField}>
      <View style={styles.filterTitle}>
        <MaterialCommunityIcons name={icon} size={13} color="#287548" />
        <ThemedText type="small" style={styles.filterLabel}>{label}</ThemedText>
      </View>
      <View style={styles.selectWrap}>
        <TextInput
          accessibilityLabel={`${label} filter`}
          onChangeText={onChange}
          placeholder={value}
          placeholderTextColor="#718A7B"
          style={styles.selectInput}
          value={value === options[0] ? '' : value}
        />
        <Pressable
          accessibilityLabel={`Choose ${label.toLowerCase()}`}
          accessibilityRole="button"
          onPress={() => {
            const nextIndex = (options.indexOf(value) + 1) % options.length;
            onChange(options[nextIndex]);
          }}
          style={styles.selectButton}>
          <MaterialCommunityIcons name="chevron-down" size={16} color="#34744E" />
        </Pressable>
      </View>
    </View>
  );
}

export default function AdministratorActivityScreen() {
  const [logType, setLogType] = useState<LogType>('Application Logs');
  const [userFilter, setUserFilter] = useState('All Users');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [dateFilter, setDateFilter] = useState('');

  const visibleLogs = useMemo(() => logs.filter((log) => (
    log.logType === logType
    && (userFilter === 'All Users' || log.role === userFilter)
    && (actionFilter === 'All Actions' || log.action.toLowerCase().includes(actionFilter.toLowerCase()))
    && (moduleFilter === 'All Modules' || log.module === moduleFilter)
    && (!dateFilter.trim() || log.date.includes(dateFilter.trim()))
  )), [actionFilter, dateFilter, logType, moduleFilter, userFilter]);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    } else if (tab === 'Users') {
      router.replace('/administrator-users');
    } else if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
    } else if (tab === 'Activity') {
      return;
    } else {
      router.replace({ pathname: '/administrator-home', params: { section: tab } });
    }
  }

  function showLogDetails(log: ActivityLog) {
    Alert.alert(
      'Activity Log Details',
      `Log ID: ${log.id}\nTimestamp: ${log.time} · ${log.date}\nUser: ${log.userId} (${log.role})\nAction: ${log.action}\nModule: ${log.module}\nRecord type: ${log.logType}`,
    );
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
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>System Activity Logs</ThemedText>
            <Pressable
              accessibilityLabel="Refresh activity logs"
              accessibilityRole="button"
              onPress={() => Alert.alert('Activity Logs', 'These sample logs are up to date.')}
              style={styles.refreshButton}>
              <MaterialCommunityIcons name="history" size={20} color="#176B32" />
            </Pressable>
          </View>

          <View style={styles.filtersGrid}>
            <FilterSelect label="User" value={userFilter} options={userOptions} icon="account" onChange={setUserFilter} />
            <FilterSelect label="Action Type" value={actionFilter} options={actionOptions} icon="account-cog-outline" onChange={setActionFilter} />
            <View style={styles.filterField}>
              <View style={styles.filterTitle}>
                <MaterialCommunityIcons name="calendar-month" size={13} color="#287548" />
                <ThemedText type="small" style={styles.filterLabel}>Date</ThemedText>
              </View>
              <TextInput
                accessibilityLabel="Filter logs by date"
                onChangeText={setDateFilter}
                placeholder="Select Date (YYYY-MM-DD)"
                placeholderTextColor="#718A7B"
                style={styles.dateInput}
                value={dateFilter}
              />
            </View>
            <FilterSelect label="Module" value={moduleFilter} options={moduleOptions} icon="view-grid" onChange={setModuleFilter} />
          </View>

          <View style={styles.logTypeSwitch}>
            {(['Application Logs', 'Blockchain Records'] as const).map((type) => {
              const selected = logType === type;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={type}
                  onPress={() => setLogType(type)}
                  style={[styles.logTypeButton, selected && styles.logTypeButtonSelected]}>
                  <MaterialCommunityIcons
                    name={type === 'Application Logs' ? 'file-document-outline' : 'link-variant'}
                    size={14}
                    color={selected ? '#FFFFFF' : '#397453'}
                  />
                  <ThemedText type="smallBold" style={[styles.logTypeText, selected && styles.logTypeTextSelected]}>
                    {type}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <ThemedText type="smallBold" style={[styles.columnTitle, styles.timeColumn]}>Timestamp</ThemedText>
              <ThemedText type="smallBold" style={[styles.columnTitle, styles.userColumn]}>User</ThemedText>
              <ThemedText type="smallBold" style={[styles.columnTitle, styles.actionColumn]}>Action</ThemedText>
              <ThemedText type="smallBold" style={[styles.columnTitle, styles.moduleColumn]}>Module</ThemedText>
            </View>
            {visibleLogs.map((log) => (
              <Pressable
                accessibilityLabel={`View ${log.action} activity by ${log.userId}`}
                accessibilityRole="button"
                key={log.id}
                onPress={() => showLogDetails(log)}
                style={({ pressed }) => [styles.logRow, pressed && styles.pressed]}>
                <View style={[styles.timeColumn, styles.timestampCell]}>
                  <ThemedText type="small" style={styles.cellPrimary}>{log.time}</ThemedText>
                  <ThemedText type="small" style={styles.cellSecondary}>{log.date}</ThemedText>
                </View>
                <View style={[styles.userColumn, styles.userCell]}>
                  <View style={styles.userAvatar}>
                    <MaterialCommunityIcons name="account" size={13} color="#287548" />
                  </View>
                  <View style={styles.userText}>
                    <ThemedText type="smallBold" style={styles.cellPrimary}>{log.userId}</ThemedText>
                    <ThemedText type="small" style={styles.cellSecondary}>({log.role})</ThemedText>
                  </View>
                </View>
                <View style={styles.actionColumn}>
                  <ThemedText type="small" numberOfLines={2} style={styles.actionPill}>{log.action}</ThemedText>
                </View>
                <View style={[styles.moduleColumn, styles.moduleCell]}>
                  <View style={styles.moduleIcon}>
                    <MaterialCommunityIcons name={log.icon} size={13} color="#25854B" />
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={14} color="#659078" />
                </View>
              </Pressable>
            ))}
            {visibleLogs.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="file-search-outline" size={30} color="#70927A" />
                <ThemedText type="smallBold" style={styles.emptyTitle}>No activity found</ThemedText>
                <ThemedText type="small" style={styles.emptyText}>Try changing or clearing the filters.</ThemedText>
              </View>
            )}
          </View>
          <View style={styles.auditHint}>
            <MaterialCommunityIcons name="information" size={15} color="#21804A" />
            <View style={styles.auditCopy}>
              <ThemedText type="smallBold" style={styles.auditTitle}>Audit Trail Viewer</ThemedText>
              <ThemedText type="small" style={styles.auditText}>
                Track who performed each action, when and from which module.
              </ThemedText>
            </View>
          </View>
          <ThemedText type="small" style={styles.demoNote}>Sample audit data · connected service required for live logs</ThemedText>
        </ScrollView>
        <AdministratorBottomTabs activeTab="Activity" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 3, paddingBottom: 8 },
  header: { minHeight: 42, flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 16 },
  refreshButton: { width: 34, height: 38, alignItems: 'flex-end', justifyContent: 'center' },
  filtersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6, marginBottom: 8 },
  filterField: { width: '49%', minHeight: 47, borderWidth: 1, borderColor: '#D5E9DE', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 7, paddingTop: 4 },
  filterTitle: { height: 15, flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterLabel: { color: '#527360', fontSize: 8 },
  selectWrap: { flex: 1, minHeight: 23, borderRadius: 6, backgroundColor: '#F7FBF8', flexDirection: 'row', alignItems: 'center', paddingLeft: 6 },
  selectInput: { flex: 1, minWidth: 0, height: 23, paddingVertical: 0, color: '#668372', fontSize: 8 },
  selectButton: { width: 22, height: 23, alignItems: 'center', justifyContent: 'center' },
  dateInput: { flex: 1, height: 25, paddingVertical: 0, paddingHorizontal: 6, color: '#668372', fontSize: 8, backgroundColor: '#F7FBF8', borderRadius: 6 },
  logTypeSwitch: { minHeight: 34, borderRadius: 9, backgroundColor: 'rgba(240,250,244,0.96)', borderWidth: 1, borderColor: '#D7EADF', flexDirection: 'row', padding: 2, marginBottom: 8 },
  logTypeButton: { flex: 1, borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  logTypeButtonSelected: { backgroundColor: '#118343' },
  logTypeText: { color: '#456C54', fontSize: 8 },
  logTypeTextSelected: { color: '#FFFFFF' },
  table: { borderWidth: 1, borderColor: '#D7E9DF', borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.96)' },
  tableHeader: { minHeight: 25, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E9F8EF', paddingHorizontal: 5 },
  columnTitle: { color: '#527561', fontSize: 7 },
  timeColumn: { width: '19%' },
  userColumn: { width: '25%' },
  actionColumn: { width: '35%', paddingRight: 3 },
  moduleColumn: { width: '21%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logRow: { minHeight: 48, borderTopWidth: 1, borderTopColor: '#E6F0E8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 3 },
  timestampCell: { justifyContent: 'center' },
  cellPrimary: { color: '#577463', fontSize: 7, lineHeight: 10 },
  cellSecondary: { color: '#81958A', fontSize: 6, lineHeight: 9 },
  userCell: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  userAvatar: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#DDF2E0', alignItems: 'center', justifyContent: 'center' },
  userText: { flex: 1, minWidth: 0 },
  actionPill: { alignSelf: 'flex-start', maxWidth: '100%', overflow: 'hidden', borderRadius: 8, color: '#47765A', backgroundColor: '#E7F8E9', fontSize: 6, lineHeight: 9, paddingHorizontal: 5, paddingVertical: 3 },
  moduleCell: { minHeight: 28 },
  moduleIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#E5F5E6', alignItems: 'center', justifyContent: 'center' },
  emptyState: { minHeight: 145, alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyTitle: { color: '#315E42', fontSize: 11 },
  emptyText: { color: '#758579', fontSize: 8 },
  auditHint: { minHeight: 43, borderRadius: 9, backgroundColor: 'rgba(225,246,231,0.95)', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 9, marginTop: 7 },
  auditCopy: { flex: 1 },
  auditTitle: { color: '#38724A', fontSize: 8 },
  auditText: { color: '#688373', fontSize: 7, lineHeight: 10 },
  demoNote: { color: '#829184', fontSize: 7, textAlign: 'center', marginTop: 6 },
  pressed: { opacity: 0.82 },
});
