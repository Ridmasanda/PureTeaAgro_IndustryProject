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
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type BatchStage = 'Withering' | 'Rolling' | 'Fermentation' | 'Drying' | 'Sorting';
type Screen = 'list' | 'create' | 'update';

type Batch = {
  id: string;
  collection: string;
  farmer: string;
  quantity: string;
  started: string;
  stage: BatchStage;
  status: string;
};

const green = '#087B4A';
const stages: BatchStage[] = ['Withering', 'Rolling', 'Fermentation', 'Drying', 'Sorting'];
const collectionOptions = ['COL-000125', 'COL-000124', 'COL-000123', 'COL-000122'];
const farmerOptions = ['Nimal Perera', 'Sunil Silva', 'Wimal Jayasinghe', 'Kamal Perera'];
const factoryOptions = ['Main Factory', 'Thalawakale Factory', 'Green Valley Factory'];
const officerOptions = ['Factory Officer', 'Kamal Perera', 'Sanjeewa Silva'];

const startingBatches: Batch[] = [
  {
    id: 'B-2026-004',
    collection: 'Land 001',
    farmer: 'Nimal Perera',
    quantity: '1,250 kg',
    started: '02 Oct 2026 – 08:00 AM',
    stage: 'Fermentation',
    status: 'Processing',
  },
  {
    id: 'B-2026-003',
    collection: 'Land 002',
    farmer: 'Sunil Silva',
    quantity: '980 kg',
    started: '01 Oct 2026 – 09:15 AM',
    stage: 'Drying',
    status: 'Drying',
  },
  {
    id: 'B-2026-002',
    collection: 'Land 003',
    farmer: 'Wimal Jayasinghe',
    quantity: '760 kg',
    started: '30 Sep 2026 – 10:30 AM',
    stage: 'Sorting',
    status: 'Sorting',
  },
  {
    id: 'B-2026-001',
    collection: 'Land 004',
    farmer: 'Kamal Perera',
    quantity: '1,100 kg',
    started: '29 Sep 2026 – 08:45 AM',
    stage: 'Sorting',
    status: 'Completed',
  },
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

function AppFrame({
  title,
  children,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
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
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#274434" />
          </Pressable>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            {title}
          </ThemedText>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={14} color={green} />
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

export default function TeaProductionScreen() {
  const [screen, setScreen] = useState<Screen>('list');
  const [batches, setBatches] = useState(startingBatches);
  const [selectedBatch, setSelectedBatch] = useState<Batch>(startingBatches[0]);
  const [picker, setPicker] = useState<'collection' | 'farmer' | 'factory' | 'officer' | 'stage' | 'nextStage' | 'unit' | null>(null);
  const [collection, setCollection] = useState('');
  const [farmer, setFarmer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [factory, setFactory] = useState('');
  const [officer, setOfficer] = useState('');
  const [manufacturedDate, setManufacturedDate] = useState('02 Oct 2026');
  const [updateStage, setUpdateStage] = useState<BatchStage>(startingBatches[0].stage);
  const [nextStage, setNextStage] = useState<BatchStage>('Rolling');
  const [updateDate, setUpdateDate] = useState('02 Oct 2026');
  const [updateTime, setUpdateTime] = useState('03:30 PM');
  const [updateQuantity, setUpdateQuantity] = useState('245');
  const [updateUnit, setUpdateUnit] = useState('kg');
  const [qualityNotes, setQualityNotes] = useState('');

  const openUpdate = (batch: Batch) => {
    setSelectedBatch(batch);
    setUpdateStage(batch.stage);
    setNextStage(stages[Math.min(stages.indexOf(batch.stage) + 1, stages.length - 1)]);
    setScreen('update');
  };

  const selectOption = (value: string) => {
    if (picker === 'collection') setCollection(value);
    if (picker === 'farmer') setFarmer(value);
    if (picker === 'factory') setFactory(value);
    if (picker === 'officer') setOfficer(value);
    if (picker === 'stage') setUpdateStage(value as BatchStage);
    if (picker === 'nextStage') setNextStage(value as BatchStage);
    if (picker === 'unit') setUpdateUnit(value);
    setPicker(null);
  };

  const pickerOptions =
    picker === 'collection'
      ? collectionOptions
      : picker === 'farmer'
        ? farmerOptions
        : picker === 'factory'
          ? factoryOptions
          : picker === 'officer'
            ? officerOptions
            : picker === 'stage' || picker === 'nextStage'
              ? stages
              : ['kg', 'g', 'L'];

  return (
    <AppFrame
      title={screen === 'list' ? 'Tea Production' : screen === 'create' ? 'Create Processing Batch' : 'Update Processing Stage'}
      onBack={() => {
        if (screen === 'list') router.back();
        else setScreen('list');
      }}>
      {screen === 'list' ? (
        <View style={styles.listScreen}>
          <View style={styles.actionRow}>
            <ActionButton icon="plus-circle-outline" label="Create Processing Batch" onPress={() => setScreen('create')} />
            <ActionButton icon="refresh" label="Update Batch Status" secondary onPress={() => openUpdate(batches[0])} />
          </View>
          <View style={styles.listHeading}>
            <ThemedText type="smallBold" style={styles.listTitle}>
              Active Processing Batches
            </ThemedText>
            <ThemedText type="small" style={styles.listSubtitle}>
              4 batches
            </ThemedText>
          </View>
          <ScrollView contentContainerStyle={styles.batchList} showsVerticalScrollIndicator={false}>
            {batches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} onPress={() => openUpdate(batch)} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {screen === 'create' ? (
        <ScrollView
          contentContainerStyle={styles.formScreen}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.batchIdCard}>
            <View style={styles.batchIdIcon}>
              <MaterialCommunityIcons name="barcode" size={17} color="#12804D" />
            </View>
            <View style={styles.batchIdText}>
              <ThemedText type="smallBold" style={styles.formLabel}>Batch ID</ThemedText>
              <ThemedText type="small" style={styles.formHint}>Auto generated</ThemedText>
            </View>
            <View style={styles.batchIdPill}>
              <ThemedText type="smallBold" style={styles.batchIdPillText}>BATCH-00128</ThemedText>
            </View>
          </View>
          <FormSelect icon="sprout-outline" label="Green Leaf Collection ID" placeholder="Select collection ID" value={collection} onPress={() => setPicker('collection')} />
          <FormSelect icon="account-outline" label="Farmer / Source" placeholder="Select farmer" value={farmer} onPress={() => setPicker('farmer')} />
          <FormInput icon="scale-balance" label="Green Leaf Quantity" placeholder="Enter quantity" value={quantity} onChangeText={setQuantity} trailing="kg" keyboardType="decimal-pad" />
          <View style={styles.splitRow}>
            <FormInput icon="calendar-outline" label="Manufactured Date" placeholder="" value={manufacturedDate} onChangeText={setManufacturedDate} />
            <FormSelect icon="factory" label="Factory" placeholder="Select factory" value={factory} onPress={() => setPicker('factory')} />
          </View>
          <FormSelect icon="account-check-outline" label="Responsible Officer" placeholder="Select officer" value={officer} onPress={() => setPicker('officer')} />
          <PrimaryButton
            icon="plus-circle-outline"
            label="Create Batch"
            onPress={() => {
              const id = `B-2026-${String(batches.length + 1).padStart(3, '0')}`;
              const batch: Batch = {
                id,
                collection: collection || 'Land 005',
                farmer: farmer || 'New Farmer',
                quantity: `${quantity || '0'} kg`,
                started: `${manufacturedDate} – 08:00 AM`,
                stage: 'Withering',
                status: 'Processing',
              };
              setBatches((current) => [batch, ...current]);
              setSelectedBatch(batch);
              setUpdateStage('Withering');
              setNextStage('Rolling');
              setScreen('list');
            }}
          />
          <View style={styles.successHint}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color="#178450" />
            <ThemedText type="small" style={styles.successHintText}>Batch information is ready to create.</ThemedText>
          </View>
        </ScrollView>
      ) : null}

      {screen === 'update' ? (
        <View style={styles.updateScreen}>
          <ScrollView
            contentContainerStyle={styles.updateForm}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.batchIdRow}>
              <View style={styles.fieldIcon}>
                <MaterialCommunityIcons name="barcode" size={15} color="#12804D" />
              </View>
              <View style={styles.batchNumberContent}>
                <ThemedText type="smallBold" style={styles.formLabel}>Batch ID</ThemedText>
                <View style={styles.readOnlyValue}>
                  <ThemedText type="smallBold" style={styles.fieldValue}>{selectedBatch.id.replace('B-', 'BATCH-')}</ThemedText>
                </View>
              </View>
            </View>
            <FormSelect icon="chart-timeline-variant" label="Current Stage" placeholder="Select current stage" value={updateStage} onPress={() => setPicker('stage')} />
            <FormSelect icon="send-outline" label="Next Stage" placeholder="Select next stage" value={nextStage} onPress={() => setPicker('nextStage')} />
            <View style={styles.splitRow}>
              <FormInput icon="calendar-outline" label="Date" placeholder="" value={updateDate} onChangeText={setUpdateDate} />
              <FormInput icon="clock-outline" label="Time" placeholder="" value={updateTime} onChangeText={setUpdateTime} />
            </View>
            <View style={styles.splitRow}>
              <FormInput icon="scale-balance" label="Quantity" placeholder="Enter quantity" value={updateQuantity} onChangeText={setUpdateQuantity} trailing={updateUnit} keyboardType="decimal-pad" />
              <FormSelect icon="scale" label=" " placeholder="Unit" value={updateUnit} onPress={() => setPicker('unit')} />
            </View>
            <FormInput icon="file-document-outline" label="Quality / Remarks" placeholder="Enter quality notes or remarks..." value={qualityNotes} onChangeText={setQualityNotes} multiline />
            <PrimaryButton icon="refresh" label="Update Batch" onPress={() => {
              setBatches((current) => current.map((batch) => batch.id === selectedBatch.id
                ? { ...batch, stage: nextStage, status: nextStage === 'Sorting' ? 'Completed' : nextStage }
                : batch));
              setScreen('list');
            }} />
          </ScrollView>
          <StageProgress currentStage={updateStage} />
        </View>
      ) : null}

      <OptionModal
        visible={picker !== null}
        options={pickerOptions}
        selected={picker === 'stage' ? updateStage : picker === 'nextStage' ? nextStage : undefined}
        title={pickerTitle(picker)}
        onClose={() => setPicker(null)}
        onSelect={selectOption}
      />
    </AppFrame>
  );
}

function BatchCard({ batch, onPress }: { batch: Batch; onPress: () => void }) {
  const stageIndex = stages.indexOf(batch.stage);
  const completed = batch.status === 'Completed';
  const statusColor = completed ? '#75859A' : batch.stage === 'Drying' ? '#1689D5' : batch.stage === 'Sorting' ? '#9949D7' : green;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open batch ${batch.id}`} onPress={onPress} style={({ pressed }) => [styles.batchCard, pressed && styles.pressed]}>
      <View style={styles.batchHeader}>
        <ThemedText type="smallBold" style={styles.batchId}>{batch.id}</ThemedText>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}1C` }]}>
          <ThemedText type="smallBold" style={[styles.statusPillText, { color: statusColor }]}>{batch.status}</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={15} color="#98A49B" />
      </View>
      <BatchMeta icon="leaf" text={`Green Leaf: ${batch.collection} (${batch.farmer})`} />
      <BatchMeta icon="scale-balance" text={batch.quantity} />
      <BatchMeta icon="calendar-outline" text={`Started: ${batch.started}`} />
      <View style={styles.stageTrack}>
        {stages.map((stage, index) => {
          const isComplete = completed || index < stageIndex;
          const isCurrent = !completed && index === stageIndex;
          const color = isComplete || isCurrent ? (stage === batch.stage && !completed ? statusColor : '#07935A') : '#D5DEE4';
          return (
            <View key={stage} style={styles.stageNodeWrap}>
              {index > 0 ? <View style={[styles.stageConnector, (isComplete || isCurrent) && styles.stageConnectorActive]} /> : null}
              <View style={[styles.stageNode, { borderColor: color, backgroundColor: isComplete || completed ? '#07935A' : '#FFFFFF' }, isCurrent && { backgroundColor: '#FFFFFF', borderWidth: 2 }]}>
                {(isComplete || completed) ? <MaterialCommunityIcons name="check" size={9} color="#FFFFFF" /> : isCurrent ? <View style={[styles.stageDot, { backgroundColor: color }]} /> : null}
              </View>
              <ThemedText type="small" style={[styles.stageLabel, isCurrent && { color: statusColor, fontWeight: '700' }]}>
                {stage}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

function BatchMeta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.batchMeta}>
      <MaterialCommunityIcons name={icon} size={10} color="#71837A" />
      <ThemedText type="small" style={styles.batchMetaText}>{text}</ThemedText>
    </View>
  );
}

function ActionButton({ icon, label, onPress, secondary = false }: { icon: IconName; label: string; onPress: () => void; secondary?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionButton, secondary && styles.actionButtonSecondary, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={13} color={secondary ? green : '#FFFFFF'} />
      <ThemedText type="smallBold" style={[styles.actionButtonText, secondary && styles.actionButtonTextSecondary]}>{label}</ThemedText>
    </Pressable>
  );
}

function FormLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.formLabelRow}>
      <View style={styles.fieldIcon}><MaterialCommunityIcons name={icon} size={13} color="#16804E" /></View>
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
  trailing,
  multiline = false,
  keyboardType,
}: {
  icon: IconName;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  trailing?: string;
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
          placeholderTextColor="#8C9A91"
          style={[styles.input, multiline && styles.multilineInput]}
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
        />
        {trailing ? <ThemedText type="small" style={styles.inputTrailing}>{trailing}</ThemedText> : null}
      </View>
    </View>
  );
}

