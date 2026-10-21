import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Farmer = { name: string; id: string };
type TeaLand = { name: string; id: string };
type CollectionDetails = {
  date: string;
  time: string;
  weight: string;
  vehicle: string;
  collectorId: string;
  factory: string;
  moisture: string;
  remarks: string;
};

const farmers: Farmer[] = [
  { name: 'Nimal Perera', id: 'FRM-0021' },
  { name: 'Kamala Silva', id: 'FRM-0045' },
  { name: 'Sampath Wickramasinghe', id: 'FRM-0078' },
  { name: 'Sunil Fernando', id: 'FRM-0092' },
  { name: 'Ranjith Silva', id: 'FRM-0101' },
];

const teaLands: TeaLand[] = [
  { name: 'Land 01 - Thalatu Oya', id: 'LA-001' },
  { name: 'Land 02 - Kandy', id: 'LA-002' },
  { name: 'Land 03 - Galaha', id: 'LA-003' },
];

const qualityOptions = ['Good', 'Average', 'Poor'] as const;
type LeafQuality = (typeof qualityOptions)[number];
type WorkflowPage = 'steps' | 'success' | 'summary';

function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function currentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function StepProgress({ step }: { step: number }) {
  const labels = ['Farmer', 'Land', 'Details', 'Quality', 'Review'];

  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressRow}>
        {labels.map((label, index) => {
          const number = index + 1;
          const active = number === step;
          const completed = number < step;

          return (
            <View key={label} style={styles.progressItem}>
              <View
                style={[
                  styles.progressCircle,
                  active && styles.progressActive,
                  completed && styles.progressCompleted,
                ]}>
                {completed ? (
                  <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />
                ) : (
                  <ThemedText type="smallBold" style={[styles.progressNumber, active && styles.progressNumberActive]}>
                    {number}
                  </ThemedText>
                )}
              </View>
              {index < labels.length - 1 && (
                <View style={[styles.progressLine, completed && styles.progressLineCompleted]} />
              )}
            </View>
          );
        })}
      </View>
      <ThemedText type="smallBold" style={styles.progressCaption}>
        {step} / 5  ·  {labels[step - 1]}
      </ThemedText>
    </View>
  );
}

