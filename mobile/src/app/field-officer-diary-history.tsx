import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type DiaryRecord = {
  date: string;
  activity: string;
  farmer: string;
  land: string;
  workers: string;
  hours: string;
  remarks: string;
  status: 'Completed' | 'Pending';
  icon: IconName;
  tone: 'green' | 'yellow';
};

const diaryRecords: DiaryRecord[] = [
  {
    date: '02 Oct 2026',
    activity: 'Plucking',
    farmer: 'Nimal Perera',
    land: 'TL-001',
    workers: '12 workers',
    hours: '6',
    remarks: 'Good plant condition.',
    status: 'Completed',
    icon: 'leaf',
    tone: 'green',
  },
  {
    date: '30 Sep 2026',
    activity: 'Fertilizer Application',
    farmer: 'Sunil Silva',
    land: 'TL-003',
    workers: '8 workers',
    hours: '5',
    remarks: 'Fertilizer applied evenly.',
    status: 'Completed',
    icon: 'beaker-outline',
    tone: 'green',
  },
  {
    date: '28 Sep 2026',
    activity: 'Chemical Application',
    farmer: 'Kamalani Fernando',
    land: 'TL-002',
    workers: '10 workers',
    hours: '4',
    remarks: 'Application completed safely.',
    status: 'Completed',
    icon: 'flask-outline',
    tone: 'green',
  },
  {
    date: '25 Sep 2026',
    activity: 'Weed Control',
    farmer: 'Wijesinghe Rohan',
    land: 'TL-004',
    workers: '14 workers',
    hours: '6',
    remarks: 'Good plant condition.',
    status: 'Pending',
    icon: 'sprout-outline',
    tone: 'yellow',
  },
];

