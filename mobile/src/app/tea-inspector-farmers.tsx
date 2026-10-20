import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
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
type DashboardTab = 'Home' | 'Farmers' | 'Visits' | 'Alerts' | 'Profile';
type Farmer = {
  name: string;
  id: string;
  village: string;
  lands: number;
  lastVisit: string;
  phone: string;
  landDetails: { name: string; size: string; area: string }[];
};

const farmers: Farmer[] = [
  {
    name: 'Nimal Perera',
    id: 'F001',
    village: 'Kandy',
    lands: 2,
    lastVisit: '25 Sep 2026',
    phone: '071 234 5678',
    landDetails: [
      { name: 'Land 001', size: '3.5 hectares', area: 'Kandy - Peradeniya' },
      { name: 'Land 002', size: '2.0 hectares', area: 'Kandy - Digana' },
    ],
  },
  {
    name: 'Sunil Silva',
    id: 'F002',
    village: 'Gampola',
    lands: 1,
    lastVisit: '22 Sep 2026',
    phone: '077 345 6789',
    landDetails: [{ name: 'Land 003', size: '2.4 hectares', area: 'Gampola' }],
  },
  {
    name: 'Kamal Fernando',
    id: 'F003',
    village: 'Matale',
    lands: 3,
    lastVisit: '20 Sep 2026',
    phone: '076 456 7890',
    landDetails: [{ name: 'Land 004', size: '4.0 hectares', area: 'Matale - Ukuwela' }],
  },
  {
    name: 'Wijesiri Perera',
    id: 'F004',
    village: 'Kandy',
    lands: 2,
    lastVisit: '18 Sep 2026',
    phone: '071 567 8901',
    landDetails: [{ name: 'Land 005', size: '2.8 hectares', area: 'Kandy - Digana' }],
  },
];

const agrochemicalRecords: {
  name: string;
  type: string;
  date: string;
  wait: string;
  amount: string;
  icon: IconName;
  tone: 'green' | 'amber';
}[] = [
  { name: 'Urea', type: 'Fertilizer', date: '15 Sep 2026', wait: 'No waiting period', amount: '50 kg', icon: 'leaf', tone: 'green' },
  { name: 'Chlorpyrifos', type: 'Pesticide', date: '05 Sep 2026', wait: '14 days (PHI)', amount: '10 L', icon: 'flask-outline', tone: 'amber' },
  { name: 'Mancozeb', type: 'Fungicide', date: '20 Aug 2026', wait: '7 days (PHI)', amount: '5 kg', icon: 'leaf', tone: 'green' },
];

const tabs: { label: DashboardTab; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Farmers', icon: 'account-group-outline' },
  { label: 'Visits', icon: 'calendar-month-outline' },
  { label: 'Alerts', icon: 'bell-outline' },
  { label: 'Profile', icon: 'account-outline' },
];

function SectionTitle({ icon, title }: { icon: IconName; title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <MaterialCommunityIcons name={icon} size={16} color="#087B56" />
      <ThemedText type="smallBold" style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );
}

