import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CollectorDashboardShell } from '@/app/collector-dashboard-shell';

type CollectionStatus = 'Recorded' | 'Pending' | 'Completed';
type FilterKey = 'farmer' | 'factory' | 'status';
type CollectionRecord = {
  id: string;
  farmer: string;
  weight: string;
  date: string;
  factory: string;
  status: CollectionStatus;
};

const records: CollectionRecord[] = [
  { id: 'COL-000125', farmer: 'Nimal Perera', weight: '245 kg', date: '2025-09-08', factory: 'Main Factory', status: 'Recorded' },
  { id: 'COL-000124', farmer: 'Kamala Silva', weight: '180 kg', date: '2025-09-07', factory: 'Thalawakale Factory', status: 'Pending' },
  { id: 'COL-000123', farmer: 'Sampath Wickramasinghe', weight: '275 kg', date: '2025-09-06', factory: 'Main Factory', status: 'Completed' },
  { id: 'COL-000122', farmer: 'Sunil Fernando', weight: '210 kg', date: '2025-09-05', factory: 'Thalawakale Factory', status: 'Completed' },
];

const filterOptions: Record<FilterKey, string[]> = {
  farmer: ['All Farmers', ...records.map((record) => record.farmer)],
  factory: ['All Factories', ...Array.from(new Set(records.map((record) => record.factory)))],
  status: ['All Status', 'Recorded', 'Pending', 'Completed'],
};

const filterLabels: Record<FilterKey, string> = {
  farmer: 'Farmer',
  factory: 'Factory',
  status: 'Status',
};

const filterDefaults: Record<FilterKey, string> = {
  farmer: 'All Farmers',
  factory: 'All Factories',
  status: 'All Status',
};