function BottomTab({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.bottomTab}>
      <MaterialCommunityIcons name={icon} size={17} color={active ? '#087A4A' : '#8C9AA8'} />
      <ThemedText style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

function DiaryCard({ record, onPress }: { record: DiaryRecord; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`${record.date}, ${record.activity}, ${record.farmer}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.recordCard, pressed && styles.pressed]}>
      <View style={styles.recordDate}>
        <ThemedText style={styles.recordSmall}>
          <MaterialCommunityIcons name="calendar-outline" size={12} color="#17865A" /> {record.date}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.recordFarmer}>
          <MaterialCommunityIcons name="account-outline" size={12} color="#17865A" /> {record.farmer}
        </ThemedText>
        <ThemedText style={styles.recordSmall}>
          <MaterialCommunityIcons name="sprout-outline" size={12} color="#17865A" /> Land {record.land}
        </ThemedText>
      </View>
      <View style={styles.recordActivity}>
        <ThemedText type="smallBold" style={styles.activityName}>
          <MaterialCommunityIcons name={record.icon} size={13} color="#07945E" /> {record.activity}
        </ThemedText>
        <ThemedText style={styles.recordSmall}>
          <MaterialCommunityIcons name="account-group-outline" size={12} color="#94A4AC" /> {record.workers}
        </ThemedText>
        <View style={[styles.recordStatus, record.tone === 'yellow' && styles.pendingStatus]}>
          <ThemedText style={[styles.recordStatusText, record.tone === 'yellow' && styles.pendingStatusText]}>
            {record.status}
          </ThemedText>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={19} color="#91A8B1" />
    </Pressable>
  );
}

export default function FieldOfficerDiaryHistoryScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(diaryRecords[3]);
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return diaryRecords;
    return diaryRecords.filter((record) =>
      `${record.farmer} ${record.activity} ${record.land}`.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView bounces={false} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={21} color="#167A4D" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>Field Diary History</ThemedText>
              <ThemedText style={styles.headerBrand}>PureTeaAgro</ThemedText>
            </View>

            <View style={styles.searchField}>
              <MaterialCommunityIcons name="magnify" size={17} color="#149467" />
              <TextInput
                accessibilityLabel="Search diary history"
                onChangeText={setSearch}
                placeholder="Search by farmer, land or activity..."
                placeholderTextColor="#8FA6A7"
                style={styles.searchInput}
                value={search}
              />
              <MaterialCommunityIcons name="leaf" size={14} color="#C3D99D" />
            </View>

            <Pressable accessibilityRole="button" style={styles.dateRange}>
              <MaterialCommunityIcons name="calendar-month-outline" size={17} color="#148E5A" />
              <View style={styles.dateCopy}>
                <ThemedText type="smallBold" style={styles.dateTitle}>Date Range</ThemedText>
                <ThemedText style={styles.dateValue}>All Dates</ThemedText>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={17} color="#8AA2AC" />
            </Pressable>

            <ThemedText type="smallBold" style={styles.count}>12 diary records</ThemedText>
            <View style={styles.records}>
              {filteredRecords.map((record) => (
                <DiaryCard key={`${record.date}-${record.farmer}`} record={record} onPress={() => setSelected(record)} />
              ))}
            </View>

            <View style={styles.detailPanel}>
              <View style={styles.detailHeader}>
                <ThemedText type="smallBold" style={styles.detailTitle}>
                  <MaterialCommunityIcons name="file-document-outline" size={14} color="#18784E" /> Field Diary Details
                </ThemedText>
                <Pressable accessibilityLabel="Close diary details" accessibilityRole="button" onPress={() => setSelected(diaryRecords[0])}>
                  <MaterialCommunityIcons name="close" size={16} color="#9AAEB0" />
                </Pressable>
              </View>
              <View style={styles.detailGrid}>
                <DetailValue label="DATE" value={selected.date} icon="calendar-outline" />
                <DetailValue label="ACTIVITY" value={selected.activity} icon={selected.icon} />
                <DetailValue label="FARMER" value={selected.farmer} icon="account-outline" />
                <DetailValue label="WORKERS" value={selected.workers.replace(' workers', '')} icon="account-group-outline" />
                <DetailValue label="TEA LAND" value={selected.land} icon="sprout-outline" />
                <DetailValue label="WORKING HOURS" value={selected.hours} icon="clock-outline" />
                <DetailValue label="REMARKS" value={selected.remarks} icon="comment-outline" />
              </View>
              <Pressable accessibilityLabel="Back to diary list" accessibilityRole="button" style={styles.backToList}>
                <MaterialCommunityIcons name="arrow-left" size={14} color="#18784E" />
                <ThemedText type="smallBold" style={styles.backToListText}>Back to List</ThemedText>
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
            <BottomTab icon="account-group-outline" label="Farmers" onPress={() => router.push('./field-officer-farmers')} />
            <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
            <BottomTab icon="clipboard-text-outline" label="Diary" active />
            <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function DetailValue({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <View style={styles.detailValue}>
      <ThemedText style={styles.detailLabel}>
        <MaterialCommunityIcons name={icon} size={11} color="#168B59" /> {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.detailText}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.3)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  content: { paddingBottom: 12 },
  header: { height: 55, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, backgroundColor: 'rgba(250,255,251,0.75)' },
  backButton: { width: 28, height: 30, justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#173E36', fontSize: 15, lineHeight: 20, marginLeft: 7 },
  headerBrand: { color: '#5AA486', fontSize: 7, lineHeight: 10 },
  searchField: { height: 32, borderRadius: 9, borderWidth: 1, borderColor: '#B9ECCE', backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginHorizontal: 12, marginTop: 10 },
  searchInput: { flex: 1, color: '#385850', fontSize: 9, paddingVertical: 0, marginHorizontal: 7 },
  dateRange: { height: 39, borderRadius: 9, borderWidth: 1, borderColor: '#B9ECCE', backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginHorizontal: 12, marginTop: 9 },
  dateCopy: { flex: 1, marginLeft: 8 },
  dateTitle: { color: '#304B4B', fontSize: 9, lineHeight: 12 },
  dateValue: { color: '#718782', fontSize: 8, lineHeight: 11 },
  count: { color: '#1A5940', fontSize: 9, lineHeight: 12, marginHorizontal: 13, marginTop: 12, marginBottom: 6 },
  records: { marginHorizontal: 12, gap: 7 },
  recordCard: { minHeight: 70, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: '#D6EEE0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9 },
  recordDate: { flex: 1.05, gap: 3 },
  recordActivity: { flex: 1.2, gap: 3 },
  recordSmall: { color: '#788B8E', fontSize: 7, lineHeight: 10 },
  recordFarmer: { color: '#263F3F', fontSize: 8, lineHeight: 11 },
  activityName: { color: '#27443E', fontSize: 8, lineHeight: 11 },
  recordStatus: { alignSelf: 'flex-start', borderRadius: 8, backgroundColor: '#D9F6E6', paddingHorizontal: 7, paddingVertical: 2 },
  pendingStatus: { backgroundColor: '#FFF1BE' },
  recordStatusText: { color: '#1A8A54', fontSize: 7, lineHeight: 9 },
  pendingStatusText: { color: '#A87900' },
  detailPanel: { marginHorizontal: 3, marginTop: 14, borderRadius: 12, backgroundColor: 'rgba(238, 253, 244, 0.96)', borderWidth: 1, borderColor: '#D0EEDD', padding: 10 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  detailTitle: { color: '#245541', fontSize: 10, lineHeight: 14 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  detailValue: { width: '50%' },
  detailLabel: { color: '#87A29A', fontSize: 7, lineHeight: 10 },
  detailText: { color: '#2C4D42', fontSize: 8, lineHeight: 11, marginTop: 2 },
  backToList: { height: 27, borderRadius: 8, borderWidth: 1, borderColor: '#A5E7C4', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 12 },
  backToListText: { color: '#18784E', fontSize: 8, lineHeight: 11 },
  bottomNavigation: { height: 55, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 45 },
  bottomLabel: { color: '#8C9AA8', fontSize: 7, lineHeight: 10 },
  bottomLabelActive: { color: '#087A4A', fontWeight: '700' },
  pressed: { opacity: 0.82 },
});
