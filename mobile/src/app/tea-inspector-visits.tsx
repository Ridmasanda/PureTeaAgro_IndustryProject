import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
type Screen = 'visits' | 'record' | 'history' | 'details';
type VisitStatus = 'Active' | 'Upcoming' | 'Completed' | 'Follow-up Required';
type Visit = {
  id: string;
  name: string;
  farmerId: string;
  land: string;
  area: string;
  date: string;
  category: string;
  advice: string;
  status: VisitStatus;
  followUpDate: string;
};
type DashboardTab = 'Home' | 'Farmers' | 'Visits' | 'Alerts' | 'Profile';

const initialVisits: Visit[] = [
  {
    id: 'VST-00125',
    name: 'Nimal Perera',
    farmerId: 'F001',
    land: 'Land 001',
    area: 'Kandy - Peradeniya',
    date: '02 Oct 2026',
    category: 'Fertilizer Use',
    advice: 'Use recommended fertilizer in garden area. Avoid over-application.',
    status: 'Completed',
    followUpDate: '16 Oct 2026',
  },
  {
    id: 'VST-00124',
    name: 'Sunil Silva',
    farmerId: 'F002',
    land: 'Land 002',
    area: 'Gampola',
    date: '28 Sep 2026',
    category: 'Chemical Application',
    advice: 'Observe the waiting period before harvesting.',
    status: 'Follow-up Required',
    followUpDate: '12 Oct 2026',
  },
  {
    id: 'VST-00123',
    name: 'Kamal Fernando',
    farmerId: 'F003',
    land: 'Land 003',
    area: 'Matale - Ukuwela',
    date: '25 Sep 2026',
    category: 'Pest Management',
    advice: 'Continue monitoring the affected tea plants.',
    status: 'Completed',
    followUpDate: '09 Oct 2026',
  },
  {
    id: 'VST-00122',
    name: 'Wijesiri Perera',
    farmerId: 'F004',
    land: 'Land 004',
    area: 'Kandy - Digana',
    date: '23 Sep 2026',
    category: 'Plant Health',
    advice: 'Improve drainage around the tea bushes.',
    status: 'Upcoming',
    followUpDate: '07 Oct 2026',
  },
];

const farmers = [
  { name: 'Nimal Perera', id: 'F001', land: 'Land 001', area: 'Kandy - Peradeniya' },
  { name: 'Sunil Silva', id: 'F002', land: 'Land 002', area: 'Gampola' },
  { name: 'Kamal Fernando', id: 'F003', land: 'Land 003', area: 'Matale - Ukuwela' },
  { name: 'Wijesiri Perera', id: 'F004', land: 'Land 004', area: 'Kandy - Digana' },
];

const statuses: ('All Visits' | VisitStatus)[] = [
  'All Visits',
  'Upcoming',
  'Completed',
  'Follow-up Required',
];

const adviceCategories: { label: string; icon: IconName }[] = [
  { label: 'Fertilizer Use', icon: 'leaf' },
  { label: 'Safe Chemical Application', icon: 'flask-outline' },
  { label: 'PHI Harvest Waiting Period', icon: 'calendar-clock-outline' },
  { label: 'Pest Management', icon: 'bug-outline' },
  { label: 'Other', icon: 'dots-horizontal' },
];

const tabs: { label: DashboardTab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Farmers', icon: 'account-group-outline' },
  { label: 'Visits', icon: 'calendar-month-outline' },
  { label: 'Alerts', icon: 'bell-outline' },
  { label: 'Profile', icon: 'account-outline' },
];

function statusStyle(status: VisitStatus) {
  if (status === 'Completed') return styles.statusCompleted;
  if (status === 'Follow-up Required') return styles.statusFollowUp;
  if (status === 'Upcoming') return styles.statusUpcoming;
  return styles.statusActive;
}

function StatusBadge({ status }: { status: VisitStatus }) {
  return (
    <View style={[styles.statusBadge, statusStyle(status)]}>
      <ThemedText type="smallBold" style={[styles.statusText, status === 'Follow-up Required' && styles.statusTextFollowUp]}>
        {status}
      </ThemedText>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: IconName; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <MaterialCommunityIcons name={icon} size={14} color="#087B56" />
      <ThemedText type="smallBold" style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );
}

