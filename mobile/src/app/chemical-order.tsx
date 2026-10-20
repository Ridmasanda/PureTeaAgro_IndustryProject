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
type SelectName =
  | 'chemical'
  | 'unit'
  | 'period'
  | 'activity'
  | 'fieldOfficer'
  | 'teaArea';

type ChemicalOrder = {
  chemical: string;
  quantity: string;
  unit: string;
  period: string;
  remarks: string;
};

type Distribution = {
  date: string;
  activity: string;
  chemical: string;
  quantity: string;
  unit: string;
  fieldOfficer: string;
  teaArea: string;
  issuedBy: string;
  remarks: string;
};

const green = '#075D38';
const dark = '#284034';
const fieldOfficers = ['Kamal Perera', 'Nimal Perera', 'Sanjewa Silva', 'Sunil Silva'];
const teaAreas = ['Tea Area A', 'Tea Area B', 'Tea Area C', 'Land 001', 'Land 002'];
const chemicals = ['Urea', 'MOP', 'Pesticide', 'Fungicide'];
const units = ['kg', 'L', 'g', 'ml'];
const periods = ['This week', 'This month', 'Next month', 'As required'];
const activities = ['Plucking', 'Fertilizing', 'Pest Control', 'Field Maintenance'];
const steps = [
  'Add Chemical',
  'Chemical Order Approval Status',
  'Chemical Distribution',
  'Field Diary Monitoring',
  'Field Diary Details',
];

const selectOptions: Record<SelectName, string[]> = {
  chemical: chemicals,
  unit: units,
  period: periods,
  activity: activities,
  fieldOfficer: fieldOfficers,
  teaArea: teaAreas,
};

const initialOrder: ChemicalOrder = {
  chemical: '',
  quantity: '',
  unit: '',
  period: '',
  remarks: '',
};

const initialDistribution: Distribution = {
  date: '02 Oct 2026',
  activity: '',
  chemical: 'Urea',
  quantity: '20',
  unit: 'kg',
  fieldOfficer: '',
  teaArea: '',
  issuedBy: 'Factory Officer',
  remarks: '',
};

const diaryRecords = [
  {
    fieldOfficer: 'Kamal Perera',
    farmer: 'Nimal Perera',
    date: '02 Oct 2026 08:30 AM',
    land: 'Land 001',
    activities: ['Plucking', 'Fertilizer Application'],
    workers: '12',
    hours: '6',
    remarks: 'Good condition',
    submitted: '02 Oct 2026 – 4:30 PM',
  },
  {
    fieldOfficer: 'Sanjewa Silva',
    farmer: 'Sunil Silva',
    date: '02 Oct 2026 09:15 AM',
    land: 'Land 003',
    activities: ['Fertilizer Application'],
    workers: '4',
    hours: '4',
    remarks: 'Completed',
    submitted: '02 Oct 2026 – 4:45 PM',
  },
  {
    fieldOfficer: 'Nimal Perera',
    farmer: 'Nimal Perera',
    date: '01 Oct 2026 03:10 PM',
    land: 'Land 002',
    activities: ['Field Maintenance'],
    workers: '3',
    hours: '3',
    remarks: 'Good condition',
    submitted: '01 Oct 2026 – 4:00 PM',
  },
  {
    fieldOfficer: 'Wimal Jayasinghe',
    farmer: 'Wimal Jayasinghe',
    date: '01 Oct 2026 11:20 AM',
    land: 'Land 004',
    activities: ['Pest Control'],
    workers: '2',
    hours: '2',
    remarks: 'Review required',
    submitted: '01 Oct 2026 – 12:10 PM',
  },
];

const bottomItems: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