function FormSelect({
  icon,
  label,
  placeholder,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  placeholder: string;
  value: string;
  onPress: () => void;
}) {
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

function PrimaryButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={14} color="#FFFFFF" />
      <ThemedText type="smallBold" style={styles.primaryButtonText}>{label}</ThemedText>
    </Pressable>
  );
}

function StageProgress({ currentStage }: { currentStage: BatchStage }) {
  const currentIndex = stages.indexOf(currentStage);
  return (
    <View style={styles.stageProgressCard}>
      {stages.map((stage, index) => {
        const selected = index === currentIndex;
        const done = index < currentIndex;
        return (
          <View key={stage} style={styles.progressItem}>
            <View style={[styles.progressCircle, selected && styles.progressCircleSelected, done && styles.progressCircleDone]}>
              {done ? <MaterialCommunityIcons name="check" size={11} color="#FFFFFF" /> : <MaterialCommunityIcons name={stageIcons[index]} size={11} color={selected ? '#FFFFFF' : '#8292A0'} />}
            </View>
            <ThemedText type="small" style={[styles.progressLabel, selected && styles.progressLabelSelected]}>{stage}</ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const stageIcons: IconName[] = ['weather-windy', 'cog-outline', 'fruit-cherries', 'weather-sunny', 'view-grid-outline'];

function pickerTitle(picker: string | null) {
  if (picker === 'collection') return 'Select Green Leaf Collection';
  if (picker === 'farmer') return 'Select Farmer';
  if (picker === 'factory') return 'Select Factory';
  if (picker === 'officer') return 'Select Responsible Officer';
  if (picker === 'stage') return 'Select Current Stage';
  if (picker === 'nextStage') return 'Select Next Stage';
  return 'Select Unit';
}

function OptionModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <ThemedText type="smallBold" style={styles.modalTitle}>{title}</ThemedText>
          {options.map((option) => (
            <Pressable key={option} accessibilityRole="button" onPress={() => onSelect(option)} style={styles.modalOption}>
              <ThemedText type="small" style={[styles.modalOptionText, option === selected && styles.modalOptionSelected]}>{option}</ThemedText>
              {option === selected ? <MaterialCommunityIcons name="check" size={15} color={green} /> : null}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(249, 253, 247, 0.76)' },
  safeArea: { flex: 1 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 76, 53, 0.08)',
  },
  backButton: { width: 25, height: 34, justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#1C462F', fontSize: 13 },
  brand: { alignItems: 'center', justifyContent: 'center' },
  brandText: { color: green, fontSize: 6, lineHeight: 8 },
  listScreen: { flex: 1, paddingHorizontal: 9, paddingTop: 6 },
  actionRow: { flexDirection: 'row', gap: 6 },
  actionButton: {
    flex: 1,
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 7,
    borderRadius: 15,
    backgroundColor: '#07834C',
  },
  actionButtonSecondary: { borderWidth: 1, borderColor: '#72B48A', backgroundColor: 'rgba(255,255,255,0.94)' },
  actionButtonText: { color: '#FFFFFF', fontSize: 7 },
  actionButtonTextSecondary: { color: green },
  listHeading: { marginTop: 10, marginBottom: 5 },
  listTitle: { color: '#263A2E', fontSize: 10, lineHeight: 14 },
  listSubtitle: { color: '#7A887E', fontSize: 7, lineHeight: 10 },
  batchList: { gap: 6, paddingBottom: 8 },
  batchCard: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E8DF',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  pressed: { opacity: 0.84 },
  batchHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  batchId: { flex: 1, color: '#31463A', fontSize: 8 },
  statusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  statusPillText: { fontSize: 6, lineHeight: 8 },
  batchMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 13 },
  batchMetaText: { color: '#64736A', fontSize: 7, lineHeight: 9 },
  stageTrack: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 2 },
  stageNodeWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  stageConnector: { position: 'absolute', height: 1.5, width: '100%', left: '-50%', top: 6, backgroundColor: '#D8E0E2' },
  stageConnectorActive: { backgroundColor: '#078F58' },
  stageNode: { zIndex: 1, width: 12, height: 12, borderWidth: 1.2, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  stageDot: { width: 5, height: 5, borderRadius: 3 },
  stageLabel: { color: '#839087', fontSize: 5.5, lineHeight: 8, marginTop: 2 },
  formScreen: { flexGrow: 1, gap: 6, paddingHorizontal: 10, paddingTop: 7, paddingBottom: 11 },
  batchIdCard: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDEBE1',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  batchIdIcon: { width: 25, height: 25, borderRadius: 7, backgroundColor: '#E8F6EC', alignItems: 'center', justifyContent: 'center' },
  batchIdText: { flex: 1 },
  batchIdPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: '#E0F7E8' },
  batchIdPillText: { color: '#14804B', fontSize: 7 },
  formGroup: { flex: 1, marginBottom: 2 },
  formLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  fieldIcon: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#E5F4E9', alignItems: 'center', justifyContent: 'center' },
  formLabel: { color: '#405347', fontSize: 7.5, lineHeight: 11 },
  formHint: { color: '#849087', fontSize: 6, lineHeight: 8 },
  inputWrap: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 29,
    paddingHorizontal: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#DFE9E0',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  input: { flex: 1, minHeight: 30, color: '#3E5145', fontSize: 8, paddingVertical: 0 },
  inputTrailing: { color: '#7A887F', fontSize: 7 },
  placeholder: { color: '#8C9A91' },
  multilineWrap: { minHeight: 54, alignItems: 'flex-start', paddingTop: 6 },
  multilineInput: { minHeight: 43, textAlignVertical: 'top' },
  splitRow: { flexDirection: 'row', gap: 6 },
  primaryButton: { minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 4, borderRadius: 8, backgroundColor: '#07804B' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 8 },
  successHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 7 },
  successHintText: { color: '#4C7457', fontSize: 7 },
  updateScreen: { flex: 1, paddingHorizontal: 9, paddingTop: 6, paddingBottom: 5 },
  updateForm: { flexGrow: 1, gap: 7, paddingBottom: 8 },
  batchIdRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  batchNumberContent: { flex: 1 },
  readOnlyValue: { minHeight: 30, justifyContent: 'center', paddingHorizontal: 8, marginTop: 2, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: '#DFE9E0' },
  fieldValue: { color: '#405247', fontSize: 8 },
  stageProgressCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', minHeight: 53, paddingHorizontal: 5, marginTop: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 1, borderColor: '#E1EAE0' },
  progressItem: { flex: 1, alignItems: 'center', gap: 3 },
  progressCircle: { width: 19, height: 19, borderRadius: 10, borderWidth: 1, borderColor: '#D5DEE4', backgroundColor: '#F7F9FA', alignItems: 'center', justifyContent: 'center' },
  progressCircleSelected: { borderColor: '#0A6040', backgroundColor: '#0A6040' },
  progressCircleDone: { borderColor: '#118857', backgroundColor: '#118857' },
  progressLabel: { color: '#829097', fontSize: 5.5 },
  progressLabelSelected: { color: '#0B5B3C', fontWeight: '700' },
  bottomNav: { minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E4EAE4', backgroundColor: 'rgba(255,255,255,0.98)' },
  navItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', gap: 1 },
  navLabel: { color: '#78837B', fontSize: 7, lineHeight: 10 },
  navLabelSelected: { color: green, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'center', paddingHorizontal: 26, backgroundColor: 'rgba(23, 38, 28, 0.35)' },
  modalCard: { padding: 14, borderRadius: 14, backgroundColor: '#FFFFFF' },
  modalTitle: { color: '#294533', fontSize: 12, marginBottom: 6 },
  modalOption: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8EEE8' },
  modalOptionText: { color: '#48594D', fontSize: 10 },
  modalOptionSelected: { color: green, fontWeight: '700' },
  modalCancel: { alignSelf: 'flex-end', paddingHorizontal: 8, paddingTop: 9 },
  modalCancelText: { color: green, fontSize: 9 },
});