export default function CollectorCollectionHistoryScreen() {
  const [filters, setFilters] = useState(filterDefaults);
  const [expandedFilter, setExpandedFilter] = useState<FilterKey | null>(null);
  const filteredRecords = records.filter((record) => (
    (filters.farmer === 'All Farmers' || record.farmer === filters.farmer)
    && (filters.factory === 'All Factories' || record.factory === filters.factory)
    && (filters.status === 'All Status' || record.status === filters.status)
  ));

  function renderFilter(key: FilterKey, icon: 'account-outline' | 'factory' | 'check-circle') {
    const expanded = expandedFilter === key;
    return (
      <View key={key}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpandedFilter(expanded ? null : key)}
          style={styles.filterRow}>
          <MaterialCommunityIcons name={icon} size={16} color="#31764A" />
          <View style={styles.filterText}>
            <ThemedText type="smallBold" style={styles.filterLabel}>{filterLabels[key]}</ThemedText>
            <ThemedText type="small" style={styles.filterValue}>{filters[key]}</ThemedText>
          </View>
          <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={17} color="#789080" />
        </Pressable>
        {expanded && (
          <View style={styles.options}>
            {filterOptions[key].map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setFilters((current) => ({ ...current, [key]: option }));
                  setExpandedFilter(null);
                }}
                style={styles.option}>
                <ThemedText type="small" style={styles.optionText}>{option}</ThemedText>
                {filters[key] === option && <MaterialCommunityIcons name="check" size={16} color="#247840" />}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <CollectorDashboardShell activeTab="Collections">
          <View style={styles.heading}>
            <View style={styles.headingTitle}>
              <MaterialCommunityIcons name="history" size={23} color="#24733E" />
              <ThemedText type="smallBold" style={styles.title}>Collection History</ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/collector-new-collection')}
              style={({ pressed }) => [styles.newCollectionButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.newCollectionText}>New</ThemedText>
            </Pressable>
          </View>
          <View style={styles.filtersCard}>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-month-outline" size={16} color="#31764A" />
              <View style={styles.filterText}>
                <ThemedText type="smallBold" style={styles.filterLabel}>Date</ThemedText>
                <ThemedText type="small" style={styles.filterValue}>01/09/2025 - 08/09/2025</ThemedText>
              </View>
              <MaterialCommunityIcons name="calendar" size={15} color="#789080" />
            </View>
            {renderFilter('farmer', 'account-outline')}
            {renderFilter('factory', 'factory')}
            {renderFilter('status', 'check-circle')}
          </View>
          <View style={styles.records}>
            {filteredRecords.map((record) => (
              <Pressable
                accessibilityRole="button"
                key={record.id}
                style={({ pressed }) => [styles.recordCard, pressed && styles.pressed]}>
                <View style={styles.recordIcon}>
                  <MaterialCommunityIcons name="leaf" size={22} color="#3B9148" />
                </View>
                <View style={styles.recordDetails}>
                  <View style={styles.recordTitleRow}>
                    <ThemedText type="smallBold" style={styles.recordId}>{record.id}</ThemedText>
                    <View style={[styles.statusPill, record.status === 'Pending' ? styles.pending : styles.done]}>
                      <ThemedText type="smallBold" style={[styles.statusText, record.status === 'Pending' && styles.pendingText]}>
                        {record.status}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText type="small" style={styles.farmer}>{record.farmer}</ThemedText>
                  <View style={styles.meta}>
                    <MaterialCommunityIcons name="calendar-outline" size={12} color="#559060" />
                    <ThemedText type="small" style={styles.metaText}>{record.date}</ThemedText>
                    <MaterialCommunityIcons name="weight-kilogram" size={12} color="#559060" />
                    <ThemedText type="small" style={styles.metaText}>{record.weight}</ThemedText>
                  </View>
                  <View style={styles.meta}>
                    <MaterialCommunityIcons name="factory" size={12} color="#559060" />
                    <ThemedText type="small" style={styles.metaText}>{record.factory}</ThemedText>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={19} color="#54815F" />
              </Pressable>
            ))}
            {filteredRecords.length === 0 && (
              <View style={styles.empty}>
                <ThemedText type="small" style={styles.emptyText}>No collection records match these filters.</ThemedText>
              </View>
            )}
          </View>
          <ThemedText type="small" style={styles.demoLabel}>Sample collection history</ThemedText>
    </CollectorDashboardShell>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.88 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9, marginBottom: 8 },
  headingTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { color: '#174A2A', fontSize: 19, lineHeight: 25 },
  newCollectionButton: {
    minHeight: 34,
    borderRadius: 9,
    backgroundColor: '#14743A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    marginLeft: 5,
  },
  newCollectionText: { color: '#FFFFFF', fontSize: 10 },
  filtersCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  dateRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2ED',
    paddingHorizontal: 2,
  },
  filterRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2ED',
    paddingHorizontal: 2,
  },
  filterText: { flex: 1, marginLeft: 8 },
  filterLabel: { color: '#375640', fontSize: 10, lineHeight: 13 },
  filterValue: { color: '#789080', fontSize: 10, lineHeight: 13 },
  options: { borderBottomWidth: 1, borderBottomColor: '#EDF2ED', paddingLeft: 25, paddingBottom: 4 },
  option: { minHeight: 33, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6 },
  optionText: { color: '#526D59', fontSize: 10 },
  records: { gap: 6 },
  recordCard: {
    minHeight: 62,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  recordIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F6E3',
    marginRight: 8,
  },
  recordDetails: { flex: 1, minWidth: 0 },
  recordTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  recordId: { color: '#31583B', fontSize: 10, lineHeight: 14 },
  statusPill: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  done: { backgroundColor: '#DDF4D8' },
  pending: { backgroundColor: '#FFF0C9' },
  statusText: { color: '#2F783B', fontSize: 8, lineHeight: 11 },
  pendingText: { color: '#A96A00' },
  farmer: { color: '#6D8072', fontSize: 9, lineHeight: 12, marginBottom: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, minHeight: 13 },
  metaText: { color: '#708276', fontSize: 8, lineHeight: 11, marginRight: 5 },
  empty: { padding: 20, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center' },
  emptyText: { color: '#697B6E', fontSize: 12, textAlign: 'center' },
  demoLabel: { color: '#87958A', fontSize: 9, textAlign: 'center', marginTop: 6, marginBottom: 2 },
});