function SectionCard({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialCommunityIcons name={icon} size={16} color="#2D7A43" />
      </View>
      <View style={styles.infoText}>
        <ThemedText type="small" style={styles.infoLabel}>{label}</ThemedText>
        <ThemedText type="smallBold" style={styles.infoValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

export default function CollectorNewCollectionScreen() {
  const [step, setStep] = useState(1);
  const [page, setPage] = useState<WorkflowPage>('steps');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(farmers[0].id);
  const [selectedLand, setSelectedLand] = useState(teaLands[0].id);
  const [quality, setQuality] = useState<LeafQuality>('Good');
  const [factoryOptionsVisible, setFactoryOptionsVisible] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState<CollectionDetails>({
    date: currentDate(),
    time: currentTime(),
    weight: '420',
    vehicle: 'CP - 1234',
    collectorId: 'COL-003',
    factory: 'Thalawakale Factory',
    moisture: '68',
    remarks: '',
  });

  const farmer = farmers.find((item) => item.id === selectedFarmer) ?? farmers[0];
  const land = teaLands.find((item) => item.id === selectedLand) ?? teaLands[0];
  const collectionId = `CL-${currentDate().replaceAll('-', '')}-001`;

  function updateDetails(field: keyof CollectionDetails, value: string) {
    setDetails((previous) => ({ ...previous, [field]: value }));
    setError('');
  }

  function goBack() {
    setError('');
    if (page === 'summary') {
      setPage('success');
      return;
    }
    if (page === 'success') {
      setPage('steps');
      setStep(5);
      return;
    }
    if (step > 1) {
      setStep((current) => current - 1);
      return;
    }
    router.back();
  }

  function goNext() {
    setError('');
    if (step === 3 && (!details.weight.trim() || !Number.isFinite(Number(details.weight)) || Number(details.weight) <= 0)) {
      setError('Enter a valid green leaf weight.');
      return;
    }
    if (step === 4 && (
      !details.moisture.trim()
      || !Number.isFinite(Number(details.moisture))
      || Number(details.moisture) < 0
      || Number(details.moisture) > 100
    )) {
      setError('Enter a moisture value between 0 and 100%.');
      return;
    }
    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }
    setPage('success');
  }

  function updateField(
    label: string,
    key: keyof CollectionDetails,
    options: { keyboardType?: 'default' | 'decimal-pad'; icon?: IconName } = {},
  ) {
    return (
      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.fieldLabel}>
          {options.icon && <MaterialCommunityIcons name={options.icon} size={14} color="#34754A" />} {label}
        </ThemedText>
        <TextInput
          accessibilityLabel={label}
          value={details[key]}
          onChangeText={(value) => updateDetails(key, value)}
          style={styles.textInput}
          placeholder={label}
          placeholderTextColor="#87958A"
          keyboardType={options.keyboardType ?? 'default'}
          autoCapitalize="none"
        />
      </View>
    );
  }

  function renderStep() {
    if (step === 1) {
      const matchingFarmers = farmers.filter((item) =>
        `${item.name} ${item.id}`.toLowerCase().includes(farmerSearch.trim().toLowerCase()),
      );

      return (
        <View style={styles.stepBody}>
          <ThemedText type="smallBold" style={styles.stepTitle}>Select Farmer</ThemedText>
          <SectionCard style={styles.searchCard}>
            <MaterialCommunityIcons name="magnify" size={19} color="#779181" />
            <TextInput
              accessibilityLabel="Search farmer"
              onChangeText={setFarmerSearch}
              placeholder="Search farmer name or ID..."
              placeholderTextColor="#8A988F"
              style={styles.searchInput}
              value={farmerSearch}
            />
          </SectionCard>
          <View style={styles.list}>
            {matchingFarmers.map((item) => {
              const selected = selectedFarmer === item.id;
              const index = farmers.indexOf(item);
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={item.id}
                  onPress={() => setSelectedFarmer(item.id)}
                  style={({ pressed }) => [styles.farmerCard, selected && styles.selectedCard, pressed && styles.pressed]}>
                  <View style={styles.personAvatar}>
                    <MaterialCommunityIcons
                      name={index % 2 === 0 ? 'account-tie-hat-outline' : 'account-outline'}
                      size={25}
                      color="#2D7A43"
                    />
                  </View>
                  <View style={styles.personText}>
                    <ThemedText type="smallBold" style={styles.personName}>{item.name}</ThemedText>
                    <ThemedText type="small" style={styles.personId}>{item.id}</ThemedText>
                  </View>
                  <MaterialCommunityIcons
                    name={selected ? 'check-circle' : 'chevron-right'}
                    size={21}
                    color={selected ? '#238144' : '#6E8E77'}
                  />
                </Pressable>
              );
            })}
            {matchingFarmers.length === 0 && (
              <ThemedText type="small" style={styles.emptySearch}>
                No farmers match that search.
              </ThemedText>
            )}
          </View>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.stepBody}>
          <ThemedText type="smallBold" style={styles.stepTitle}>Select Tea Land</ThemedText>
          <SectionCard style={styles.selectedPerson}>
            <View style={styles.personAvatar}>
              <MaterialCommunityIcons name="account-tie-hat-outline" size={25} color="#2D7A43" />
            </View>
            <View style={styles.personText}>
              <ThemedText type="smallBold" style={styles.personName}>{farmer.name}</ThemedText>
              <ThemedText type="small" style={styles.personId}>{farmer.id}</ThemedText>
            </View>
          </SectionCard>
          <ThemedText type="smallBold" style={styles.subsectionTitle}>Associated Lands</ThemedText>
          <View style={styles.list}>
            {teaLands.map((item) => {
              const selected = selectedLand === item.id;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={item.id}
                  onPress={() => setSelectedLand(item.id)}
                  style={({ pressed }) => [styles.landCard, selected && styles.selectedCard, pressed && styles.pressed]}>
                  <View style={styles.landIcon}>
                    <MaterialCommunityIcons name="leaf" size={20} color="#4C9B48" />
                  </View>
                  <View style={styles.personText}>
                    <ThemedText type="smallBold" style={styles.personName}>{item.name}</ThemedText>
                    <ThemedText type="small" style={styles.personId}>{item.id}</ThemedText>
                  </View>
                  <MaterialCommunityIcons
                    name={selected ? 'check-circle' : 'checkbox-blank-circle-outline'}
                    size={21}
                    color={selected ? '#238144' : '#A7BBB0'}
                  />
                </Pressable>
              );
            })}
          </View>
          <SectionCard style={styles.selectedLand}>
            <MaterialCommunityIcons name="map-marker-check-outline" size={20} color="#317B43" />
            <View style={styles.selectedLandText}>
              <ThemedText type="smallBold" style={styles.personName}>Selected Land</ThemedText>
              <ThemedText type="small" style={styles.personId}>{land.id} · {land.name.replace('Land 01 - ', '').replace('Land 02 - ', '').replace('Land 03 - ', '')}</ThemedText>
            </View>
          </SectionCard>
        </View>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.stepBody}>
          <ThemedText type="smallBold" style={styles.stepTitle}>Collection Details</ThemedText>
          <SectionCard>
            {updateField('Collection Date', 'date', { icon: 'calendar-month-outline' })}
            {updateField('Collection Time', 'time', { icon: 'clock-outline' })}
            {updateField('Green Leaf Weight (kg)', 'weight', { keyboardType: 'decimal-pad', icon: 'leaf' })}
            {updateField('Vehicle Number', 'vehicle', { icon: 'truck-outline' })}
            {updateField('Collector ID', 'collectorId', { icon: 'badge-account-outline' })}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                <MaterialCommunityIcons name="factory" size={14} color="#34754A" /> Factory Destination
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => setFactoryOptionsVisible((visible) => !visible)}
                style={styles.selectInput}>
                <ThemedText type="small" style={styles.selectText}>{details.factory}</ThemedText>
                <MaterialCommunityIcons name="chevron-down" size={19} color="#34754A" />
              </Pressable>
              {factoryOptionsVisible && (
                <View style={styles.optionsList}>
                  {['Thalawakale Factory', 'Kandy Factory', 'Nuwara Eliya Factory'].map((factoryName) => (
                    <Pressable
                      key={factoryName}
                      onPress={() => {
                        updateDetails('factory', factoryName);
                        setFactoryOptionsVisible(false);
                      }}
                      style={styles.optionRow}>
                      <ThemedText type="small" style={styles.optionText}>{factoryName}</ThemedText>
                      {details.factory === factoryName && (
                        <MaterialCommunityIcons name="check" size={17} color="#287B40" />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </SectionCard>
        </View>
      );
    }

    if (step === 4) {
      return (
        <View style={styles.stepBody}>
          <ThemedText type="smallBold" style={styles.stepTitle}>Quality Details</ThemedText>
          <SectionCard>
            <ThemedText type="smallBold" style={styles.fieldLabel}>Leaf Quality</ThemedText>
            <View style={styles.qualityOptions}>
              {qualityOptions.map((option) => {
                const selected = quality === option;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={option}
                    onPress={() => setQuality(option)}
                    style={[styles.qualityChip, selected && styles.qualityChipSelected]}>
                    <ThemedText type="smallBold" style={[styles.qualityText, selected && styles.qualityTextSelected]}>
                      {option}
                    </ThemedText>
                    {selected && <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" />}
                  </Pressable>
                );
              })}
            </View>
            {updateField('Moisture (%)', 'moisture', { keyboardType: 'decimal-pad', icon: 'water-percent' })}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>Remarks (Optional)</ThemedText>
              <TextInput
                accessibilityLabel="Remarks (Optional)"
                value={details.remarks}
                onChangeText={(value) => updateDetails('remarks', value)}
                placeholder="Fresh leaves, good quality..."
                placeholderTextColor="#87958A"
                style={[styles.textInput, styles.remarksInput]}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.photoPlaceholder}>
              <MaterialCommunityIcons name="camera-plus-outline" size={25} color="#448650" />
              <ThemedText type="smallBold" style={styles.photoText}>Add leaf quality photo</ThemedText>
              <ThemedText type="small" style={styles.photoHint}>Photo upload will be available when connected</ThemedText>
            </View>
          </SectionCard>
        </View>
      );
    }

    return (
      <View style={styles.stepBody}>
        <ThemedText type="smallBold" style={styles.stepTitle}>Review &amp; Submit</ThemedText>
        <ThemedText type="small" style={styles.reviewHint}>Confirm your details before recording.</ThemedText>
        <SectionCard style={styles.reviewCard}>
          <InfoRow icon="account-outline" label="Farmer" value={`${farmer.name} (${farmer.id})`} />
          <InfoRow icon="leaf" label="Land" value={`${land.id} · ${land.name}`} />
          <View style={styles.reviewDivider} />
          <InfoRow icon="calendar-clock-outline" label="Collection Details" value={`${details.date}  ·  ${details.time}`} />
          <InfoRow icon="weight-kilogram" label="Green Leaf Weight" value={`${details.weight} kg`} />
          <InfoRow icon="truck-outline" label="Vehicle" value={details.vehicle} />
          <InfoRow icon="badge-account-outline" label="Collector ID" value={details.collectorId} />
          <InfoRow icon="factory" label="Factory Destination" value={details.factory} />
          <View style={styles.reviewDivider} />
          <InfoRow icon="leaf-circle-outline" label="Leaf Quality" value={quality} />
          <InfoRow icon="water-percent" label="Moisture" value={`${details.moisture}%`} />
          {details.remarks.trim() ? <InfoRow icon="note-text-outline" label="Remarks" value={details.remarks} /> : null}
        </SectionCard>
      </View>
    );
  }

  function renderSuccess() {
    return (
      <View style={styles.resultBody}>
        <View style={styles.resultIcon}>
          <MaterialCommunityIcons name="check" size={56} color="#FFFFFF" />
        </View>
        <ThemedText type="smallBold" style={styles.resultTitle}>Collection Recorded!</ThemedText>
        <ThemedText type="small" style={styles.resultSubtitle}>
          Green leaf collection details are ready.
        </ThemedText>
        <SectionCard style={styles.receiptCard}>
          <InfoRow icon="card-text-outline" label="Collection ID" value={collectionId} />
          <InfoRow icon="clock-time-four-outline" label="Date & Time" value={`${details.date}  ·  ${details.time}`} />
        </SectionCard>
        <ThemedText type="small" style={styles.demoNote}>
          Demo only: this collection has not been saved to a server.
        </ThemedText>
      </View>
    );
  }

  function renderSummary() {
    return (
      <View style={styles.stepBody}>
        <ThemedText type="smallBold" style={styles.stepTitle}>Collection Summary</ThemedText>
        <SectionCard style={styles.summaryCard}>
          <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.summaryLogo} />
          <ThemedText type="smallBold" style={styles.summaryHeading}>Green Leaf Collection</ThemedText>
          <InfoRow icon="account-outline" label="Farmer" value={`${farmer.name} (${farmer.id})`} />
          <InfoRow icon="leaf" label="Land" value={`${land.id} · ${land.name}`} />
          <InfoRow icon="weight-kilogram" label="Weight" value={`${details.weight} kg`} />
          <InfoRow icon="truck-outline" label="Vehicle" value={details.vehicle} />
          <InfoRow icon="badge-account-outline" label="Collector" value={details.collectorId} />
          <InfoRow icon="factory" label="Factory" value={details.factory} />
          <InfoRow icon="calendar-clock-outline" label="Date & Time" value={`${details.date}  ·  ${details.time}`} />
          <InfoRow icon="leaf-circle-outline" label="Quality" value={`${quality}  ·  ${details.moisture}% moisture`} />
          <View style={styles.reviewDivider} />
          <ThemedText type="small" style={styles.demoNote}>
            Demo receipt · Not synced to a server
          </ThemedText>
        </SectionCard>
      </View>
    );
  }

  const title = page === 'summary' ? 'Collection Summary' : page === 'success' ? 'Collection Recorded' : 'Green Leaf Collection';
  const buttonTitle = page === 'summary'
    ? 'Done'
    : page === 'success'
    ? 'View Receipt'
    : step === 5
      ? 'Submit Collection'
      : 'Next';

  function handlePrimaryAction() {
    if (page === 'success') {
      setPage('summary');
      return;
    }
    if (page === 'summary') {
      router.back();
      return;
    }
    goNext();
  }

  function returnHome() {
    router.dismissTo('/collector-home');
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardArea}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={goBack} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={21} color="#194D2D" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>{title}</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {page === 'steps' && <StepProgress step={step} />}
            {page === 'steps' ? renderStep() : page === 'success' ? renderSuccess() : renderSummary()}
          </ScrollView>

          {error ? (
            <ThemedText accessibilityRole="alert" type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}
          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>{buttonTitle}</ThemedText>
              <MaterialCommunityIcons
                name={page === 'summary' ? 'check' : page === 'success' ? 'receipt-text-outline' : 'arrow-right'}
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
            {page === 'success' && (
              <Pressable
                accessibilityRole="button"
                onPress={returnHome}
                style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={styles.homeButtonText}>Back to Collections</ThemedText>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FBF4',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(247, 253, 246, 0.87)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  header: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(49,104,61,0.1)',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#214C30',
    fontSize: 15,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 17,
    paddingTop: 7,
    paddingBottom: 14,
  },
  progressBlock: {
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#E5EFE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E5D7',
  },
  progressActive: {
    backgroundColor: '#176B32',
    borderColor: '#176B32',
  },
  progressCompleted: {
    backgroundColor: '#65A768',
    borderColor: '#65A768',
  },
  progressNumber: {
    color: '#698172',
    fontSize: 10,
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8D9CB',
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: '#65A768',
  },
  progressCaption: {
    color: '#617466',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    color: '#19472A',
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 10,
  },
  subsectionTitle: {
    color: '#365C3F',
    fontSize: 12,
    marginTop: 11,
    marginBottom: 7,
  },
  searchCard: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 9,
  },
  searchInput: {
    flex: 1,
    minHeight: 38,
    color: '#203B29',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  emptySearch: {
    color: '#76867A',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 18,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0ECE2',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    shadowColor: '#285D35',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  list: {
    gap: 7,
  },
  farmerCard: {
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFECE1',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  selectedCard: {
    borderColor: '#5B9E65',
    backgroundColor: 'rgba(236,248,234,0.97)',
  },
  personAvatar: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F1DE',
    marginRight: 9,
  },
  personText: {
    flex: 1,
  },
  personName: {
    color: '#294C33',
    fontSize: 12,
    lineHeight: 16,
  },
  personId: {
    color: '#78897D',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 1,
  },
  selectedPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  landCard: {
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFECE1',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  landIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: '#EAF7E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  selectedLand: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229,244,223,0.95)',
    marginTop: 11,
  },
  selectedLandText: {
    flex: 1,
    marginLeft: 8,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  fieldLabel: {
    color: '#31563A',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
  textInput: {
    minHeight: 39,
    borderWidth: 1,
    borderColor: '#DCE9DE',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    color: '#28442F',
    fontSize: 12,
  },
  selectInput: {
    minHeight: 39,
    borderWidth: 1,
    borderColor: '#DCE9DE',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    flex: 1,
    color: '#28442F',
    fontSize: 12,
  },
  optionsList: {
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE9DE',
    marginTop: 4,
    overflow: 'hidden',
  },
  optionRow: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#36543D',
    fontSize: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 13,
  },
  qualityChip: {
    minHeight: 36,
    flex: 1,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE9DE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  qualityChipSelected: {
    backgroundColor: '#238044',
    borderColor: '#238044',
  },
  qualityText: {
    color: '#506A56',
    fontSize: 11,
  },
  qualityTextSelected: {
    color: '#FFFFFF',
  },
  remarksInput: {
    minHeight: 65,
    paddingTop: 9,
  },
  photoPlaceholder: {
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BFD7C2',
    borderRadius: 10,
    backgroundColor: '#F7FBF6',
    marginTop: 2,
  },
  photoText: {
    color: '#3D7048',
    fontSize: 11,
    marginTop: 3,
  },
  photoHint: {
    color: '#88958B',
    fontSize: 9,
    marginTop: 1,
  },
  reviewHint: {
    color: '#728276',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -5,
    marginBottom: 9,
  },
  reviewCard: {
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 43,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2ED',
    paddingVertical: 5,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#E9F5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: '#7B897E',
    fontSize: 9,
    lineHeight: 12,
  },
  infoValue: {
    color: '#36543D',
    fontSize: 11,
    lineHeight: 15,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#DCE9DE',
    marginVertical: 4,
  },
  resultBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  resultIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#38A64A',
    borderWidth: 6,
    borderColor: '#DBF1D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  resultTitle: {
    color: '#1D5731',
    fontSize: 21,
    lineHeight: 27,
    textAlign: 'center',
  },
  resultSubtitle: {
    color: '#637568',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  receiptCard: {
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  demoNote: {
    color: '#8A7650',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
  summaryCard: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  summaryLogo: {
    width: 64,
    height: 55,
    alignSelf: 'center',
    marginBottom: 2,
  },
  summaryHeading: {
    color: '#265335',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 5,
  },
  errorText: {
    color: '#B42318',
    fontSize: 11,
    paddingHorizontal: 18,
    paddingBottom: 5,
  },
  footer: {
    paddingHorizontal: 17,
    paddingTop: 9,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderTopWidth: 1,
    borderTopColor: '#E2ECE3',
  },
  primaryButton: {
    minHeight: 47,
    borderRadius: 11,
    backgroundColor: '#14743A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  homeButton: {
    minHeight: 43,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#B9DCC0',
    backgroundColor: '#F2FAF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  homeButtonText: {
    color: '#216837',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.87,
  },
});
