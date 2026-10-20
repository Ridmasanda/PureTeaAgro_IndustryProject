import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
type DispatchStatus = 'Dispatched' | 'Pending';
type DispatchRecord = {
  id: string;
  batch: string;
  grade: string;
  quantity: string;
  destination: string;
  packed: string;
  status: DispatchStatus;
};

const green = '#075D38';
const gradeOptions = ['OP1', 'BOPF', 'FBOP', 'OP', 'PEKOE'];
const batchOptions = ['BATCH-00120', 'BATCH-00118', 'BATCH-00116', 'BATCH-00114'];
const destinations = ['Colombo', 'Kandy', 'Matara', 'Galle', 'Jaffna'];
const units = ['kg', 'g', 'bags'];

const startingRecords: DispatchRecord[] = [
  { id: 'DISP-00124', batch: 'BATCH-00120', grade: 'OP1', quantity: '500 kg', destination: 'Colombo', packed: '28 Sep 2026', status: 'Dispatched' },
  { id: 'DISP-00123', batch: 'BATCH-00118', grade: 'BOPF', quantity: '300 kg', destination: 'Kandy', packed: '26 Sep 2026', status: 'Dispatched' },
  { id: 'DISP-00122', batch: 'BATCH-00116', grade: 'FBOP', quantity: '200 kg', destination: 'Matara', packed: '24 Sep 2026', status: 'Pending' },
  { id: 'DISP-00121', batch: 'BATCH-00114', grade: 'OP', quantity: '450 kg', destination: 'Galle', packed: '20 Sep 2026', status: 'Dispatched' },
];

const navItems: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

