import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type ReportScreen = 'reports' | 'traceability' | 'verification';
type FilterName = 'Date' | 'Farmer' | 'Field Officer' | 'Batch' | 'Grade';

const green = '#087B4A';
const filters: FilterName[] = ['Date', 'Farmer', 'Field Officer', 'Batch', 'Grade'];

const reportCards: {
  title: string;
  description: string;
  icon: IconName;
  color: string;
  kind: 'green' | 'chemical' | 'diary' | 'production' | 'dispatch' | 'phi';
}[] = [
  {
    title: 'Green Leaf Collection Report',
    description: 'Collection & weight details',
    icon: 'flask-outline',
    color: '#1A9C70',
    kind: 'green',
  },
  {
    title: 'Chemical Usage Report',
    description: 'Usage & distribution',
    icon: 'flask',
    color: '#118A70',
    kind: 'chemical',
  },
  {
    title: 'Field Diary Report',
    description: 'Field visits & observations',
    icon: 'clipboard-text-outline',
    color: '#168E74',
    kind: 'diary',
  },
  {
    title: 'Production Report',
    description: 'Batch & production details',
    icon: 'factory',
    color: '#148B69',
    kind: 'production',
  },
  {
    title: 'Tea Dispatch Report',
    description: 'Dispatch records & sales',
    icon: 'truck-delivery-outline',
    color: '#138A70',
    kind: 'dispatch',
  },
  {
    title: 'PHI / Traceability Report',
    description: 'Full traceability & PHI status',
    icon: 'shield-check-outline',
    color: '#148A58',
    kind: 'phi',
  },
];

const timeline: { title: string; date: string; icon: IconName; value?: string; completed?: boolean }[] = [
  { title: 'Tea Dispatch', date: '26 Sep 2026', icon: 'truck-delivery-outline', completed: true },
  { title: 'Shifting Date', date: '27 Sep 2026', icon: 'calendar-outline', completed: true },
  { title: 'Manufactured Date', date: '26 Sep 2026', icon: 'factory', completed: true },
  { title: 'Processing Batch', date: 'BATCH-00125', icon: 'cog-outline', completed: true },
  { title: 'Green Leaf Collection', date: '25 Sep 2026', icon: 'leaf', completed: true },
  { title: 'Tea Leaves Plucked Date', date: '20 Sep 2026', icon: 'leaf-maple', completed: true },
  { title: 'Agrochemical Application', date: '18 Sep 2026', icon: 'flask-outline', completed: true },
  { title: 'PHI', date: 'Completed', icon: 'shield-check-outline', completed: true, value: 'Valid' },
];

const filterOptions: Record<FilterName, string[]> = {
  Date: ['Select date', 'Today', 'This week', 'This month', 'September 2026'],
  Farmer: ['All', 'Nimal Perera', 'Kamal Perera', 'Sanjewa Silva'],
  'Field Officer': ['All', 'Kamal Perera', 'Sanjewa Silva', 'Nimal Perera'],
  Batch: ['All', 'BATCH-00125', 'BATCH-00120', 'BATCH-00118'],
  Grade: ['All', 'OP', 'OP1', 'BOPF', 'FBOP'],
};

const bottomItems: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