function VisitHistoryCard({
  visit,
  onPress,
  compact = false,
}: {
  visit: Visit;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View visit for ${visit.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.visitCard, compact && styles.visitCardCompact, pressed && styles.pressed]}>
      <View style={styles.visitAvatar}>
        <MaterialCommunityIcons name="account" size={17} color="#138456" />
      </View>
      <View style={styles.visitCardCopy}>
        <View style={styles.visitCardHeading}>
          <ThemedText type="smallBold" style={styles.visitFarmerName}>{visit.name}</ThemedText>
          <StatusBadge status={visit.status} />
        </View>
        <ThemedText type="small" style={styles.visitLandText}>{visit.date} • {visit.land}</ThemedText>
        <View style={styles.visitMetaRow}>
          <MaterialCommunityIcons name="map-marker" size={11} color="#22885F" />
          <ThemedText type="small" style={styles.visitAreaText}>{visit.area}</ThemedText>
        </View>
        {!compact ? (
          <View style={styles.visitCardFooter}>
            <View style={styles.visitCategoryRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={11} color="#168458" />
              <ThemedText type="small" style={styles.visitCategoryText}>{visit.category}</ThemedText>
            </View>
            <View style={styles.viewVisitButton}>
              <ThemedText type="smallBold" style={styles.viewVisitText}>View Details</ThemedText>
              <MaterialCommunityIcons name="arrow-right" size={11} color="#FFFFFF" />
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function ActionButton({
  icon,
  label,
  primary,
  onPress,
}: {
  icon: IconName;
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.actionButtonPrimary : styles.actionButtonSecondary,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.actionIcon, primary && styles.actionIconPrimary]}>
        <MaterialCommunityIcons name={icon} size={15} color={primary ? '#FFFFFF' : '#087B56'} />
      </View>
      <ThemedText type="smallBold" style={[styles.actionLabel, primary && styles.actionLabelPrimary]}>{label}</ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={16} color={primary ? '#D7F3E2' : '#6A8878'} />
    </Pressable>
  );
}

export default function TeaInspectorVisitsScreen() {
  const { fullName, inspectorId, district, mobile, organization } = useLocalSearchParams<{
    fullName?: string;
    inspectorId?: string;
    district?: string;
    mobile?: string;
    organization?: string;
  }>();
  const [screen, setScreen] = useState<Screen>('visits');
  const [visits, setVisits] = useState(initialVisits);
  const [selectedVisit, setSelectedVisit] = useState<Visit>(initialVisits[0]);
  const [selectedStatus, setSelectedStatus] = useState<(typeof statuses)[number]>('All Visits');
  const [search, setSearch] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedLand, setSelectedLand] = useState('');
  const [visitDate, setVisitDate] = useState('02 Oct 2026');
  const [selectedCategory, setSelectedCategory] = useState('Fertilizer Use');
  const [advice, setAdvice] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(true);
  const [showFarmerOptions, setShowFarmerOptions] = useState(false);
  const [showLandOptions, setShowLandOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const visibleVisits = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return visits.filter((visit) => {
      const matchesSearch = `${visit.name} ${visit.farmerId} ${visit.land}`.toLowerCase().includes(normalizedSearch);
      const matchesStatus = selectedStatus === 'All Visits' || visit.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus, visits]);

  const navigateToDashboard = (tab: Exclude<DashboardTab, 'Visits'>) => {
    if (tab === 'Farmers') {
      router.replace({
        pathname: './tea-inspector-farmers',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    if (tab === 'Alerts') {
      router.replace({
        pathname: './tea-inspector-alerts',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    if (tab === 'Profile') {
      router.replace({
        pathname: './tea-inspector-profile',
        params: { fullName, inspectorId, district, mobile, organization },
      });
      return;
    }
    router.replace({
      pathname: './tea-inspector-dashboard',
      params: { tab, fullName, inspectorId, district, mobile, organization },
    });
  };

  const beginNewVisit = () => {
    setSelectedFarmer('');
    setSelectedLand('');
    setVisitDate('02 Oct 2026');
    setSelectedCategory('Fertilizer Use');
    setAdvice('');
    setFollowUpRequired(true);
    setScreen('record');
  };

  const saveVisit = () => {
    if (!selectedFarmer) return;
    const farmer = farmers.find((item) => item.id === selectedFarmer);
    if (!farmer) return;
    const newVisit: Visit = {
      id: `VST-${String(126 + visits.length - initialVisits.length).padStart(5, '0')}`,
      name: farmer.name,
      farmerId: farmer.id,
      land: selectedLand || farmer.land,
      area: farmer.area,
      date: visitDate,
      category: selectedCategory,
      advice: advice.trim() || 'Advice recorded during field visit.',
      status: followUpRequired ? 'Follow-up Required' : 'Completed',
      followUpDate: '16 Oct 2026',
    };
    setVisits((current) => [newVisit, ...current]);
    setSelectedVisit(newVisit);
    setScreen('history');
  };

  const openVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setScreen('details');
  };

  const resetToVisits = () => {
    setScreen('visits');
    setSelectedStatus('All Visits');
    setSearch('');
  };

  const screenTitle =
    screen === 'history' ? 'Visit History' : screen === 'details' ? 'Visit Details' : 'Visits';
  const showBack = screen !== 'visits';

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.background}>
      <View pointerEvents="none" style={styles.backgroundWash} />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => setScreen(screen === 'details' ? 'history' : 'visits')}
            style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#243649" />
          </Pressable>
        ) : null}
        <View style={styles.headerTitleWrap}>
          <ThemedText type="smallBold" style={styles.headerTitle}>{screenTitle}</ThemedText>
          {screen === 'visits' ? (
            <ThemedText type="small" style={styles.headerSubtitle}>Guide farmers and record your visits</ThemedText>
          ) : null}
        </View>
        {screen === 'record' ? (
          <Pressable accessibilityRole="button" onPress={saveVisit} style={styles.saveHeaderButton}>
            <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />
            <ThemedText type="smallBold" style={styles.saveHeaderText}>Save</ThemedText>
          </Pressable>
        ) : (
          <View style={styles.headerLogo}>
            <MaterialCommunityIcons name="leaf" size={13} color="#07815A" />
            <ThemedText type="smallBold" style={styles.headerLogoText}>PureTeaAgro</ThemedText>
          </View>
        )}
        </View>

        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {screen === 'visits' ? (
          <View style={styles.homeContent}>
            <ActionButton
              icon="calendar-plus"
              label="Record New Visit"
              primary
              onPress={beginNewVisit}
            />
            <ActionButton
              icon="clipboard-list-outline"
              label="View Visit History"
              onPress={() => setScreen('history')}
            />

            <View style={styles.sectionHeading}>
              <SectionTitle icon="account-clock-outline" title="Follow-ups Due" />
              <Pressable accessibilityRole="button" onPress={() => { setSelectedStatus('Follow-up Required'); setScreen('history'); }}>
                <ThemedText type="smallBold" style={styles.viewAllText}>View All</ThemedText>
              </Pressable>
            </View>
            <View style={styles.cardsList}>
              {visits.filter((visit) => visit.status === 'Follow-up Required').slice(0, 2).map((visit) => (
                <VisitHistoryCard
                  key={visit.id}
                  visit={visit}
                  compact
                  onPress={() => openVisit(visit)}
                />
              ))}
            </View>

            <View style={styles.sectionHeading}>
              <SectionTitle icon="clipboard-text-clock-outline" title="Recent Visits" />
            </View>
            <View style={styles.statusFilters}>
              {statuses.map((status) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedStatus === status }}
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={[styles.statusFilter, selectedStatus === status && styles.statusFilterSelected]}>
                  <ThemedText type="smallBold" style={[styles.statusFilterText, selectedStatus === status && styles.statusFilterTextSelected]}>
                    {status === 'All Visits' ? 'All Visits' : status === 'Follow-up Required' ? 'Follow-up' : status}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <View style={styles.cardsList}>
              {visibleVisits.slice(0, 5).map((visit) => (
                <VisitHistoryCard key={visit.id} visit={visit} onPress={() => openVisit(visit)} />
              ))}
            </View>
          </View>
        ) : null}

        {screen === 'record' ? (
          <View style={styles.formContent}>
            <FormSelect
              icon="account"
              label="FARMER"
              placeholder="Search by name or ID"
              value={selectedFarmer ? farmers.find((farmer) => farmer.id === selectedFarmer)?.name ?? '' : ''}
              expanded={showFarmerOptions}
              onPress={() => setShowFarmerOptions((current) => !current)}
            />
            {showFarmerOptions ? (
              <View style={styles.optionList}>
                {farmers.map((farmer) => (
                  <Pressable
                    accessibilityRole="button"
                    key={farmer.id}
                    onPress={() => {
                      setSelectedFarmer(farmer.id);
                      setSelectedLand(farmer.land);
                      setShowFarmerOptions(false);
                    }}
                    style={styles.selectOption}>
                    <ThemedText type="smallBold" style={styles.selectOptionTitle}>{farmer.name}</ThemedText>
                    <ThemedText type="small" style={styles.selectOptionMeta}>{farmer.id} • {farmer.area}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <FormSelect
              icon="sprout"
              label="TEA LAND"
              placeholder="Select tea land"
              value={selectedLand}
              expanded={showLandOptions}
              onPress={() => setShowLandOptions((current) => !current)}
            />
            {showLandOptions ? (
              <View style={styles.optionList}>
                {(selectedFarmer ? farmers.filter((farmer) => farmer.id === selectedFarmer) : farmers).map((farmer) => (
                  <Pressable
                    accessibilityRole="button"
                    key={farmer.land}
                    onPress={() => {
                      setSelectedLand(farmer.land);
                      if (!selectedFarmer) setSelectedFarmer(farmer.id);
                      setShowLandOptions(false);
                    }}
                    style={styles.selectOption}>
                    <ThemedText type="smallBold" style={styles.selectOptionTitle}>{farmer.land}</ThemedText>
                    <ThemedText type="small" style={styles.selectOptionMeta}>{farmer.area}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <View style={styles.dateField}>
              <View style={styles.formFieldLabel}>
                <MaterialCommunityIcons name="calendar-month-outline" size={13} color="#138454" />
                <ThemedText type="smallBold" style={styles.formLabel}>VISIT DATE</ThemedText>
              </View>
              <TextInput
                accessibilityLabel="Visit date"
                value={visitDate}
                onChangeText={setVisitDate}
                placeholder="DD MMM YYYY"
                style={styles.dateInput}
              />
            </View>

            <View style={styles.categorySection}>
              <ThemedText type="smallBold" style={styles.formLabel}>ADVICE CATEGORY</ThemedText>
              <View style={styles.categoryGrid}>
                {adviceCategories.map((category) => {
                  const selected = selectedCategory === category.label;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={category.label}
                      onPress={() => setSelectedCategory(category.label)}
                      style={[styles.categoryCard, selected && styles.categoryCardSelected]}>
                      <MaterialCommunityIcons name={category.icon} size={16} color={selected ? '#087B56' : '#3884A0'} />
                      <ThemedText type="smallBold" style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                        {category.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.adviceSection}>
              <ThemedText type="smallBold" style={styles.formLabel}>ADVICE PROVIDED</ThemedText>
              <TextInput
                accessibilityLabel="Advice provided"
                multiline
                numberOfLines={4}
                placeholder="Write the advice given to the farmer..."
                placeholderTextColor="#899995"
                textAlignVertical="top"
                value={advice}
                onChangeText={setAdvice}
                style={styles.adviceInput}
              />
            </View>

            <View style={styles.followUpSection}>
              <ThemedText type="smallBold" style={styles.formLabel}>FOLLOW-UP REQUIRED?</ThemedText>
              <View style={styles.followUpButtons}>
                {[true, false].map((required) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: followUpRequired === required }}
                    key={String(required)}
                    onPress={() => setFollowUpRequired(required)}
                    style={[styles.followUpButton, followUpRequired === required && styles.followUpButtonSelected]}>
                    <ThemedText type="smallBold" style={[styles.followUpButtonText, followUpRequired === required && styles.followUpButtonTextSelected]}>
                      {required ? 'Yes' : 'No'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formActions}>
              <Pressable accessibilityRole="button" onPress={resetToVisits} style={styles.cancelButton}>
                <ThemedText type="smallBold" style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!selectedFarmer}
                onPress={saveVisit}
                style={({ pressed }) => [styles.saveVisitButton, !selectedFarmer && styles.disabledButton, pressed && styles.pressed]}>
                <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                <ThemedText type="smallBold" style={styles.saveVisitText}>Save Visit</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : null}

        {screen === 'history' ? (
          <View style={styles.historyContent}>
            <View style={styles.historySearchRow}>
              <View style={styles.historySearch}>
                <MaterialCommunityIcons name="magnify" size={16} color="#82908E" />
                <TextInput
                  accessibilityLabel="Search visit history"
                  placeholder="Search by farmer name or ID"
                  placeholderTextColor="#84918F"
                  value={search}
                  onChangeText={setSearch}
                  style={styles.historySearchInput}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle visit filters"
                onPress={() => setShowFilters((current) => !current)}
                style={styles.filterButton}>
                <MaterialCommunityIcons name="tune-variant" size={16} color="#168256" />
              </Pressable>
            </View>
            {showFilters ? (
              <View style={styles.historyFilterPanel}>
                <ThemedText type="smallBold" style={styles.formLabel}>FILTER BY STATUS</ThemedText>
                <View style={styles.statusFilters}>
                  {statuses.map((status) => (
                    <Pressable
                      accessibilityRole="button"
                      key={status}
                      onPress={() => setSelectedStatus(status)}
                      style={[styles.statusFilter, selectedStatus === status && styles.statusFilterSelected]}>
                      <ThemedText type="smallBold" style={[styles.statusFilterText, selectedStatus === status && styles.statusFilterTextSelected]}>
                        {status === 'All Visits' ? 'All' : status === 'Follow-up Required' ? 'Follow-up' : status}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            <Pressable accessibilityRole="button" onPress={() => setShowFilters((current) => !current)} style={styles.dateRange}>
              <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#168256" />
              <ThemedText type="small" style={styles.dateRangeText}>Select Date Range</ThemedText>
              <MaterialCommunityIcons name="chevron-down" size={15} color="#74857F" />
            </Pressable>
            <View style={styles.statusFilters}>
              {statuses.map((status) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedStatus === status }}
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={[styles.statusFilter, selectedStatus === status && styles.statusFilterSelected]}>
                  <ThemedText type="smallBold" style={[styles.statusFilterText, selectedStatus === status && styles.statusFilterTextSelected]}>
                    {status === 'All Visits' ? 'All' : status === 'Follow-up Required' ? 'Follow-up' : status}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <View style={styles.cardsList}>
              {visibleVisits.map((visit) => (
                <VisitHistoryCard key={visit.id} visit={visit} onPress={() => openVisit(visit)} />
              ))}
              {!visibleVisits.length ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="clipboard-search-outline" size={28} color="#83A194" />
                  <ThemedText type="small" style={styles.emptyStateText}>No visits match your search.</ThemedText>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        {screen === 'details' ? (
          <View style={styles.detailsContent}>
            <View style={styles.visitIdRow}>
              <ThemedText type="smallBold" style={styles.visitIdText}>{selectedVisit.id}</ThemedText>
              <StatusBadge status={selectedVisit.status} />
            </View>
            <View style={styles.detailFarmerCard}>
              <View style={styles.detailAvatar}>
                <MaterialCommunityIcons name="account" size={19} color="#168458" />
              </View>
              <View style={styles.detailFarmerCopy}>
                <ThemedText type="smallBold" style={styles.detailFarmerName}>{selectedVisit.name}</ThemedText>
                <ThemedText type="small" style={styles.detailMeta}>Farmer ID: {selectedVisit.farmerId} • {selectedVisit.land}</ThemedText>
                <View style={styles.visitMetaRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="#22885F" />
                  <ThemedText type="small" style={styles.detailMeta}>{selectedVisit.area}</ThemedText>
                </View>
              </View>
            </View>

            <DetailRow icon="calendar-month-outline" label="Visit Date" value={selectedVisit.date} />
            <DetailRow icon="sprout" label="Advice Category" value={selectedVisit.category} />
            <DetailRow icon="text-box-check-outline" label="Advice Provided" value={selectedVisit.advice} />
            <DetailRow
              icon="calendar-alert"
              label="Follow-up Required"
              value={selectedVisit.status === 'Follow-up Required' ? 'Yes' : 'No'}
              trailing={`${selectedVisit.followUpDate}`}
            />
            <View style={styles.recordStatusRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={14} color="#168458" />
              <ThemedText type="small" style={styles.recordStatusLabel}>Record Status</ThemedText>
              <View style={styles.submittedBadge}>
                <ThemedText type="smallBold" style={styles.submittedText}>Submitted</ThemedText>
              </View>
            </View>
            <View style={styles.reminderCard}>
              <View style={styles.reminderIcon}>
                <MaterialCommunityIcons name="bell-outline" size={15} color="#168458" />
              </View>
              <View style={styles.reminderCopy}>
                <ThemedText type="smallBold" style={styles.reminderTitle}>Follow-up reminder</ThemedText>
                <ThemedText type="small" style={styles.reminderDate}>Next visit scheduled for {selectedVisit.followUpDate}</ThemedText>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: './tea-inspector-farmers', params: { fullName, inspectorId, district, mobile, organization } })}
              style={styles.viewFarmerButton}>
              <MaterialCommunityIcons name="account-outline" size={13} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.viewFarmerText}>View Farmer Details</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSelectedFarmer(selectedVisit.farmerId);
                setSelectedLand(selectedVisit.land);
                setVisitDate(selectedVisit.date);
                setSelectedCategory(selectedVisit.category);
                setAdvice(selectedVisit.advice);
                setFollowUpRequired(selectedVisit.status === 'Follow-up Required');
                setScreen('record');
              }}
              style={styles.editVisitButton}>
              <MaterialCommunityIcons name="pencil-outline" size={13} color="#4F675C" />
              <ThemedText type="smallBold" style={styles.editVisitText}>Edit Visit</ThemedText>
            </Pressable>
          </View>
        ) : null}
        </ScrollView>

        <View style={styles.bottomBar}>
        {tabs.map(({ label, icon }) => {
          const selected = label === 'Visits';
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              key={label}
              onPress={() => {
                if (selected) resetToVisits();
                else navigateToDashboard(label);
              }}
              style={styles.tabButton}>
              <View>
                <MaterialCommunityIcons name={icon} size={20} color={selected ? '#07815A' : '#9BA9B9'} />
                {label === 'Alerts' ? <View style={styles.tabNotificationDot} /> : null}
              </View>
              <ThemedText type="small" style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                {label}
              </ThemedText>
              {selected ? <View style={styles.activeTabIndicator} /> : null}
            </Pressable>
          );
        })}
        </View>
        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </ImageBackground>
  );
}

function FormSelect({
  icon,
  label,
  placeholder,
  value,
  expanded,
  onPress,
}: {
  icon: IconName;
  label: string;
  placeholder: string;
  value: string;
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={onPress}
      style={styles.formSelect}>
      <View style={styles.formSelectTop}>
        <MaterialCommunityIcons name={icon} size={13} color="#168458" />
        <ThemedText type="smallBold" style={styles.formLabel}>{label}</ThemedText>
      </View>
      <View style={styles.formSelectValue}>
        <ThemedText type="small" style={[styles.formPlaceholder, value && styles.formValue]}>{value || placeholder}</ThemedText>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#7A8A85" />
      </View>
    </Pressable>
  );
}

function DetailRow({
  icon,
  label,
  value,
  trailing,
}: {
  icon: IconName;
  label: string;
  value: string;
  trailing?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailRowHeading}>
        <MaterialCommunityIcons name={icon} size={13} color="#168458" />
        <ThemedText type="small" style={styles.detailRowLabel}>{label}</ThemedText>
      </View>
      <View style={styles.detailRowValues}>
        <ThemedText type="smallBold" style={styles.detailRowValue}>{value}</ThemedText>
        {trailing ? <ThemedText type="small" style={styles.detailRowTrailing}>{trailing}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.46)',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF0',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 5,
  },
  backButton: {
    width: 25,
    height: 36,
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    color: '#1F352B',
    fontSize: 14,
    lineHeight: 19,
  },
  headerSubtitle: {
    color: '#688273',
    fontSize: 8,
    lineHeight: 11,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  headerLogoText: {
    color: '#168458',
    fontSize: 8,
  },
  saveHeaderButton: {
    minHeight: 24,
    borderRadius: 7,
    backgroundColor: '#087B56',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 3,
  },
  saveHeaderText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  homeContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  actionButton: {
    minHeight: 38,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 7,
    marginBottom: 7,
  },
  actionButtonPrimary: {
    backgroundColor: '#07804D',
  },
  actionButtonSecondary: {
    backgroundColor: '#E9F7EF',
    borderWidth: 1,
    borderColor: '#D3EDDE',
  },
  actionIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#D4F0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.17)',
  },
  actionLabel: {
    flex: 1,
    color: '#1A6244',
    fontSize: 9,
  },
  actionLabelPrimary: {
    color: '#FFFFFF',
  },
  sectionHeading: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
    marginBottom: 4,
  },
  sectionTitleRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitle: {
    color: '#2D3D4E',
    fontSize: 10,
    lineHeight: 14,
  },
  viewAllText: {
    color: '#087B56',
    fontSize: 8,
  },
  cardsList: {
    gap: 6,
  },
  visitCard: {
    minHeight: 69,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E5EDE8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 7,
    gap: 6,
  },
  visitCardCompact: {
    minHeight: 46,
    paddingVertical: 6,
  },
  visitAvatar: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#DFF4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitCardCopy: {
    flex: 1,
    gap: 2,
  },
  visitCardHeading: {
    minHeight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  visitFarmerName: {
    color: '#283949',
    fontSize: 9,
    lineHeight: 12,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#E0F5E9',
  },
  statusCompleted: {
    backgroundColor: '#DFF5E8',
  },
  statusFollowUp: {
    backgroundColor: '#FFF1D8',
  },
  statusUpcoming: {
    backgroundColor: '#EAF1FB',
  },
  statusActive: {
    backgroundColor: '#E1F5E8',
  },
  statusText: {
    color: '#168454',
    fontSize: 7,
    lineHeight: 9,
  },
  statusTextFollowUp: {
    color: '#C77A15',
  },
  visitLandText: {
    color: '#73828E',
    fontSize: 7,
    lineHeight: 10,
  },
  visitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  visitAreaText: {
    color: '#63796D',
    fontSize: 7,
    lineHeight: 10,
  },
  visitCardFooter: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visitCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  visitCategoryText: {
    color: '#73828E',
    fontSize: 7,
    lineHeight: 10,
  },
  viewVisitButton: {
    minHeight: 18,
    borderRadius: 5,
    backgroundColor: '#087B56',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 3,
  },
  viewVisitText: {
    color: '#FFFFFF',
    fontSize: 7,
    lineHeight: 10,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  statusFilter: {
    minHeight: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2EAE5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusFilterSelected: {
    backgroundColor: '#087B56',
    borderColor: '#087B56',
  },
  statusFilterText: {
    color: '#60756A',
    fontSize: 7,
    lineHeight: 10,
  },
  statusFilterTextSelected: {
    color: '#FFFFFF',
  },
  formContent: {
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 7,
  },
  formSelect: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E4ECE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  formSelectTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  formLabel: {
    color: '#687A72',
    fontSize: 7,
    lineHeight: 10,
    letterSpacing: 0.4,
  },
  formSelectValue: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formPlaceholder: {
    color: '#9AA6A2',
    fontSize: 8,
    lineHeight: 11,
  },
  formValue: {
    color: '#3A5146',
  },
  optionList: {
    marginTop: -5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2EAE5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EE',
  },
  selectOptionTitle: {
    color: '#34473D',
    fontSize: 8,
    lineHeight: 11,
  },
  selectOptionMeta: {
    color: '#7A8982',
    fontSize: 7,
    lineHeight: 10,
  },
  dateField: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E4ECE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  formFieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateInput: {
    height: 23,
    paddingVertical: 0,
    color: '#344A3F',
    fontSize: 8,
  },
  categorySection: {
    gap: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  categoryCard: {
    width: '31.8%',
    minHeight: 39,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E4EBE8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    gap: 2,
  },
  categoryCardSelected: {
    borderColor: '#0A9870',
    backgroundColor: '#E6F8EF',
  },
  categoryText: {
    color: '#5F747D',
    textAlign: 'center',
    fontSize: 6,
    lineHeight: 8,
  },
  categoryTextSelected: {
    color: '#087B56',
  },
  adviceSection: {
    gap: 4,
  },
  adviceInput: {
    minHeight: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE8E3',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 7,
    color: '#3A5146',
    fontSize: 8,
    lineHeight: 12,
  },
  followUpSection: {
    gap: 4,
  },
  followUpButtons: {
    flexDirection: 'row',
    gap: 7,
  },
  followUpButton: {
    flex: 1,
    minHeight: 27,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E1E9E4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followUpButtonSelected: {
    borderColor: '#087B56',
    backgroundColor: '#087B56',
  },
  followUpButtonText: {
    color: '#64766D',
    fontSize: 8,
  },
  followUpButtonTextSelected: {
    color: '#FFFFFF',
  },
  formActions: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 1,
  },
  cancelButton: {
    flex: 1,
    minHeight: 30,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#DDE6E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#5B7165',
    fontSize: 8,
  },
  saveVisitButton: {
    flex: 1,
    minHeight: 30,
    borderRadius: 7,
    backgroundColor: '#087B56',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  disabledButton: {
    opacity: 0.45,
  },
  saveVisitText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  historyContent: {
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 10,
  },
  historySearchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  historySearch: {
    height: 32,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4ECE7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 5,
  },
  historySearchInput: {
    flex: 1,
    paddingVertical: 0,
    color: '#344A3F',
    fontSize: 8,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9E8DE',
    backgroundColor: '#EFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyFilterPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4ECE7',
    backgroundColor: '#FAFCFA',
    marginTop: 6,
    padding: 7,
  },
  dateRange: {
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4ECE7',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 5,
  },
  dateRangeText: {
    flex: 1,
    color: '#52685D',
    fontSize: 8,
  },
  emptyState: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyStateText: {
    color: '#73867C',
    fontSize: 9,
  },
  detailsContent: {
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 12,
  },
  visitIdRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  visitIdText: {
    color: '#4C6256',
    fontSize: 8,
  },
  detailFarmerCard: {
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: '#F0FAF4',
    borderWidth: 1,
    borderColor: '#E1F1E7',
    padding: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  detailAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#DDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailFarmerCopy: {
    flex: 1,
    gap: 1,
  },
  detailFarmerName: {
    color: '#293A4B',
    fontSize: 9,
    lineHeight: 12,
  },
  detailMeta: {
    color: '#70808C',
    fontSize: 7,
    lineHeight: 10,
  },
  detailRow: {
    minHeight: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EF',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
  },
  detailRowHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailRowLabel: {
    color: '#687A72',
    fontSize: 7,
  },
  detailRowValues: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  detailRowValue: {
    color: '#3A4C44',
    fontSize: 7,
    textAlign: 'right',
  },
  detailRowTrailing: {
    color: '#819088',
    fontSize: 6,
  },
  recordStatusRow: {
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  recordStatusLabel: {
    flex: 1,
    color: '#63766B',
    fontSize: 7,
  },
  submittedBadge: {
    borderRadius: 7,
    backgroundColor: '#E1F5E8',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  submittedText: {
    color: '#148154',
    fontSize: 6,
  },
  reminderCard: {
    minHeight: 39,
    borderRadius: 8,
    backgroundColor: '#EFF9F1',
    borderWidth: 1,
    borderColor: '#DDEEE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    gap: 6,
    marginTop: 5,
    marginBottom: 7,
  },
  reminderIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#DDF3E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderCopy: {
    flex: 1,
    gap: 1,
  },
  reminderTitle: {
    color: '#305242',
    fontSize: 8,
  },
  reminderDate: {
    color: '#6B8374',
    fontSize: 7,
    lineHeight: 10,
  },
  viewFarmerButton: {
    minHeight: 29,
    borderRadius: 7,
    backgroundColor: '#087B56',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 5,
  },
  viewFarmerText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  editVisitButton: {
    minHeight: 27,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E0E8E3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  editVisitText: {
    color: '#50685B',
    fontSize: 8,
  },
  bottomBar: {
    minHeight: 55,
    paddingHorizontal: 7,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#E8EDF0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    position: 'relative',
  },
  tabLabel: {
    color: '#9BA9B9',
    fontSize: 8,
    lineHeight: 12,
  },
  tabLabelSelected: {
    color: '#07815A',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -3,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#07815A',
  },
  tabNotificationDot: {
    position: 'absolute',
    right: -2,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E94552',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 92,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A6ABB3',
    marginTop: 4,
    marginBottom: 5,
  },
  pressed: {
    opacity: 0.82,
  },
});