function BottomNavigation() {
  return (
    <View style={styles.bottomNav}>
      {navItems.map(([label, icon]) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected: label === 'Books' }}
          key={label}
          onPress={() => {
            if (label === 'Home') router.replace('/factory-officer-dashboard');
            else if (label === 'Books') router.replace('/factory-books');
            else if (label === 'Alerts') router.replace('/factory-officer-notifications');
            else if (label === 'Reports') router.replace('/factory-reports');
            else if (label === 'Profile') router.replace('/factory-officer-profile');
            else router.replace('/factory-officer-dashboard');
          }}
          style={styles.navItem}>
          <MaterialCommunityIcons name={icon} size={18} color={label === 'Books' ? green : '#7B8780'} />
          <ThemedText type="small" style={[styles.navLabel, label === 'Books' && styles.navLabelSelected]}>
            {label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

function ScreenFrame({
  title,
  children,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={21} color="#274434" />
          </Pressable>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={15} color="#07824D" />
            <ThemedText type="smallBold" style={styles.brandText}>PureTeaAgro</ThemedText>
          </View>
        </View>
        <View style={styles.screenTitleWrap}>
          <ThemedText type="smallBold" style={styles.screenTitle}>{title}</ThemedText>
          <ThemedText type="small" style={styles.screenSubtitle}>Record and manage tea dispatch details</ThemedText>
        </View>
        {children}
        <BottomNavigation />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default function TeaDispatchScreen() {
  const [screen, setScreen] = useState<'list' | 'create'>('list');
  const [records, setRecords] = useState(startingRecords);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [picker, setPicker] = useState<'date' | 'grade' | 'batch' | 'destination' | 'unit' | null>(null);
  const [newDispatch, setNewDispatch] = useState({
    batch: '',
    grade: '',
    quantity: '',
    unit: 'kg',
    destination: '',
    packed: '02 Oct 2026',
    remarks: '',
  });

  const visibleRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchesSearch = `${record.id} ${record.batch} ${record.destination}`.toLowerCase().includes(search.toLowerCase());
        const matchesGrade = gradeFilter === 'All' || record.grade === gradeFilter;
        const matchesDate = dateFilter === 'All' || record.packed === dateFilter;
        return matchesSearch && matchesGrade && matchesDate;
      }),
    [dateFilter, gradeFilter, records, search],
  );

  const pickerOptions =
    picker === 'grade'
      ? ['All', ...gradeOptions]
      : picker === 'date'
        ? ['All', ...Array.from(new Set(records.map((record) => record.packed)))]
        : picker === 'batch'
          ? batchOptions
          : picker === 'destination'
            ? destinations
            : units;

  const updateNewDispatch = (field: keyof typeof newDispatch, value: string) => {
    setNewDispatch((current) => ({ ...current, [field]: value }));
  };

  const selectOption = (value: string) => {
    if (picker === 'date') setDateFilter(value);
    if (picker === 'grade' && screen === 'create') updateNewDispatch('grade', value);
    else if (picker === 'grade') setGradeFilter(value);
    if (picker === 'batch') updateNewDispatch('batch', value);
    if (picker === 'destination') updateNewDispatch('destination', value);
    if (picker === 'unit') updateNewDispatch('unit', value);
    setPicker(null);
  };

  return (
    <ScreenFrame
      title={screen === 'list' ? 'Tea Dispatch Book' : 'Add Dispatch Record'}
      onBack={() => {
        if (screen === 'create') setScreen('list');
        else router.back();
      }}>
      {screen === 'list' ? (
        <View style={styles.listScreen}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={16} color="#819187" />
            <TextInput
              accessibilityLabel="Search dispatch ID, batch, or destination"
              onChangeText={setSearch}
              placeholder="Search dispatch ID, batch or destination..."
              placeholderTextColor="#8B9990"
              style={styles.searchInput}
              value={search}
            />
          </View>
          <View style={styles.filtersRow}>
            <FilterButton icon="calendar-outline" label="Date" value={dateFilter} onPress={() => setPicker('date')} />
            <FilterButton icon="medal-outline" label="Grade" value={gradeFilter} onPress={() => setPicker('grade')} />
            <Pressable accessibilityRole="button" accessibilityLabel="Filter dispatch records" onPress={() => setPicker('grade')} style={styles.filterIconButton}>
              <MaterialCommunityIcons name="tune-variant" size={17} color="#FFFFFF" />
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setScreen('create')} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />
            <ThemedText type="smallBold" style={styles.addButtonText}>Add Dispatch Record</ThemedText>
          </Pressable>
          <ScrollView contentContainerStyle={styles.recordsList} showsVerticalScrollIndicator={false}>
            {visibleRecords.map((record) => <DispatchCard key={record.id} record={record} />)}
            {visibleRecords.length === 0 ? <ThemedText type="small" style={styles.emptyText}>No dispatch records match your filters.</ThemedText> : null}
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.formScreen} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FormSelect icon="factory" label="Processing Batch" placeholder="Select batch" value={newDispatch.batch} onPress={() => setPicker('batch')} />
          <FormSelect icon="medal-outline" label="Tea Grade" placeholder="Select grade" value={newDispatch.grade} onPress={() => setPicker('grade')} />
          <View style={styles.quantityRow}>
            <View style={styles.quantityInput}>
              <FormInput icon="scale-balance" label="Quantity" placeholder="Enter quantity" value={newDispatch.quantity} onChangeText={(value) => updateNewDispatch('quantity', value)} keyboardType="decimal-pad" />
            </View>
            <View style={styles.unitSelect}>
              <FormSelect icon="scale" label="Unit" placeholder="Unit" value={newDispatch.unit} onPress={() => setPicker('unit')} />
            </View>
          </View>
          <FormSelect icon="map-marker-outline" label="Destination" placeholder="Select destination" value={newDispatch.destination} onPress={() => setPicker('destination')} />
          <FormInput icon="calendar-outline" label="Packed Date" placeholder="Packed date" value={newDispatch.packed} onChangeText={(value) => updateNewDispatch('packed', value)} />
          <FormInput icon="text-box-outline" label="Remarks" placeholder="Add dispatch notes or remarks (optional)" value={newDispatch.remarks} onChangeText={(value) => updateNewDispatch('remarks', value)} multiline />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const id = `DISP-${String(124 + records.length - startingRecords.length + 1).padStart(5, '0')}`;
              const record: DispatchRecord = {
                id,
                batch: newDispatch.batch || 'BATCH-00120',
                grade: newDispatch.grade || 'OP1',
                quantity: `${newDispatch.quantity || '0'} ${newDispatch.unit}`,
                destination: newDispatch.destination || 'Colombo',
                packed: newDispatch.packed,
                status: 'Pending',
              };
              setRecords((current) => [record, ...current]);
              setScreen('list');
            }}
            style={({ pressed }) => [styles.addButton, styles.submitButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="content-save-outline" size={16} color="#FFFFFF" />
            <ThemedText type="smallBold" style={styles.addButtonText}>Save Dispatch Record</ThemedText>
          </Pressable>
        </ScrollView>
      )}
      <SelectModal
        visible={picker !== null}
        title={pickerTitle(picker)}
        options={pickerOptions}
        onClose={() => setPicker(null)}
        onSelect={selectOption}
      />
    </ScreenFrame>
  );
}