export default function FactoryReportsScreen() {
  const [screen, setScreen] = useState<ReportScreen>('reports');
  const [selectedFilter, setSelectedFilter] = useState<FilterName | null>(null);
  const [filterValues, setFilterValues] = useState<Record<FilterName, string>>({
    Date: 'Select date',
    Farmer: 'All',
    'Field Officer': 'All',
    Batch: 'All',
    Grade: 'All',
  });

  const back = () => {
    if (screen === 'verification') setScreen('traceability');
    else if (screen === 'traceability') setScreen('reports');
    else router.back();
  };

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#30473A" />
          </Pressable>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={15} color={green} />
            <ThemedText type="smallBold" style={styles.brandName}>PureTeaAgro</ThemedText>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {screen === 'reports' ? (
          <ReportsList
            filterValues={filterValues}
            onFilter={(filter) => setSelectedFilter(filter)}
            onOpenReport={(kind) => setScreen(kind === 'phi' ? 'traceability' : 'traceability')}
          />
        ) : null}

        {screen === 'traceability' ? (
          <TraceabilityScreen onOpenVerification={() => setScreen('verification')} />
        ) : null}

        {screen === 'verification' ? <VerificationDetailsScreen /> : null}

        <View style={styles.bottomNav}>
          {bottomItems.map(([label, icon]) => {
            const selected = label === 'Reports';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                key={label}
                onPress={() => {
                  if (label === 'Home') router.replace('/factory-officer-dashboard');
                  else if (label === 'Books') router.replace('/factory-books');
                  else if (label === 'Alerts') router.replace('/factory-officer-notifications');
                  else if (label === 'Reports') setScreen('reports');
                  else router.replace('/factory-officer-profile');
                }}
                style={styles.navItem}>
                <MaterialCommunityIcons name={icon} size={18} color={selected ? green : '#7B8780'} />
                <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <FilterModal
          filter={selectedFilter}
          value={selectedFilter ? filterValues[selectedFilter] : ''}
          onClose={() => setSelectedFilter(null)}
          onSelect={(value) => {
            if (selectedFilter) {
              setFilterValues((current) => ({ ...current, [selectedFilter]: value }));
            }
            setSelectedFilter(null);
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

function ReportsList({
  filterValues,
  onFilter,
  onOpenReport,
}: {
  filterValues: Record<FilterName, string>;
  onFilter: (filter: FilterName) => void;
  onOpenReport: (kind: (typeof reportCards)[number]['kind']) => void;
}) {
  return (
    <View style={styles.reportsScreen}>
      <ThemedText type="smallBold" style={styles.screenTitle}>Factory Reports</ThemedText>
      <ThemedText type="small" style={styles.screenSubtitle}>View and manage factory reports</ThemedText>
      <View style={styles.filtersGrid}>
        {filters.map((filter) => (
          <ReportFilter
            key={filter}
            label={filter}
            value={filterValues[filter]}
            icon={filterIcon(filter)}
            fullWidth={filter === 'Grade'}
            onPress={() => onFilter(filter)}
          />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.reportGrid} showsVerticalScrollIndicator={false}>
        {reportCards.map((report) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${report.title}`}
            key={report.kind}
            onPress={() => onOpenReport(report.kind)}
            style={({ pressed }) => [styles.reportCard, pressed && styles.cardPressed]}>
            <View style={[styles.reportIcon, { backgroundColor: `${report.color}19` }]}>
              <MaterialCommunityIcons name={report.icon} size={18} color={report.color} />
            </View>
            <ThemedText type="smallBold" style={styles.reportTitle}>{report.title}</ThemedText>
            <ThemedText type="small" style={styles.reportDescription}>{report.description}</ThemedText>
            <View style={styles.viewReportButton}>
              <ThemedText type="smallBold" style={styles.viewReportText}>View</ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ReportFilter({
  label,
  value,
  icon,
  fullWidth,
  onPress,
}: {
  label: FilterName;
  value: string;
  icon: IconName;
  fullWidth?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.reportFilter, fullWidth && styles.reportFilterFull]}>
      <View style={styles.filterHeading}>
        <MaterialCommunityIcons name={icon} size={11} color="#138355" />
        <ThemedText type="small" style={styles.filterCaption}>{label}</ThemedText>
      </View>
      <View style={styles.filterValueRow}>
        <ThemedText type="small" style={styles.filterValue} numberOfLines={1}>{value}</ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={13} color="#819087" />
      </View>
    </Pressable>
  );
}

function TraceabilityScreen({ onOpenVerification }: { onOpenVerification: () => void }) {
  return (
    <View style={styles.traceScreen}>
      <ThemedText type="smallBold" style={styles.screenTitle}>PHI &amp; Traceability</ThemedText>
      <ThemedText type="small" style={styles.screenSubtitle}>Track the journey from field to factory</ThemedText>
      <ScrollView contentContainerStyle={styles.timelineList} showsVerticalScrollIndicator={false}>
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1;
          return (
            <View key={item.title} style={styles.timelineRow}>
              <View style={styles.timelineRail}>
                <View style={[styles.timelineNumber, item.completed && styles.timelineNumberDone]}>
                  <ThemedText type="smallBold" style={styles.timelineNumberText}>{index + 1}</ThemedText>
                </View>
                {!isLast ? <View style={styles.timelineConnector} /> : null}
              </View>
              <Pressable
                accessibilityRole={item.title === 'PHI' ? 'button' : undefined}
                accessibilityLabel={item.title === 'PHI' ? 'Open PHI verification details' : item.title}
                onPress={item.title === 'PHI' ? onOpenVerification : undefined}
                style={({ pressed }) => [styles.timelineCard, pressed && styles.cardPressed]}>
                <View style={styles.timelineIcon}>
                  <MaterialCommunityIcons name={item.icon} size={13} color="#118251" />
                </View>
                <ThemedText type="smallBold" style={styles.timelineTitle}>{item.title}</ThemedText>
                <ThemedText type="small" style={styles.timelineDate}>{item.date}</ThemedText>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#91A096" />
              </Pressable>
            </View>
          );
        })}
        <View style={styles.phiStatusCard}>
          <View style={styles.phiStatusIcon}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#FFFFFF" />
          </View>
          <View>
            <ThemedText type="smallBold" style={styles.phiStatusLabel}>PHI STATUS</ThemedText>
            <ThemedText type="smallBold" style={styles.phiStatusValue}>Valid</ThemedText>
            <ThemedText type="small" style={styles.phiStatusCaption}>All conditions are met.</ThemedText>
          </View>
          <MaterialCommunityIcons name="leaf" size={38} color="rgba(255,255,255,0.18)" style={styles.statusLeaf} />
        </View>
      </ScrollView>
    </View>
  );
}

function VerificationDetailsScreen() {
  const details: { label: string; value: string; icon: IconName; status?: boolean }[] = [
    { label: 'Chemical', value: 'Urea', icon: 'flask-outline', status: true },
    { label: 'Application Date', value: '20 Sep 2026', icon: 'calendar-month-outline' },
    { label: 'Required Waiting Period', value: '14 days', icon: 'timer-outline' },
    { label: 'Tea Leaves Plucked', value: '25 Sep 2026', icon: 'leaf' },
    { label: 'Green Leaf Received', value: '26 Sep 2026', icon: 'file-document-outline' },
    { label: 'Manufactured', value: '26 Sep 2026', icon: 'factory' },
    { label: 'Processing Batch', value: 'BATCH-00125', icon: 'cog-outline' },
  ];

  return (
    <View style={styles.verificationScreen}>
      <ThemedText type="smallBold" style={styles.screenTitle}>PHI Verification Details</ThemedText>
      <ScrollView contentContainerStyle={styles.verificationList} showsVerticalScrollIndicator={false}>
        {details.map((detail) => (
          <View key={detail.label} style={styles.verificationCard}>
            <View style={styles.verificationIcon}>
              <MaterialCommunityIcons name={detail.icon} size={15} color="#118251" />
            </View>
            <View style={styles.verificationContent}>
              <ThemedText type="small" style={styles.verificationLabel}>{detail.label}</ThemedText>
              <ThemedText type="smallBold" style={styles.verificationValue}>{detail.value}</ThemedText>
            </View>
            {detail.status ? <View style={styles.approvedBadge}><ThemedText type="smallBold" style={styles.approvedText}>Approved</ThemedText></View> : null}
          </View>
        ))}
        <View style={styles.validBanner}>
          <View style={styles.validIcon}>
            <MaterialCommunityIcons name="shield-check-outline" size={18} color="#FFFFFF" />
          </View>
          <View>
            <ThemedText type="smallBold" style={styles.validBannerLabel}>PHI STATUS</ThemedText>
            <ThemedText type="smallBold" style={styles.validBannerValue}>Valid</ThemedText>
            <ThemedText type="small" style={styles.validBannerCaption}>Waiting period satisfied.</ThemedText>
          </View>
          <MaterialCommunityIcons name="leaf" size={38} color="rgba(255,255,255,0.18)" style={styles.statusLeaf} />
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/green-leaf-book')} style={styles.sourceButton}>
          <MaterialCommunityIcons name="lock-outline" size={12} color="#FFFFFF" />
          <ThemedText type="smallBold" style={styles.sourceButtonText}>View Source Records</ThemedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function FilterModal({
  filter,
  value,
  onSelect,
  onClose,
}: {
  filter: FilterName | null;
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={filter !== null} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <ThemedText type="smallBold" style={styles.modalTitle}>Filter by {filter}</ThemedText>
          {filter ? filterOptions[filter].map((option) => (
            <Pressable key={option} accessibilityRole="button" onPress={() => onSelect(option)} style={styles.modalOption}>
              <ThemedText type="small" style={[styles.modalOptionText, option === value && styles.modalOptionSelected]}>{option}</ThemedText>
              {option === value ? <MaterialCommunityIcons name="check" size={15} color={green} /> : null}
            </Pressable>
          )) : null}
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalCancel}>
            <ThemedText type="smallBold" style={styles.modalCancelText}>Cancel</ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function filterIcon(filter: FilterName): IconName {
  if (filter === 'Date') return 'calendar-outline';
  if (filter === 'Farmer') return 'account-outline';
  if (filter === 'Field Officer') return 'account-tie-outline';
  if (filter === 'Batch') return 'factory';
  return 'star-outline';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(249, 253, 247, 0.76)' },
  safeArea: { flex: 1 },
  header: { height: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  backButton: { width: 28, height: 32, justifyContent: 'center' },
  headerSpacer: { width: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  brandName: { color: '#087344', fontSize: 9 },
  reportsScreen: { flex: 1, paddingHorizontal: 11, paddingTop: 1 },
  screenTitle: { color: '#21372A', fontSize: 15, lineHeight: 20 },
  screenSubtitle: { color: '#7A887F', fontSize: 7, lineHeight: 11 },
  filtersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 5, marginTop: 7 },
  reportFilter: { width: '48.5%', minHeight: 31, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#E0E9DF', backgroundColor: 'rgba(255,255,255,0.94)' },
  reportFilterFull: { width: '100%' },
  filterHeading: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterCaption: { color: '#819087', fontSize: 6, lineHeight: 8 },
  filterValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterValue: { flex: 1, color: '#425348', fontSize: 7, lineHeight: 10 },
  reportGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6, paddingTop: 9, paddingBottom: 10 },
  reportCard: { width: '48.7%', minHeight: 92, padding: 8, borderRadius: 11, borderWidth: 1, borderColor: '#E5EBE3', backgroundColor: 'rgba(255,255,255,0.96)' },
  cardPressed: { opacity: 0.83 },
  reportIcon: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginBottom: 5 },
  reportTitle: { color: '#314438', fontSize: 7, lineHeight: 10 },
  reportDescription: { color: '#8A968E', fontSize: 6, lineHeight: 8, marginTop: 2 },
  viewReportButton: { minHeight: 18, alignItems: 'center', justifyContent: 'center', marginTop: 5, borderRadius: 5, backgroundColor: '#E7F7EB' },
  viewReportText: { color: '#16824B', fontSize: 7 },
  traceScreen: { flex: 1, paddingHorizontal: 10, paddingTop: 1 },
  timelineList: { paddingTop: 7, paddingBottom: 9 },
  timelineRow: { minHeight: 38, flexDirection: 'row' },
  timelineRail: { width: 24, alignItems: 'center' },
  timelineNumber: { zIndex: 1, width: 15, height: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A5638' },
  timelineNumberDone: { backgroundColor: '#0A6540' },
  timelineNumberText: { color: '#FFFFFF', fontSize: 6 },
  timelineConnector: { position: 'absolute', top: 14, bottom: -1, width: 1.5, backgroundColor: '#168655' },
  timelineCard: { flex: 1, minHeight: 31, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6, marginBottom: 5, borderRadius: 8, borderWidth: 1, borderColor: '#DDE9DD', backgroundColor: 'rgba(255,255,255,0.96)' },
  timelineIcon: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6F4E9' },
  timelineTitle: { flex: 1, color: '#3B4C41', fontSize: 7 },
  timelineDate: { color: '#859189', fontSize: 6 },
  phiStatusCard: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, marginTop: 2, borderRadius: 10, backgroundColor: '#13A97C', overflow: 'hidden' },
  phiStatusIcon: { width: 27, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  phiStatusLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 6, lineHeight: 9 },
  phiStatusValue: { color: '#FFFFFF', fontSize: 10, lineHeight: 13 },
  phiStatusCaption: { color: 'rgba(255,255,255,0.82)', fontSize: 6, lineHeight: 8 },
  statusLeaf: { position: 'absolute', right: 3, bottom: -4 },
  verificationScreen: { flex: 1, paddingHorizontal: 10, paddingTop: 1 },
  verificationList: { flexGrow: 1, gap: 5, paddingTop: 7, paddingBottom: 9 },
  verificationCard: { minHeight: 39, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, borderWidth: 1, borderColor: '#E1EAE0', backgroundColor: 'rgba(255,255,255,0.96)' },
  verificationIcon: { width: 23, height: 23, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5F5E9' },
  verificationContent: { flex: 1 },
  verificationLabel: { color: '#839087', fontSize: 6, lineHeight: 9 },
  verificationValue: { color: '#34483B', fontSize: 8, lineHeight: 11 },
  approvedBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, backgroundColor: '#DCF4E4' },
  approvedText: { color: '#11824A', fontSize: 6 },
  validBanner: { minHeight: 59, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, marginTop: 1, borderRadius: 10, backgroundColor: '#13A76F', overflow: 'hidden' },
  validIcon: { width: 27, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  validBannerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 6, lineHeight: 9 },
  validBannerValue: { color: '#FFFFFF', fontSize: 10, lineHeight: 13 },
  validBannerCaption: { color: 'rgba(255,255,255,0.82)', fontSize: 6, lineHeight: 8 },
  sourceButton: { minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 7, backgroundColor: '#075D38' },
  sourceButtonText: { color: '#FFFFFF', fontSize: 7 },
  bottomNav: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E4EAE4', backgroundColor: 'rgba(255,255,255,0.98)' },
  navItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', gap: 1 },
  navLabel: { color: '#78837B', fontSize: 7, lineHeight: 10 },
  navLabelSelected: { color: green, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'center', paddingHorizontal: 26, backgroundColor: 'rgba(23, 38, 28, 0.36)' },
  modalCard: { padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' },
  modalTitle: { color: '#294533', fontSize: 12, marginBottom: 6 },
  modalOption: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8EEE8' },
  modalOptionText: { color: '#48594D', fontSize: 10 },
  modalOptionSelected: { color: green, fontWeight: '700' },
  modalCancel: { alignSelf: 'flex-end', paddingHorizontal: 8, paddingTop: 9 },
  modalCancelText: { color: green, fontSize: 9 },
});
