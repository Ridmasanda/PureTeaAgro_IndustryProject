import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type LeafQuality = 'Good' | 'Average' | 'Poor';

type LeafRecord = {
  id: string;
  farmer: string;
  land: string;
  date: string;
  time: string;
  weight: string;
  quality: LeafQuality;
  vehicle: string;
  collector: string;
};

const green = '#075D38';
const initialRecords: LeafRecord[] = [
  {
    id: 'COL-000125',
    farmer: 'Nimal Perera',
    land: 'Land 001',
    date: '02 Oct 2026',
    time: '10:30 AM',
    weight: '245 kg',
    quality: 'Good',
    vehicle: 'KA-1234',
    collector: 'Sunil Silva',
  },
  {
    id: 'COL-000124',
    farmer: 'Sunil Silva',
    land: 'Land 002',
    date: '01 Oct 2026',
    time: '09:45 AM',
    weight: '180 kg',
    quality: 'Average',
    vehicle: 'WP-5678',
    collector: 'Kamal Perera',
  },
  {
    id: 'COL-000123',
    farmer: 'Wimal Jayasinghe',
    land: 'Land 003',
    date: '30 Sep 2026',
    time: '11:20 AM',
    weight: '220 kg',
    quality: 'Good',
    vehicle: 'AB-9012',
    collector: 'Santhosh',
  },
];

const bottomNavigation: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

const farmers = ['Nimal Perera', 'Sunil Silva', 'Wimal Jayasinghe', 'Kamal Perera'];
const lands = ['Land 001', 'Land 002', 'Land 003', 'Land 004'];
const collectors = ['Sunil Silva', 'Kamal Perera', 'Santhosh', 'Nimal Perera'];