function DispatchCard({ record }: { record: DispatchRecord }) {
  const isPending = record.status === 'Pending';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Dispatch ${record.id}, ${record.status}`} style={({ pressed }) => [styles.dispatchCard, pressed && styles.pressed]}>
      <View style={styles.recordIcon}>
        <MaterialCommunityIcons name="leaf" size={15} color="#07844E" />
      </View>
      <View style={styles.recordMain}>
        <View style={styles.recordHeader}>
          <ThemedText type="smallBold" style={styles.dispatchId}>{record.id}</ThemedText>
          <View style={[styles.statusPill, isPending && styles.pendingPill]}>
            <ThemedText type="smallBold" style={[styles.statusText, isPending && styles.pendingText]}>{record.status}</ThemedText>
          </View>
        </View>
        <View style={styles.recordDetails}>
          <View style={styles.recordLeftDetails}>
            <ThemedText type="small" style={styles.detailText}>Batch: {record.batch}</ThemedText>
            <ThemedText type="small" style={styles.detailText}>Grade: {record.grade}</ThemedText>
            <ThemedText type="small" style={styles.detailText}>Packed: {record.packed}</ThemedText>
          </View>
          <View style={styles.recordRightDetails}>
            <ThemedText type="small" style={styles.detailText}>Qty: <ThemedText type="smallBold" style={styles.detailStrong}>{record.quantity}</ThemedText></ThemedText>
            <ThemedText type="small" style={styles.detailText}>Dest: {record.destination}</ThemedText>
          </View>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={17} color="#8C9A91" />
    </Pressable>
  );
}

function FilterButton({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.filterButton}>
      <MaterialCommunityIcons name={icon} size={13} color="#19804E" />
      <View style={styles.filterButtonText}>
        <ThemedText type="small" style={styles.filterLabel}>{label}</ThemedText>
        <ThemedText type="smallBold" style={styles.filterValue}>{value}</ThemedText>
      </View>
      <MaterialCommunityIcons name="chevron-down" size={14} color="#819187" />
    </Pressable>
  );
}

function FormLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.formLabelRow}>
      <View style={styles.formIcon}><MaterialCommunityIcons name={icon} size={13} color="#19804E" /></View>
      <ThemedText type="smallBold" style={styles.formLabel}>{label}</ThemedText>
    </View>
  );
}

function FormInput({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType,
}: {
  icon: IconName;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={styles.formGroup}>
      <FormLabel icon={icon} label={label} />
      <View style={[styles.inputWrap, multiline && styles.multilineWrap]}>
        <TextInput
          accessibilityLabel={label}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#87958C"
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
        />
      </View>
    </View>
  );
}

function FormSelect({ icon, label, placeholder, value, onPress }: { icon: IconName; label: string; placeholder: string; value: string; onPress: () => void }) {
  return (
    <View style={styles.formGroup}>
      <FormLabel icon={icon} label={label} />
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.inputWrap}>
        <ThemedText type="small" style={[styles.input, !value && styles.placeholder]}>{value || placeholder}</ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={15} color="#829188" />
      </Pressable>
    </View>
  );
}

function SelectModal({ visible, title, options, onSelect, onClose }: { visible: boolean; title: string; options: string[]; onSelect: (value: string) => void; onClose: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <ThemedText type="smallBold" style={styles.modalTitle}>{title}</ThemedText>
          {options.map((option) => (
            <Pressable key={option} accessibilityRole="button" onPress={() => onSelect(option)} style={styles.modalOption}>
              <ThemedText type="small" style={styles.modalOptionText}>{option}</ThemedText>
              <MaterialCommunityIcons name="chevron-right" size={15} color="#829188" />
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalCancel}>
            <ThemedText type="smallBold" style={styles.modalCancelText}>Cancel</ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function pickerTitle(picker: string | null) {
  if (picker === 'date') return 'Filter by Date';
  if (picker === 'grade') return 'Select Tea Grade';
  if (picker === 'batch') return 'Select Processing Batch';
  if (picker === 'destination') return 'Select Destination';
  return 'Select Unit';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(249, 253, 247, 0.69)' },
  safeArea: { flex: 1 },
  header: { height: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13 },
  backButton: { width: 30, height: 34, justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  brandText: { color: '#13452E', fontSize: 10 },
  screenTitleWrap: { paddingHorizontal: 13, paddingTop: 1, paddingBottom: 5 },
  screenTitle: { color: '#183E2A', fontSize: 16, lineHeight: 20 },
  screenSubtitle: { color: '#728176', fontSize: 8, lineHeight: 12 },
  listScreen: { flex: 1, paddingHorizontal: 10, paddingTop: 1, paddingBottom: 5 },
  searchBox: { height: 31, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, borderRadius: 8, borderWidth: 1, borderColor: '#DCE8DC', backgroundColor: 'rgba(255,255,255,0.95)' },
  searchInput: { flex: 1, height: 29, fontSize: 8, color: '#3E5145', paddingVertical: 0 },
  filtersRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  filterButton: { flex: 1, minHeight: 35, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 7, borderRadius: 9, borderWidth: 1, borderColor: '#DCE8DC', backgroundColor: 'rgba(255,255,255,0.96)' },
  filterButtonText: { flex: 1 },
  filterLabel: { color: '#819087', fontSize: 6, lineHeight: 8 },
  filterValue: { color: '#44564A', fontSize: 8, lineHeight: 11 },
  filterIconButton: { width: 31, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: green },
  addButton: { minHeight: 31, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 6, borderRadius: 16, backgroundColor: '#075D38' },
  addButtonText: { color: '#FFFFFF', fontSize: 8 },
  pressed: { opacity: 0.84 },
  recordsList: { flexGrow: 1, gap: 7, paddingTop: 10, paddingBottom: 8 },
  dispatchCard: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E1E9E1', backgroundColor: 'rgba(255,255,255,0.97)' },
  recordIcon: { width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2F4E7' },
  recordMain: { flex: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  dispatchId: { color: '#34473A', fontSize: 8 },
  statusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9, backgroundColor: '#DDF5E5' },
  pendingPill: { backgroundColor: '#FFF1CE' },
  statusText: { color: '#178249', fontSize: 6 },
  pendingText: { color: '#B97A00' },
  recordDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  recordLeftDetails: { gap: 2 },
  recordRightDetails: { minWidth: 86, alignItems: 'flex-start', gap: 2 },
  detailText: { color: '#88968E', fontSize: 7, lineHeight: 10 },
  detailStrong: { color: '#46574C', fontSize: 7 },
  emptyText: { color: '#738177', textAlign: 'center', fontSize: 10, padding: 24 },
  bottomNav: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E4EAE4', backgroundColor: 'rgba(255,255,255,0.98)' },
  navItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', gap: 1 },
  navLabel: { color: '#78837B', fontSize: 7, lineHeight: 10 },
  navLabelSelected: { color: green, fontWeight: '700' },
  formScreen: { flexGrow: 1, gap: 9, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 15 },
  formGroup: { marginBottom: 2 },
  formLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  formIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E2F3E7', alignItems: 'center', justifyContent: 'center' },
  formLabel: { color: '#45584A', fontSize: 8 },
  inputWrap: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 30, paddingHorizontal: 9, borderRadius: 8, borderWidth: 1, borderColor: '#DDE7DD', backgroundColor: 'rgba(255,255,255,0.96)' },
  input: { flex: 1, minHeight: 34, color: '#415348', fontSize: 9, paddingVertical: 0 },
  placeholder: { color: '#87958C' },
  multilineWrap: { minHeight: 60, alignItems: 'flex-start', paddingTop: 5 },
  multilineInput: { minHeight: 50, textAlignVertical: 'top' },
  quantityRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  quantityInput: { flex: 1 },
  unitSelect: { width: 88 },
  submitButton: { minHeight: 38, marginTop: 10 },
  modalBackdrop: { flex: 1, justifyContent: 'center', paddingHorizontal: 27, backgroundColor: 'rgba(22, 37, 27, 0.35)' },
  modalCard: { padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' },
  modalTitle: { color: '#294533', fontSize: 12, marginBottom: 6 },
  modalOption: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8EEE8' },
  modalOptionText: { color: '#48594D', fontSize: 10 },
  modalCancel: { alignSelf: 'flex-end', paddingHorizontal: 8, paddingTop: 9 },
  modalCancelText: { color: green, fontSize: 9 },
});