function FarmerCard({ farmer, onPress }: { farmer: Farmer; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${farmer.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.farmerCard, pressed && styles.pressed]}>
      <View style={styles.farmerAvatar}>
        <MaterialCommunityIcons name="account" size={19} color="#16835B" />
      </View>
      <View style={styles.farmerCardContent}>
        <View style={styles.farmerCardHeading}>
          <View>
            <ThemedText type="smallBold" style={styles.farmerName}>{farmer.name}</ThemedText>
            <ThemedText type="small" style={styles.farmerId}>Farmer ID: {farmer.id}</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={17} color="#9BA9B9" />
        </View>
        <View style={styles.farmerLocationRow}>
          <MaterialCommunityIcons name="map-marker" size={12} color="#28A56E" />
          <ThemedText type="small" style={styles.farmerMeta}>{farmer.village}</ThemedText>
        </View>
        <View style={styles.farmerCardFooter}>
          <View style={styles.farmerFacts}>
            <View style={styles.farmerFact}>
              <MaterialCommunityIcons name="leaf" size={12} color="#16835B" />
              <ThemedText type="small" style={styles.farmerMeta}>
                {farmer.lands} tea land{farmer.lands === 1 ? '' : 's'}
              </ThemedText>
            </View>
            <View style={styles.farmerFact}>
              <MaterialCommunityIcons name="calendar-month-outline" size={12} color="#16835B" />
              <ThemedText type="small" style={styles.farmerMeta}>Last visit: {farmer.lastVisit}</ThemedText>
            </View>
          </View>
          <View style={styles.viewDetailsButton}>
            <ThemedText type="smallBold" style={styles.viewDetailsText}>View Details</ThemedText>
            <MaterialCommunityIcons name="arrow-right" size={12} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function FarmerDetails({ farmer, onRecordVisit }: { farmer: Farmer; onRecordVisit: () => void }) {
  return (
    <View style={styles.farmerDetailsContent}>
      <View style={styles.farmerSummaryCard}>
        <View style={styles.farmerAvatarLarge}>
          <MaterialCommunityIcons name="account" size={21} color="#16835B" />
        </View>
        <View style={styles.farmerSummaryCopy}>
          <ThemedText type="smallBold" style={styles.detailFarmerName}>{farmer.name}</ThemedText>
          <ThemedText type="small" style={styles.detailFarmerId}>Farmer ID: {farmer.id}</ThemedText>
          <View style={styles.detailInfoRow}>
            <MaterialCommunityIcons name="phone-outline" size={12} color="#718578" />
            <ThemedText type="small" style={styles.detailFarmerMeta}>{farmer.phone}</ThemedText>
          </View>
          <View style={styles.detailInfoRow}>
            <MaterialCommunityIcons name="map-marker" size={12} color="#718578" />
            <ThemedText type="small" style={styles.detailFarmerMeta}>{farmer.village}, Sri Lanka</ThemedText>
          </View>
          <ThemedText type="small" style={styles.detailFarmerMeta}>{farmer.lands} registered tea lands</ThemedText>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <SectionTitle icon="sprout" title="Tea Lands" />
        <View style={styles.detailCards}>
          {farmer.landDetails.map((land) => (
            <View key={land.name} style={styles.landCard}>
              <View style={styles.landIcon}>
                <MaterialCommunityIcons name="land-plots" size={17} color="#16835B" />
              </View>
              <View style={styles.landCopy}>
                <ThemedText type="smallBold" style={styles.detailCardTitle}>{land.name}</ThemedText>
                <ThemedText type="small" style={styles.detailCardMeta}>{land.size}</ThemedText>
                <View style={styles.landMetaRow}>
                  <View style={styles.sectorTag}>
                    <ThemedText type="smallBold" style={styles.sectorTagText}>Small Sector</ThemedText>
                  </View>
                  <ThemedText type="small" style={styles.detailCardMeta}>{land.area}</ThemedText>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={17} color="#A4B1B8" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.detailsSection}>
        <SectionTitle icon="flask-outline" title="Agrochemical Records" />
        <ThemedText type="small" style={styles.recordsSubtitle}>Recent applications and waiting periods</ThemedText>
        <View style={styles.detailCards}>
          {agrochemicalRecords.map((record) => (
            <View key={record.name} style={styles.chemicalCard}>
              <View style={[styles.chemicalIcon, record.tone === 'amber' && styles.chemicalIconAmber]}>
                <MaterialCommunityIcons
                  name={record.icon}
                  size={16}
                  color={record.tone === 'amber' ? '#D98718' : '#16835B'}
                />
              </View>
              <View style={styles.chemicalCopy}>
                <ThemedText type="smallBold" style={styles.detailCardTitle}>
                  {record.name} <ThemedText type="small" style={styles.chemicalType}>({record.type})</ThemedText>
                </ThemedText>
                <ThemedText type="small" style={styles.detailCardMeta}>{record.date}</ThemedText>
                <View style={styles.waitingPeriod}>
                  <MaterialCommunityIcons
                    name={record.tone === 'amber' ? 'clock-outline' : 'check-circle-outline'}
                    size={11}
                    color={record.tone === 'amber' ? '#D98718' : '#15945F'}
                  />
                  <ThemedText type="small" style={[styles.waitingPeriodText, record.tone === 'amber' && styles.waitingPeriodAmber]}>
                    {record.wait}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.chemicalAmount}>
                <ThemedText type="smallBold" style={styles.chemicalAmountText}>{record.amount}</ThemedText>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#A4B1B8" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.farmerDetailActions}>
        <Pressable accessibilityRole="button" style={styles.recordsButton}>
          <MaterialCommunityIcons name="file-document-outline" size={14} color="#087B56" />
          <ThemedText type="smallBold" style={styles.recordsButtonText}>View All Records</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onRecordVisit}
          style={({ pressed }) => [styles.recordVisitButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="plus-circle-outline" size={14} color="#FFFFFF" />
          <ThemedText type="smallBold" style={styles.recordVisitText}>Record Visit &amp; Advice</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export default function TeaInspectorFarmersScreen() {
  const { fullName, inspectorId, district, mobile, organization } = useLocalSearchParams<{
    fullName?: string;
    inspectorId?: string;
    district?: string;
    mobile?: string;
    organization?: string;
  }>();
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [showAreaOptions, setShowAreaOptions] = useState(false);

  const visibleFarmers = farmers.filter((farmer) => {
    const matchesSearch = `${farmer.name} ${farmer.id}`.toLowerCase().includes(farmerSearch.trim().toLowerCase());
    const matchesArea = selectedArea === 'All Areas' || farmer.village === selectedArea;
    return matchesSearch && matchesArea;
  });

  const navigateToDashboardTab = (tab: Exclude<DashboardTab, 'Farmers'>) => {
    if (tab === 'Visits') {
      router.replace({
        pathname: './tea-inspector-visits',
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
      pathname: '/tea-inspector-dashboard',
      params: { tab, fullName, inspectorId, district, mobile, organization },
    });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundWash} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
        {selectedFarmer ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to farmers"
            onPress={() => setSelectedFarmer(null)}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#344458" />
          </Pressable>
        ) : null}
        <View>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            {selectedFarmer ? 'Farmer Details' : 'Farmers'}
          </ThemedText>
          {!selectedFarmer ? (
            <ThemedText type="small" style={styles.headerSubtitle}>Farmers in your assigned area</ThemedText>
          ) : null}
        </View>
        <View style={styles.headerLeaves} pointerEvents="none">
          <MaterialCommunityIcons name="leaf" size={43} color="#70C99B" />
          <MaterialCommunityIcons name="leaf" size={30} color="#9BDAB7" style={styles.headerLeafSmall} />
        </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedFarmer ? (
          <FarmerDetails farmer={selectedFarmer} onRecordVisit={() => navigateToDashboardTab('Visits')} />
        ) : (
          <View style={styles.farmersContent}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={18} color="#7C8D91" />
              <TextInput
                accessibilityLabel="Search farmers"
                placeholder="Search by farmer name or ID"
                placeholderTextColor="#8A9999"
                value={farmerSearch}
                onChangeText={setFarmerSearch}
                style={styles.searchInput}
              />
              {farmerSearch ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setFarmerSearch('')}>
                  <MaterialCommunityIcons name="close-circle" size={17} color="#9BA9A9" />
                </Pressable>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter by area"
              accessibilityState={{ expanded: showAreaOptions }}
              onPress={() => setShowAreaOptions((current) => !current)}
              style={styles.areaFilter}>
              <MaterialCommunityIcons name="map-marker" size={15} color="#07815A" />
              <View style={styles.areaFilterCopy}>
                <ThemedText type="small" style={styles.areaFilterLabel}>Areas / Villages</ThemedText>
                <ThemedText type="smallBold" style={styles.areaFilterText}>{selectedArea}</ThemedText>
              </View>
              <MaterialCommunityIcons name={showAreaOptions ? 'chevron-up' : 'chevron-down'} size={17} color="#72857C" />
            </Pressable>
            {showAreaOptions ? (
              <View style={styles.areaOptions}>
                {['All Areas', 'Gampola', 'Kandy', 'Matale', 'Peradeniya'].map((area) => (
                  <Pressable
                    accessibilityRole="button"
                    key={area}
                    onPress={() => {
                      setSelectedArea(area);
                      setShowAreaOptions(false);
                    }}
                    style={styles.areaOption}>
                    <ThemedText type="small" style={[styles.areaFilterText, styles.areaOptionText, area === selectedArea && styles.areaOptionSelected]}>
                      {area}
                    </ThemedText>
                    {area === selectedArea ? <MaterialCommunityIcons name="check" size={15} color="#07815A" /> : null}
                  </Pressable>
                ))}
              </View>
            ) : null}
            <View style={styles.resultsHeader}>
              <View style={styles.resultsIcon}>
                <MaterialCommunityIcons name="account-group-outline" size={14} color="#07815A" />
              </View>
              <ThemedText type="smallBold" style={styles.resultsText}>
                {farmerSearch || selectedArea !== 'All Areas' ? `${visibleFarmers.length} farmers found` : '18 farmers found'}
              </ThemedText>
            </View>
            <View style={styles.farmerCards}>
              {visibleFarmers.length ? visibleFarmers.map((farmer) => (
                <FarmerCard key={farmer.id} farmer={farmer} onPress={() => setSelectedFarmer(farmer)} />
              )) : (
                <View style={styles.emptyFarmers}>
                  <MaterialCommunityIcons name="account-search-outline" size={28} color="#8BA39A" />
                  <ThemedText type="small" style={styles.emptyFarmersText}>No farmers match your search.</ThemedText>
                </View>
              )}
            </View>
          </View>
        )}
        </ScrollView>

        <View style={styles.bottomBar}>
        {tabs.map(({ label, icon }) => {
          const selected = label === 'Farmers';
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              key={label}
              onPress={() => {
                if (label === 'Farmers') {
                  setSelectedFarmer(null);
                } else {
                  navigateToDashboardTab(label);
                }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 57,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF0',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  backButton: {
    width: 30,
    height: 38,
    justifyContent: 'center',
    marginRight: 5,
  },
  headerTitle: {
    color: '#183A2D',
    fontSize: 15,
    lineHeight: 20,
  },
  headerSubtitle: {
    color: '#6A8978',
    fontSize: 9,
    lineHeight: 13,
  },
  headerLeaves: {
    position: 'absolute',
    right: 12,
    top: 8,
    opacity: 0.65,
    transform: [{ rotate: '-28deg' }],
  },
  headerLeafSmall: {
    position: 'absolute',
    right: 21,
    top: 16,
    transform: [{ rotate: '68deg' }],
  },
  scrollContent: {
    paddingBottom: 20,
  },
  farmersContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchBox: {
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4ECE8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    gap: 7,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: '#334A40',
    fontSize: 10,
    lineHeight: 15,
  },
  areaFilter: {
    minHeight: 40,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E5EEE9',
    backgroundColor: '#FAFCFB',
    marginTop: 7,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  areaFilterCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  areaFilterLabel: {
    color: '#789084',
    fontSize: 7,
    lineHeight: 10,
  },
  areaFilterText: {
    color: '#40584C',
    fontSize: 9,
    lineHeight: 14,
  },
  areaOptions: {
    borderWidth: 1,
    borderColor: '#E5EEE9',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    marginTop: 3,
    overflow: 'hidden',
  },
  areaOption: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },
  areaOptionText: {
    flex: 1,
  },
  areaOptionSelected: {
    color: '#087B56',
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    marginBottom: 6,
  },
  resultsIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E5F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsText: {
    color: '#43564D',
    fontSize: 9,
    lineHeight: 14,
  },
  farmerCards: {
    gap: 7,
  },
  farmerCard: {
    minHeight: 83,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E6EEE9',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 7,
  },
  farmerAvatar: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#DEF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  farmerCardContent: {
    flex: 1,
  },
  farmerCardHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 26,
  },
  farmerName: {
    color: '#2E3D4D',
    fontSize: 10,
    lineHeight: 13,
  },
  farmerId: {
    color: '#718096',
    fontSize: 8,
    lineHeight: 11,
  },
  farmerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: -1,
  },
  farmerMeta: {
    color: '#647987',
    fontSize: 8,
    lineHeight: 12,
  },
  farmerCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEF3F0',
    gap: 5,
  },
  farmerFacts: {
    gap: 1,
  },
  farmerFact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewDetailsButton: {
    minHeight: 22,
    borderRadius: 5,
    backgroundColor: '#087B56',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    gap: 4,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 8,
    lineHeight: 12,
  },
  emptyFarmers: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  emptyFarmersText: {
    color: '#718578',
    fontSize: 10,
  },
  farmerDetailsContent: {
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 12,
  },
  farmerSummaryCard: {
    minHeight: 90,
    borderRadius: 11,
    backgroundColor: '#F2FBF6',
    borderWidth: 1,
    borderColor: '#E0F1E7',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 9,
    gap: 8,
  },
  farmerAvatarLarge: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#DDF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmerSummaryCopy: {
    flex: 1,
    gap: 1,
  },
  detailFarmerName: {
    color: '#293A4B',
    fontSize: 11,
    lineHeight: 15,
  },
  detailFarmerId: {
    color: '#6E7F90',
    fontSize: 8,
    lineHeight: 11,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailFarmerMeta: {
    color: '#627686',
    fontSize: 8,
    lineHeight: 12,
  },
  detailsSection: {
    marginTop: 8,
  },
  sectionTitleRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: '#26374A',
    fontSize: 12,
    lineHeight: 17,
  },
  detailCards: {
    gap: 5,
    marginTop: 3,
  },
  landCard: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EEF0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 6,
  },
  landIcon: {
    width: 27,
    height: 27,
    borderRadius: 7,
    backgroundColor: '#E5F7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landCopy: {
    flex: 1,
    gap: 1,
  },
  detailCardTitle: {
    color: '#334455',
    fontSize: 9,
    lineHeight: 12,
  },
  detailCardMeta: {
    color: '#708191',
    fontSize: 8,
    lineHeight: 11,
  },
  landMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectorTag: {
    borderRadius: 8,
    backgroundColor: '#E7F8EF',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  sectorTagText: {
    color: '#178152',
    fontSize: 7,
    lineHeight: 10,
  },
  recordsSubtitle: {
    color: '#7B8C97',
    fontSize: 7,
    lineHeight: 10,
    marginLeft: 22,
    marginTop: -2,
  },
  chemicalCard: {
    minHeight: 53,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EEF0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    gap: 5,
  },
  chemicalIcon: {
    width: 25,
    height: 25,
    borderRadius: 7,
    backgroundColor: '#E6F7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chemicalIconAmber: {
    backgroundColor: '#FFF4DF',
  },
  chemicalCopy: {
    flex: 1,
    gap: 1,
  },
  chemicalType: {
    color: '#718191',
    fontSize: 7,
    lineHeight: 10,
  },
  waitingPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waitingPeriodText: {
    color: '#16845A',
    fontSize: 7,
    lineHeight: 10,
  },
  waitingPeriodAmber: {
    color: '#D98718',
  },
  chemicalAmount: {
    minWidth: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E7ECEF',
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  chemicalAmountText: {
    color: '#46596A',
    fontSize: 7,
    lineHeight: 10,
  },
  farmerDetailActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  recordsButton: {
    minHeight: 29,
    flex: 1,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#14825B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  recordsButtonText: {
    color: '#087B56',
    fontSize: 8,
    lineHeight: 12,
  },
  recordVisitButton: {
    minHeight: 29,
    flex: 1.15,
    borderRadius: 7,
    backgroundColor: '#087B56',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  recordVisitText: {
    color: '#FFFFFF',
    fontSize: 8,
    lineHeight: 12,
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