export default function ChemicalOrderFlowScreen() {
  const [step, setStep] = useState(0);
  const [selectedDiary, setSelectedDiary] = useState<(typeof diaryRecords)[number] | null>(null);
  const [order, setOrder] = useState(initialOrder);
  const [distribution, setDistribution] = useState(initialDistribution);
  const [picker, setPicker] = useState<SelectName | null>(null);
  const [diarySearch, setDiarySearch] = useState('');
  const [diaryDate, setDiaryDate] = useState('02 Oct 2026');
  const [officerFilter, setOfficerFilter] = useState('All Officers');
  const [showDiaryFilters, setShowDiaryFilters] = useState(false);

  const filteredDiary = useMemo(
    () =>
      diaryRecords.filter((record) => {
        const query = diarySearch.trim().toLowerCase();
        const matchesQuery =
          !query ||
          `${record.fieldOfficer} ${record.farmer} ${record.land} ${record.activities.join(' ')}`
            .toLowerCase()
            .includes(query);
        const matchesDate = record.date.startsWith(diaryDate);
        const matchesOfficer =
          officerFilter === 'All Officers' || record.fieldOfficer === officerFilter;
        return matchesQuery && matchesDate && matchesOfficer;
      }),
    [diaryDate, diarySearch, officerFilter],
  );

  const goBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep((current) => current - 1);
    }
  };

  const setOrderField = (field: keyof ChemicalOrder, value: string) => {
    setOrder((current) => ({ ...current, [field]: value }));
  };

  const setDistributionField = (field: keyof Distribution, value: string) => {
    setDistribution((current) => ({ ...current, [field]: value }));
  };

  const selectOption = (value: string) => {
    if (!picker) return;
    if (picker === 'chemical' && step === 2) setDistributionField('chemical', value);
    else if (picker === 'chemical') setOrderField('chemical', value);
    if (picker === 'unit' && step === 2) setDistributionField('unit', value);
    else if (picker === 'unit') setOrderField('unit', value);
    if (picker === 'period') setOrderField('period', value);
    if (picker === 'activity') setDistributionField('activity', value);
    if (picker === 'fieldOfficer') setDistributionField('fieldOfficer', value);
    if (picker === 'teaArea') setDistributionField('teaArea', value);
    setPicker(null);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={goBack}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={21} color={green} />
          </Pressable>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            {steps[step]}
          </ThemedText>
          <View style={styles.brand}>
            <MaterialCommunityIcons name="leaf" size={16} color="#07824D" />
            <ThemedText type="smallBold" style={styles.brandName}>
              PureTeaAgro
            </ThemedText>
          </View>
        </View>

        {step === 0 ? (
          <ScrollView
            contentContainerStyle={styles.addChemicalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <FormSelect
              icon="flask-outline"
              label="Chemical Name"
              placeholder="Select Chemical"
              value={order.chemical}
              onPress={() => setPicker('chemical')}
            />
            <FormInput
              icon="bag-checked"
              label="Required Quantity"
              placeholder="Enter quantity"
              value={order.quantity}
              onChangeText={(value) => setOrderField('quantity', value)}
              keyboardType="decimal-pad"
            />
            <FormSelect
              icon="scale-balance"
              label="Unit"
              placeholder="Select Unit"
              value={order.unit}
              onPress={() => setPicker('unit')}
            />
            <FormSelect
              icon="calendar-month-outline"
              label="Expected Usage Period"
              placeholder="Select Period"
              value={order.period}
              onPress={() => setPicker('period')}
            />
            <FormInput
              icon="file-document-outline"
              label="Remarks"
              placeholder="Add any remarks (optional)"
              value={order.remarks}
              onChangeText={(value) => setOrderField('remarks', value)}
              multiline
            />
            <PrimaryButton
              label="Add to Order"
              icon="plus-circle-outline"
              onPress={() => setStep(1)}
            />
          </ScrollView>
        ) : null}

        {step === 1 ? (
          <ScrollView contentContainerStyle={styles.approvalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.orderSummaryCard}>
              <View style={styles.orderIdRow}>
                <View>
                  <ThemedText type="small" style={styles.mutedLabel}>
                    Order ID
                  </ThemedText>
                  <ThemedText type="smallBold" style={styles.orderId}>
                    CO-2026-004
                  </ThemedText>
                </View>
                <View style={styles.monthBlock}>
                  <ThemedText type="small" style={styles.mutedLabel}>
                    Order Month
                  </ThemedText>
                  <ThemedText type="smallBold" style={styles.orderId}>
                    Oct 2026
                  </ThemedText>
                </View>
              </View>
              <View style={styles.pendingPill}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="#D58A08" />
                <ThemedText type="smallBold" style={styles.pendingText}>
                  Pending Approval
                </ThemedText>
              </View>
            </View>

            <View style={styles.chemicalsCard}>
              <View style={styles.cardTitleRow}>
                <View style={styles.roundIcon}>
                  <MaterialCommunityIcons name="flask-outline" size={14} color="#07824D" />
                </View>
                <ThemedText type="smallBold" style={styles.cardTitle}>
                  Chemicals & Quantities
                </ThemedText>
                <MaterialCommunityIcons name="chevron-right" size={17} color="#7B8B7E" />
              </View>
              <SummaryLine label={order.chemical || 'Urea'} value={`${order.quantity || '80'} ${order.unit || 'kg'}`} />
              <SummaryLine label="MOP" value="50 kg" />
              <SummaryLine label="Pesticide" value="20 L" />
              {order.period ? <SummaryLine label="Usage Period" value={order.period} /> : null}
            </View>

            <View style={styles.approvalDetailsCard}>
              <DetailRow icon="calendar-outline" label="Submitted Date" value="01 Oct 2026 03:45 PM" />
              <DetailRow icon="account-outline" label="Submitted By" value="Thalawakale Factory Officer" />
              <DetailRow icon="account-check-outline" label="Approved By" value="-" />
              <DetailRow icon="calendar-check-outline" label="Approval Date" value="-" />
              <DetailRow icon="message-text-outline" label="Manager Remarks" value="Pending review by Factory Manager." last />
            </View>
            <PrimaryButton
              label="View Order"
              icon="eye-outline"
              onPress={() => {
                setDistributionField('chemical', order.chemical || 'Urea');
                setDistributionField('quantity', order.quantity || '20');
                setDistributionField('unit', order.unit || 'kg');
                setStep(2);
              }}
              secondary
            />
          </ScrollView>
        ) : null}

        {step === 2 ? (
          <ScrollView
            contentContainerStyle={styles.distributionContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.twoColumn}>
              <FormInput
                icon="calendar-outline"
                label="Date"
                placeholder="Select Date"
                value={distribution.date}
                onChangeText={(value) => setDistributionField('date', value)}
              />
              <View />
            </View>
            <FormSelect
              icon="clipboard-list-outline"
              label="Activity"
              placeholder="Select Activity"
              value={distribution.activity}
              onPress={() => setPicker('activity')}
            />
            <FormSelect
              icon="flask-outline"
              label="Chemical"
              placeholder="Select Chemical"
              value={distribution.chemical}
              onPress={() => {
                setOrderField('chemical', distribution.chemical);
                setPicker('chemical');
              }}
            />
            <View style={styles.quantityRow}>
              <View style={styles.quantityInput}>
                <FormInput
                  icon="cube-outline"
                  label="Quantity"
                  placeholder="Enter quantity"
                  value={distribution.quantity}
                  onChangeText={(value) => setDistributionField('quantity', value)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.unitPicker}>
                <FormSelect
                  icon="scale-balance"
                  label=" "
                  placeholder="Unit"
                  value={distribution.unit}
                  onPress={() => {
                    setOrderField('unit', distribution.unit);
                    setPicker('unit');
                  }}
                />
              </View>
            </View>
            <FormSelect
              icon="account-outline"
              label="Issued To"
              placeholder="Select Field Officer"
              value={distribution.fieldOfficer}
              onPress={() => setPicker('fieldOfficer')}
            />
            <FormSelect
              icon="map-marker-outline"
              label="Tea Area / Field"
              placeholder="Select Tea Area"
              value={distribution.teaArea}
              onPress={() => setPicker('teaArea')}
            />
            <FormInput
              icon="account-check-outline"
              label="Issued By"
              placeholder="Issued By"
              value={distribution.issuedBy}
              onChangeText={(value) => setDistributionField('issuedBy', value)}
            />
            <FormInput
              icon="message-text-outline"
              label="Remarks"
              placeholder="Add remarks (optional)"
              value={distribution.remarks}
              onChangeText={(value) => setDistributionField('remarks', value)}
              multiline
            />
            <PrimaryButton
              label="Record Distribution"
              icon="content-save-outline"
              onPress={() => setStep(3)}
            />
          </ScrollView>
        ) : null}

        {step === 3 ? (
          <View style={styles.diaryScreen}>
            <View style={styles.diaryFilters}>
              <FormSelect
                icon="calendar-month-outline"
                label="Select Date"
                placeholder="Select Date"
                value={diaryDate}
                onPress={() => setDiaryDate(diaryDate === '02 Oct 2026' ? '01 Oct 2026' : '02 Oct 2026')}
              />
              <FormSelect
                icon="account-outline"
                label="Select Field Officer"
                placeholder="All Officers"
                value={officerFilter === 'All Officers' ? '' : officerFilter}
                onPress={() => setShowDiaryFilters(true)}
              />
              <View style={styles.diarySearch}>
                <MaterialCommunityIcons name="magnify" size={15} color="#809187" />
                <TextInput
                  accessibilityLabel="Search farmer, land or activity"
                  onChangeText={setDiarySearch}
                  placeholder="Search by farmer, land or activity..."
                  placeholderTextColor="#8D9991"
                  style={styles.diarySearchInput}
                  value={diarySearch}
                />
              </View>
            </View>
            <View style={styles.todayHeading}>
              <ThemedText type="smallBold" style={styles.todayTitle}>
                Today’s Records
              </ThemedText>
              <ThemedText type="small" style={styles.recordsCount}>
                {filteredDiary.length} records
              </ThemedText>
            </View>
            <ScrollView contentContainerStyle={styles.diaryRecords} showsVerticalScrollIndicator={false}>
              {filteredDiary.map((record) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View field diary details for ${record.fieldOfficer}`}
                  key={`${record.fieldOfficer}-${record.date}`}
                  onPress={() => {
                    setSelectedDiary(record);
                    setStep(4);
                  }}
                  style={({ pressed }) => [styles.diaryCard, pressed && styles.pressed]}>
                  <View style={styles.diaryCardHeader}>
                    <View style={styles.officerAvatar}>
                      <MaterialCommunityIcons name="account-outline" size={15} color="#058251" />
                    </View>
                    <View style={styles.diaryOfficer}>
                      <ThemedText type="smallBold" style={styles.diaryOfficerName}>
                        {record.fieldOfficer}
                      </ThemedText>
                      <ThemedText type="small" style={styles.diaryRole}>
                        Field Officer
                      </ThemedText>
                    </View>
                    <View style={styles.submittedBadge}>
                      <ThemedText type="smallBold" style={styles.submittedText}>
                        Submitted
                      </ThemedText>
                    </View>
                  </View>
                  <DiaryLine icon="calendar-outline" text={record.date} />
                  <DiaryLine icon="map-marker-outline" text={`${record.farmer} • ${record.land}`} />
                  <DiaryLine
                    icon="check-outline"
                    text={`${record.activities.join(', ')} • ${record.workers} workers • ${record.hours} hrs`}
                  />
                  <DiaryLine icon="message-text-outline" text={`Remarks: ${record.remarks}`} />
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#819187" style={styles.diaryChevron} />
                </Pressable>
              ))}
              {filteredDiary.length === 0 ? (
                <ThemedText type="small" style={styles.noRecords}>
                  No field diary records match your filters.
                </ThemedText>
              ) : null}

            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowDiaryFilters(true)}
              style={styles.filterSearchButton}>
              <MaterialCommunityIcons name="filter-outline" size={14} color={green} />
              <ThemedText type="smallBold" style={styles.filterSearchText}>
                Filter / Search
              </ThemedText>
            </Pressable>
          </View>
        ) : null}

        {step === 4 && selectedDiary ? (
          <View style={styles.diaryDetailsScreen}>
            <ScrollView
              contentContainerStyle={styles.diaryDetailsContent}
              showsVerticalScrollIndicator={false}>
              <DiaryDetailRow
                icon="account-tie"
                label="Field Officer"
                value={selectedDiary.fieldOfficer}
                avatar
              />
              <DiaryDetailRow
                icon="calendar-month"
                label="Date"
                value={selectedDiary.date.split(' ').slice(0, 3).join(' ')}
              />
              <DiaryDetailRow icon="account" label="Farmer" value={selectedDiary.farmer} avatar />
              <DiaryDetailRow icon="map-marker" label="Tea Land" value={selectedDiary.land} />
              <View style={[styles.diaryDetailCard, styles.activitiesDetailCard]}>
                <View style={styles.diaryDetailIcon}>
                  <MaterialCommunityIcons name="leaf" size={17} color="#07824D" />
                </View>
                <View style={styles.diaryDetailBody}>
                  <ThemedText type="small" style={styles.diaryDetailLabel}>
                    Activities
                  </ThemedText>
                  <View style={styles.activityChipList}>
                    {selectedDiary.activities.map((activity) => (
                      <View key={activity} style={styles.activityChip}>
                        <MaterialCommunityIcons name="check-circle" size={12} color="#18834D" />
                        <ThemedText type="small" style={styles.activityChipText}>
                          {activity}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.workStatsRow}>
                <DiaryStat icon="account-group" label="Workers" value={selectedDiary.workers} />
                <DiaryStat icon="clock-time-eight" label="Working Hours" value={selectedDiary.hours} />
              </View>
              <DiaryDetailRow icon="text-box" label="Remarks" value={selectedDiary.remarks} />
              <DiaryDetailRow icon="calendar-check" label="Submitted" value={selectedDiary.submitted} />
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() => setStep(3)}
              style={({ pressed }) => [styles.backToListButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="arrow-left" size={15} color={green} />
              <ThemedText type="smallBold" style={styles.backToListText}>
                Back to List
              </ThemedText>
            </Pressable>
          </View>
        ) : null}

        <BottomNavigation activeTab="Books" />

        <SelectModal
          visible={picker !== null}
          title={picker ? selectLabel(picker) : ''}
          options={picker ? selectOptions[picker] : []}
          selected={picker === 'chemical' ? order.chemical : picker === 'unit' ? order.unit : undefined}
          onClose={() => setPicker(null)}
          onSelect={selectOption}
        />
        <DiaryFilterModal
          visible={showDiaryFilters}
          selected={officerFilter}
          onClose={() => setShowDiaryFilters(false)}
          onSelect={(value) => {
            setOfficerFilter(value);
            setShowDiaryFilters(false);
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

function selectLabel(key: SelectName) {
  const labels: Record<SelectName, string> = {
    chemical: 'Select Chemical',
    unit: 'Select Unit',
    period: 'Expected Usage Period',
    activity: 'Select Activity',
    fieldOfficer: 'Select Field Officer',
    teaArea: 'Select Tea Area / Field',
  };
  return labels[key];
}

function FormLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.formLabelRow}>
      <View style={styles.formIcon}>
        <MaterialCommunityIcons name={icon} size={13} color="#4A8060" />
      </View>
      <ThemedText type="small" style={styles.formLabel}>
        {label}
      </ThemedText>
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
          placeholderTextColor="#89968D"
          style={[styles.input, multiline && styles.multilineInput]}
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
        />
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
        <ThemedText type="small" style={[styles.selectValue, !value && styles.placeholder]}>
          {value || placeholder}
        </ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={16} color="#7A8D81" />
      </Pressable>
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
  secondary = false,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        secondary && styles.secondaryButton,
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={15} color={secondary ? green : '#FFFFFF'} />
      <ThemedText type="smallBold" style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryLine}>
      <ThemedText type="small" style={styles.summaryLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.summaryValue}>
        {value}
      </ThemedText>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, last && styles.lastDetailRow]}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={13} color="#26915C" />
      </View>
      <View style={styles.detailText}>
        <ThemedText type="small" style={styles.detailLabel}>
          {label}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.detailValue}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

function DiaryLine({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.diaryLine}>
      <MaterialCommunityIcons name={icon} size={11} color="#829087" />
      <ThemedText type="small" style={styles.diaryLineText}>
        {text}
      </ThemedText>
    </View>
  );
}

function DiaryDetailRow({
  icon,
  label,
  value,
  avatar = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  avatar?: boolean;
}) {
  return (
    <View style={styles.diaryDetailCard}>
      <View style={[styles.diaryDetailIcon, avatar && styles.diaryAvatar]}>
        <MaterialCommunityIcons name={icon} size={17} color={avatar ? '#16834B' : '#07824D'} />
      </View>
      <View style={styles.diaryDetailBody}>
        <ThemedText type="small" style={styles.diaryDetailLabel}>
          {label}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.diaryDetailValue}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

function DiaryStat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.diaryStatCard}>
      <View style={styles.diaryDetailIcon}>
        <MaterialCommunityIcons name={icon} size={17} color="#07824D" />
      </View>
      <View style={styles.diaryDetailBody}>
        <ThemedText type="small" style={styles.diaryDetailLabel}>
          {label}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.diaryDetailValue}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

function SelectModal({
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
          <ThemedText type="smallBold" style={styles.modalTitle}>
            {title}
          </ThemedText>
          <ScrollView style={styles.modalOptions} showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <Pressable
                accessibilityRole="button"
                key={option}
                onPress={() => onSelect(option)}
                style={styles.modalOption}>
                <ThemedText
                  type="small"
                  style={[styles.modalOptionText, option === selected && styles.modalOptionSelected]}>
                  {option}
                </ThemedText>
                {option === selected ? <MaterialCommunityIcons name="check" size={16} color={green} /> : null}
              </Pressable>
            ))}
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalCancel}>
            <ThemedText type="smallBold" style={styles.modalCancelText}>
              Cancel
            </ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function DiaryFilterModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <SelectModal
      visible={visible}
      title="Select Field Officer"
      options={['All Officers', ...fieldOfficers]}
      selected={selected}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}

function BottomNavigation({ activeTab }: { activeTab: string }) {
  return (
    <View style={styles.bottomNav}>
      {bottomItems.map(([label, icon]) => {
        const selected = label === activeTab;
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
              else if (label === 'Reports') router.replace('/factory-reports');
              else if (label === 'Profile') router.replace('/factory-officer-profile');
            }}
            style={styles.navItem}>
            <MaterialCommunityIcons name={icon} size={18} color={selected ? '#087B4A' : '#78837B'} />
            <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(249, 253, 247, 0.80)',
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
    width: 25,
    height: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#1B432E',
    fontSize: 12,
  },
  brand: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#087344',
    fontSize: 6,
    lineHeight: 8,
  },
  addChemicalContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 8,
  },
  formLabelRow: {
    minHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 3,
  },
  formIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F3E8',
  },
  formLabel: {
    color: '#4B5C50',
    fontSize: 8,
  },
  inputWrap: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 9,
    marginLeft: 31,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E0E7DF',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  input: {
    flex: 1,
    minHeight: 29,
    color: '#3E5145',
    fontSize: 9,
    paddingVertical: 0,
  },
  selectValue: {
    flex: 1,
    color: '#3E5145',
    fontSize: 9,
  },
  placeholder: {
    color: '#89968D',
  },
  multilineWrap: {
    minHeight: 50,
    alignItems: 'flex-start',
    paddingTop: 6,
  },
  multilineInput: {
    minHeight: 40,
  },
  primaryButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#07804B',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  pressed: {
    opacity: 0.84,
  },
  approvalContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 12,
  },
  orderSummaryCard: {
    padding: 11,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E4EBE3',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthBlock: {
    alignItems: 'flex-end',
  },
  mutedLabel: {
    color: '#718077',
    fontSize: 8,
    lineHeight: 12,
  },
  orderId: {
    color: '#263A2D',
    fontSize: 10,
    lineHeight: 14,
  },
  pendingPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 7,
    borderRadius: 10,
    backgroundColor: '#FFF4DB',
  },
  pendingText: {
    color: '#BD7800',
    fontSize: 7,
  },
  chemicalsCard: {
    padding: 10,
    marginTop: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E4EBE3',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roundIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4F3E8',
  },
  cardTitle: {
    flex: 1,
    color: '#35483B',
    fontSize: 9,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingVertical: 2,
  },
  summaryLabel: {
    color: '#627168',
    fontSize: 8,
  },
  summaryValue: {
    color: '#48594E',
    fontSize: 8,
  },
  approvalDetailsCard: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E4EBE3',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  detailRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2EE',
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5EC',
  },
  detailText: {
    flex: 1,
    gap: 1,
  },
  detailLabel: {
    color: '#758178',
    fontSize: 7,
    lineHeight: 10,
  },
  detailValue: {
    color: '#435348',
    fontSize: 8,
    lineHeight: 11,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#BFD9C7',
  },
  secondaryButtonText: {
    color: green,
  },
  distributionContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 10,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quantityInput: {
    flex: 1,
  },
  unitPicker: {
    width: 95,
  },
  diaryScreen: {
    flex: 1,
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 5,
  },
  diaryFilters: {
    gap: 5,
  },
  diarySearch: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    marginLeft: 31,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E0E7DF',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  diarySearchInput: {
    flex: 1,
    height: 29,
    fontSize: 8,
    color: '#425449',
    paddingVertical: 0,
  },
  todayHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    marginBottom: 4,
  },
  todayTitle: {
    color: '#405346',
    fontSize: 9,
  },
  recordsCount: {
    color: '#849087',
    fontSize: 7,
  },
  diaryRecords: {
    gap: 6,
    paddingBottom: 5,
  },
  diaryCard: {
    position: 'relative',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2EAE1',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  diaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  officerAvatar: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1F4E8',
  },
  diaryOfficer: {
    flex: 1,
  },
  diaryOfficerName: {
    color: '#3D4D42',
    fontSize: 8,
    lineHeight: 11,
  },
  diaryRole: {
    color: '#94A097',
    fontSize: 7,
    lineHeight: 9,
  },
  submittedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#DFF3E5',
  },
  submittedText: {
    color: '#13804C',
    fontSize: 6,
  },
  diaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 14,
    paddingLeft: 3,
  },
  diaryLineText: {
    color: '#6F7C72',
    fontSize: 7,
    lineHeight: 10,
  },
  diaryChevron: {
    position: 'absolute',
    right: 5,
    top: '48%',
  },
  noRecords: {
    color: '#718077',
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 25,
  },
  diaryDetailsScreen: {
    flex: 1,
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 5,
  },
  diaryDetailsContent: {
    flexGrow: 1,
    gap: 5,
    paddingBottom: 5,
  },
  diaryDetailCard: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCEBE2',
    backgroundColor: 'rgba(248, 255, 250, 0.93)',
  },
  diaryDetailIcon: {
    width: 29,
    height: 29,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFF5E7',
  },
  diaryAvatar: {
    backgroundColor: '#D7F1E0',
  },
  diaryDetailBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
  },
  diaryDetailLabel: {
    color: '#48705A',
    fontSize: 8,
    lineHeight: 11,
  },
  diaryDetailValue: {
    color: '#315A42',
    fontSize: 9,
    lineHeight: 13,
  },
  activitiesDetailCard: {
    minHeight: 68,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  activityChipList: {
    alignItems: 'flex-start',
    gap: 3,
    marginTop: 3,
  },
  activityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9,
    backgroundColor: '#E6F6EA',
  },
  activityChipText: {
    color: '#27613E',
    fontSize: 7,
    lineHeight: 10,
  },
  workStatsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  diaryStatCard: {
    flex: 1,
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCEBE2',
    backgroundColor: 'rgba(248, 255, 250, 0.93)',
  },
  backToListButton: {
    minHeight: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 5,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#77BA8D',
    backgroundColor: '#E5F7EA',
  },
  backToListText: {
    color: green,
    fontSize: 9,
  },
  filterSearchButton: {
    alignSelf: 'center',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 13,
    marginVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6AA17A',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  filterSearchText: {
    color: green,
    fontSize: 8,
  },
  bottomNav: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E4EAE4',
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
    paddingHorizontal: 26,
    backgroundColor: 'rgba(23, 38, 28, 0.35)',
  },
  modalCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    color: '#294533',
    fontSize: 13,
    marginBottom: 6,
  },
  modalOptions: {
    maxHeight: 260,
  },
  modalOption: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8EEE8',
  },
  modalOptionText: {
    color: '#48594D',
    fontSize: 11,
  },
  modalOptionSelected: {
    color: green,
    fontWeight: '700',
  },
  modalCancel: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  modalCancelText: {
    color: green,
    fontSize: 10,
  },
});