function BottomNavigation() {
  return (
    <View style={styles.bottomNav}>
      {bottomNavigation.map(([label, icon]) => {
        const selected = label === 'Books';
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            key={label}
            onPress={() => {
              if (label === 'Home') {
                router.replace('/factory-officer-dashboard');
              } else if (label === 'Books') {
                router.replace('/factory-books');
              } else if (label === 'Reports') {
                router.replace('/factory-reports');
              } else if (label === 'Alerts') {
                router.replace('/factory-officer-notifications');
              } else if (label === 'Profile') {
                router.replace('/factory-officer-profile');
              } else {
                router.replace('/factory-officer-dashboard');
              }
            }}
            style={styles.navItem}>
            <MaterialCommunityIcons name={icon} size={19} color={selected ? '#087B4A' : '#78837B'} />
            <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

function ScreenFrame({
  children,
  headerTitle,
  showBack = true,
  onBack,
}: {
  children: React.ReactNode;
  headerTitle: string;
  showBack?: boolean;
  onBack: () => void;
}) {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {showBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#274434" />
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
          <ThemedText type="smallBold" style={styles.headerTitle}>
            {headerTitle}
          </ThemedText>
          <View style={styles.brandMark}>
            <MaterialCommunityIcons name="leaf" size={18} color="#07824D" />
            <ThemedText type="smallBold" style={styles.brandText}>
              PureTeaAgro
            </ThemedText>
          </View>
        </View>
        {children}
        <BottomNavigation />
      </SafeAreaView>
    </ImageBackground>
  );
}

function RecordCard({ record }: { record: LeafRecord }) {
  const quality = record.quality;
  const badgeColor =
    quality === 'Good' ? '#21854A' : quality === 'Average' ? '#C28111' : '#D74251';

  return (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <ThemedText type="smallBold" style={styles.recordId}>
          {record.id}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: quality === 'Average' ? '#FFF3D8' : '#E0F3E5' }]}>
          <ThemedText type="smallBold" style={[styles.statusBadgeText, { color: badgeColor }]}>
            {record.id === 'COL-000123' ? 'Pending' : 'Received'}
          </ThemedText>
        </View>
      </View>
      <View style={styles.recordInfoRow}>
        <View style={styles.recordDetails}>
          <RecordMeta icon="account-outline" label={record.farmer} />
          <RecordMeta icon="map-marker-outline" label={record.land} />
          <RecordMeta icon="calendar-outline" label={`${record.date} (Plucked)`} />
          <ThemedText type="small" style={styles.recordTime}>
            {record.time} (Received)
          </ThemedText>
        </View>
        <View style={styles.weightColumn}>
          <ThemedText type="smallBold" style={styles.weightText}>
            <MaterialCommunityIcons name="leaf" size={11} color="#19874C" /> {record.weight}
          </ThemedText>
          <View style={[styles.qualityBadge, { backgroundColor: `${badgeColor}1A` }]}>
            <ThemedText type="smallBold" style={[styles.qualityText, { color: badgeColor }]}>
              {quality} Quality
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.recordFooter}>
        <RecordMeta icon="truck-outline" label={record.vehicle} compact />
        <RecordMeta icon="account-outline" label={record.collector} compact />
        <RecordMeta icon="factory" label="Main Factory" compact />
      </View>
    </View>
  );
}

function RecordMeta({
  icon,
  label,
  compact = false,
}: {
  icon: IconName;
  label: string;
  compact?: boolean;
}) {
  return (
    <View style={styles.metaRow}>
      <MaterialCommunityIcons name={icon} size={compact ? 10 : 12} color="#508060" />
      <ThemedText type="small" style={[styles.metaText, compact && styles.metaTextCompact]}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function GreenLeafBookScreen() {
  const records = initialRecords;
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [farmerFilter, setFarmerFilter] = useState('All Farmers');
  const [picker, setPicker] = useState<'date' | 'farmer' | null>(null);
  const visibleRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchesSearch = `${record.id} ${record.farmer}`.toLowerCase().includes(search.toLowerCase());
        const matchesFarmer = farmerFilter === 'All Farmers' || record.farmer === farmerFilter;
        const matchesDate = dateFilter === 'All Dates' || record.date === dateFilter;
        return matchesSearch && matchesFarmer && matchesDate;
      }),
    [dateFilter, farmerFilter, records, search],
  );

  return (
    <ScreenFrame headerTitle="Green Leaf Book" onBack={() => router.back()}>
      <View style={styles.listContent}>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={17} color="#63806C" />
          <TextInput
            accessibilityLabel="Search by collection ID or farmer"
            onChangeText={setSearch}
            placeholder="Search by collection ID, farmer..."
            placeholderTextColor="#819187"
            style={styles.searchInput}
            value={search}
          />
          {search ? (
            <Pressable accessibilityLabel="Clear search" onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={16} color="#829188" />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.filterRow}>
          <FilterButton
            icon="calendar-outline"
            label="Date"
            value={dateFilter}
            onPress={() => setPicker('date')}
          />
          <FilterButton
            icon="account-outline"
            label="Farmer"
            value={farmerFilter}
            onPress={() => setPicker('farmer')}
          />
        </View>
        <ThemedText type="small" style={styles.collectionCount}>
          {visibleRecords.length} collections
        </ThemedText>
        <ScrollView contentContainerStyle={styles.recordsList} showsVerticalScrollIndicator={false}>
          {visibleRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
          {visibleRecords.length === 0 ? (
            <ThemedText type="small" style={styles.emptyText}>
              No green leaf records match your search.
            </ThemedText>
          ) : null}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/add-green-leaf-record',
              params: { nextId: `COL-${String(126 + records.length - initialRecords.length).padStart(6, '0')}` },
            })
          }
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <MaterialCommunityIcons name="plus-circle" size={17} color="#FFFFFF" />
          <ThemedText type="smallBold" style={styles.addButtonText}>
            Add Green Leaf Record
          </ThemedText>
        </Pressable>
      </View>
      <FilterModal
        visible={picker !== null}
        title={picker === 'date' ? 'Filter by date' : 'Filter by farmer'}
        options={
          picker === 'date'
            ? ['All Dates', ...Array.from(new Set(records.map((record) => record.date)))]
            : ['All Farmers', ...Array.from(new Set(records.map((record) => record.farmer)))]
        }
        onSelect={(value) => {
          if (picker === 'date') setDateFilter(value);
          else setFarmerFilter(value);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
    </ScreenFrame>
  );
}

function FilterButton({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.filterButton}>
      <View style={styles.filterHeading}>
        <MaterialCommunityIcons name={icon} size={12} color="#4E7960" />
        <ThemedText type="small" style={styles.filterLabel}>
          {label}
        </ThemedText>
      </View>
      <View style={styles.filterValueRow}>
        <ThemedText type="small" style={styles.filterValue}>
          {value}
        </ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={15} color="#66796D" />
      </View>
    </Pressable>
  );
}

function FilterModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <ThemedText type="smallBold" style={styles.modalTitle}>
            {title}
          </ThemedText>
          {options.map((option) => (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onSelect(option)}
              style={styles.modalOption}>
              <ThemedText type="small" style={styles.modalOptionText}>
                {option}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

export function AddGreenLeafRecordScreen() {
  const { nextId } = useLocalSearchParams<{ nextId?: string }>();
  const [farmer, setFarmer] = useState('');
  const [land, setLand] = useState('');
  const [collector, setCollector] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [quality, setQuality] = useState<LeafQuality>('Good');
  const [picker, setPicker] = useState<'farmer' | 'land' | 'collector' | null>(null);
  const [collectionId, setCollectionId] = useState(nextId ?? 'COL-000126');

  const selectOption = (value: string) => {
    if (picker === 'farmer') setFarmer(value);
    if (picker === 'land') setLand(value);
    if (picker === 'collector') setCollector(value);
    setPicker(null);
  };

  return (
    <ScreenFrame
      headerTitle="Add Green Leaf Record"
      onBack={() => router.back()}>
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <FormField
          label="Collection ID"
          icon="identifier"
          value={collectionId}
          onChangeText={setCollectionId}
          placeholder="Collection ID"
        />
        <FormPicker
          label="Farmer"
          icon="account-outline"
          value={farmer}
          placeholder="Select Farmer"
          onPress={() => setPicker('farmer')}
        />
        <FormPicker
          label="Tea Land"
          icon="map-marker-outline"
          value={land}
          placeholder="Select Land"
          onPress={() => setPicker('land')}
        />
        <View style={styles.dateTimeRow}>
          <FormField label="Plucked Date" icon="calendar-outline" value="02 Oct 2026" placeholder="" />
          <FormField label="Received Date & Time" icon="clock-time-four-outline" value="02 Oct 2026 10:30 AM" placeholder="" />
        </View>
        <FormField
          label="Green Leaf Weight"
          icon="weight-kilogram"
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight"
          trailing="kg"
          keyboardType="decimal-pad"
        />
        <View style={styles.formGroup}>
          <FormLabel icon="leaf" label="Leaf Quality" />
          <View style={styles.qualityRow}>
            {(['Good', 'Average', 'Poor'] as LeafQuality[]).map((item) => {
              const active = quality === item;
              const itemColor = item === 'Good' ? '#07824D' : item === 'Average' ? '#E6A313' : '#EB5A67';
              const itemIcon: IconName = item === 'Good' ? 'leaf' : item === 'Average' ? 'leaf-circle' : 'leaf-off';
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  key={item}
                  onPress={() => setQuality(item)}
                  style={[styles.qualityOption, active && { borderColor: itemColor, backgroundColor: `${itemColor}12` }]}>
                  <MaterialCommunityIcons name={itemIcon} size={18} color={itemColor} />
                  <ThemedText type="smallBold" style={[styles.qualityOptionText, { color: itemColor }]}>
                    {item}
                  </ThemedText>
                  <View style={[styles.radio, active && { borderColor: itemColor }]}>
                    {active ? <View style={[styles.radioDot, { backgroundColor: itemColor }]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <FormField
          label="Vehicle Number"
          icon="truck-outline"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="Enter vehicle number (e.g. KA-1234)"
          autoCapitalize="characters"
        />
        <FormPicker
          label="Collector"
          icon="account-outline"
          value={collector}
          placeholder="Select Collector"
          onPress={() => setPicker('collector')}
        />
        <FormField
          label="Remarks"
          icon="text-box-outline"
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Add any remarks (optional)"
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}>
          <MaterialCommunityIcons name="content-save-outline" size={16} color="#FFFFFF" />
          <ThemedText type="smallBold" style={styles.saveButtonText}>
            Save Green Leaf Record
          </ThemedText>
        </Pressable>
      </ScrollView>
      <FilterModal
        visible={picker !== null}
        title={
          picker === 'farmer'
            ? 'Select Farmer'
            : picker === 'land'
              ? 'Select Tea Land'
              : 'Select Collector'
        }
        options={picker === 'farmer' ? farmers : picker === 'land' ? lands : collectors}
        onSelect={selectOption}
        onClose={() => setPicker(null)}
      />
    </ScreenFrame>
  );
}

function FormLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.formLabelRow}>
      <MaterialCommunityIcons name={icon} size={13} color="#4E7960" />
      <ThemedText type="smallBold" style={styles.formLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

function FormField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  trailing,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  icon: IconName;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  trailing?: string;
  keyboardType?: 'default' | 'decimal-pad';
  autoCapitalize?: 'none' | 'characters' | 'sentences' | 'words';
}) {
  return (
    <View style={styles.formGroup}>
      <FormLabel icon={icon} label={label} />
      <View style={styles.formInputWrap}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#91A096"
          style={styles.formInput}
          value={value}
        />
        {trailing ? <ThemedText type="small" style={styles.inputTrailing}>{trailing}</ThemedText> : null}
      </View>
    </View>
  );
}

function FormPicker({
  label,
  icon,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  icon: IconName;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.formGroup}>
      <FormLabel icon={icon} label={label} />
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.formInputWrap}>
        <ThemedText type="small" style={[styles.formPickerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={17} color="#6E8275" />
      </Pressable>
    </View>
  );
}

export function AddGreenLeafRecordRoute() {
  return <AddGreenLeafRecordScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(249, 253, 247, 0.82)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 76, 53, 0.08)',
  },
  backButton: {
    width: 27,
    height: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#1B432E',
    fontSize: 14,
  },
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: green,
    fontSize: 6,
    lineHeight: 8,
  },
  listContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 7,
  },
  searchWrap: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E9E0',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  searchInput: {
    flex: 1,
    height: 32,
    color: '#293D30',
    fontSize: 10,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 6,
  },
  filterButton: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DFE8DF',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterLabel: {
    color: '#748277',
    fontSize: 8,
    lineHeight: 11,
  },
  filterValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterValue: {
    color: '#35473A',
    fontSize: 9,
    lineHeight: 13,
  },
  collectionCount: {
    color: '#758278',
    fontSize: 8,
    marginTop: 6,
    marginBottom: 3,
  },
  recordsList: {
    gap: 7,
    paddingBottom: 5,
  },
  recordCard: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E0E9DF',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordId: {
    color: '#22573A',
    fontSize: 10,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 7,
    lineHeight: 10,
  },
  recordInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 53,
  },
  recordDetails: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#526258',
    fontSize: 8,
    lineHeight: 11,
  },
  recordTime: {
    color: '#87938A',
    fontSize: 7,
    lineHeight: 9,
    paddingLeft: 16,
  },
  weightColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  weightText: {
    color: '#1D5D38',
    fontSize: 10,
  },
  qualityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qualityText: {
    fontSize: 7,
    lineHeight: 10,
  },
  recordFooter: {
    minHeight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EFF2EE',
  },
  metaTextCompact: {
    fontSize: 7,
  },
  emptyText: {
    color: '#6B7B70',
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 28,
  },
  addButton: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 5,
    borderRadius: 20,
    backgroundColor: green,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  bottomNav: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E7ECE6',
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  navItem: {
    flex: 1,
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  navLabel: {
    color: '#78837B',
    fontSize: 7,
    lineHeight: 10,
  },
  navLabelSelected: {
    color: '#087B4A',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: 'rgba(20, 35, 25, 0.34)',
  },
  modalCard: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    color: '#254331',
    fontSize: 14,
    marginBottom: 7,
  },
  modalOption: {
    minHeight: 38,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E7ECE7',
  },
  modalOptionText: {
    color: '#405447',
    fontSize: 12,
  },
  formContent: {
    paddingHorizontal: 12,
    paddingTop: 7,
    paddingBottom: 12,
  },
  formGroup: {
    marginBottom: 6,
  },
  formLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  formLabel: {
    color: '#394C3F',
    fontSize: 9,
    lineHeight: 12,
  },
  formInputWrap: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#DFE7DF',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  formInput: {
    flex: 1,
    height: 30,
    color: '#36483B',
    fontSize: 9,
    paddingVertical: 0,
  },
  formPickerText: {
    flex: 1,
    color: '#43564A',
    fontSize: 9,
  },
  placeholderText: {
    color: '#91A096',
  },
  inputTrailing: {
    color: '#87938A',
    fontSize: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 7,
  },
  qualityRow: {
    flexDirection: 'row',
    gap: 5,
  },
  qualityOption: {
    flex: 1,
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E9E3',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  qualityOptionText: {
    fontSize: 8,
  },
  radio: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8D3C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  saveButton: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 3,
    borderRadius: 9,
    backgroundColor: green,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});
