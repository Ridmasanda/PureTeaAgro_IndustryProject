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

type Collection = {
  farmer: string;
  id: string;
  land: string;
  weight: string;
  quality: 'Good' | 'Average';
  time: string;
  iconColor: string;
};

const collections: Collection[] = [
  { farmer: 'Nimal Perera', id: 'F001', land: 'TL-001', weight: '245 kg', quality: 'Good', time: '10:30 AM', iconColor: '#238849' },
  { farmer: 'Sunil Silva', id: 'F002', land: 'TL-003', weight: '180 kg', quality: 'Average', time: '11:15 AM', iconColor: '#238849' },
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

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${collection.farmer}, ${collection.weight}, ${collection.quality}`} style={styles.collectionCard}>
      <View style={styles.collectionHeader}>
        <View style={styles.farmerAvatar}>
          <MaterialCommunityIcons name="account" size={24} color="#156B42" />
        </View>
        <View style={styles.farmerCopy}>
          <ThemedText type="smallBold" style={styles.farmerName}>{collection.farmer}</ThemedText>
          <ThemedText style={styles.farmerId}>Farmer ID: {collection.id}</ThemedText>
          <ThemedText style={styles.landText}>
            <MaterialCommunityIcons name="leaf" size={10} color="#178951" /> Land {collection.land}
          </ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#9BAEB6" />
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.collectionMeta}>
        <Meta icon="scale-balance" label={collection.weight} caption="Weight" />
        <Meta icon="leaf" label={collection.quality} caption="Quality" color={collection.quality === 'Good' ? '#168C56' : '#F2A000'} />
        <Meta icon="clock-outline" label={collection.time} caption="Date & Time" />
      </View>
      <View style={styles.recordedBadge}>
        <MaterialCommunityIcons name="check-circle-outline" size={12} color="#168C56" />
        <ThemedText style={styles.recordedText}>Recorded</ThemedText>
      </View>
    </Pressable>
  );
}

function Meta({
  icon,
  label,
  caption,
  color = '#168C56',
}: {
  icon: IconName;
  label: string;
  caption: string;
  color?: string;
}) {
  return (
    <View style={styles.meta}>
      <MaterialCommunityIcons name={icon} size={14} color={color} />
      <View>
        <ThemedText type="smallBold" style={styles.metaLabel}>{label}</ThemedText>
        <ThemedText style={styles.metaCaption}>{caption}</ThemedText>
      </View>
    </View>
  );
}

export default function FieldOfficerCollectionHistoryScreen() {
  const [search, setSearch] = useState('');
  const filteredCollections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return collections;
    return collections.filter((collection) =>
      `${collection.farmer} ${collection.id} ${collection.land}`.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView bounces={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={21} color="#16834B" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>Green Leaf Collection</ThemedText>
              <ThemedText style={styles.headerBrand}>PureTeaAgro</ThemedText>
            </View>

            <View style={styles.searchField}>
              <MaterialCommunityIcons name="magnify" size={16} color="#8FAAB3" />
              <TextInput
                accessibilityLabel="Search collections"
                onChangeText={setSearch}
                placeholder="Search by farmer name or ID..."
                placeholderTextColor="#95A9AF"
                style={styles.searchInput}
                value={search}
              />
            </View>

            <View style={styles.filters}>
              <Filter icon="calendar-month-outline" label="Date" value="Today" />
              <Filter icon="account-outline" label="Farmer" value="All Farmers" />
            </View>

            <View style={styles.sectionRow}>
              <ThemedText type="smallBold" style={styles.todayText}>Today</ThemedText>
              <ThemedText style={styles.collectionCount}>{filteredCollections.length} collections</ThemedText>
            </View>

            <View style={styles.cards}>
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
              {filteredCollections.length === 0 && <ThemedText style={styles.emptyText}>No collections found.</ThemedText>}
            </View>

            <ThemedText style={styles.footerMessage}>Better Data  •  Healthier Tea  •  Sustainable Future</ThemedText>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
            <BottomTab icon="account-group-outline" label="Farmers" onPress={() => router.push('./field-officer-farmers')} />
            <BottomTab icon="leaf" label="Collections" active />
            <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
            <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Filter({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <Pressable accessibilityRole="button" style={styles.filter}>
      <MaterialCommunityIcons name={icon} size={16} color="#168C56" />
      <View style={styles.filterCopy}>
        <ThemedText style={styles.filterLabel}>{label}</ThemedText>
        <ThemedText type="smallBold" style={styles.filterValue}>{value}</ThemedText>
      </View>
      <MaterialCommunityIcons name="chevron-down" size={14} color="#92A6AF" />
    </Pressable>
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
  headerTitle: { flex: 1, color: '#173E36', fontSize: 14, lineHeight: 19, marginLeft: 7 },
  headerBrand: { color: '#5AA486', fontSize: 7, lineHeight: 10 },
  searchField: { height: 32, borderRadius: 9, borderWidth: 1, borderColor: '#B9ECCE', backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, marginHorizontal: 9, marginTop: 9 },
  searchInput: { flex: 1, color: '#385850', fontSize: 9, paddingVertical: 0, marginLeft: 6 },
  filters: { flexDirection: 'row', gap: 7, marginHorizontal: 9, marginTop: 8 },
  filter: { flex: 1, height: 42, borderRadius: 9, borderWidth: 1, borderColor: '#B9ECCE', backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9 },
  filterCopy: { flex: 1, marginLeft: 7 },
  filterLabel: { color: '#8CA0A1', fontSize: 7, lineHeight: 9 },
  filterValue: { color: '#2A4C43', fontSize: 9, lineHeight: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 12, marginBottom: 7 },
  todayText: { color: '#224D3D', fontSize: 12, lineHeight: 16 },
  collectionCount: { color: '#1D8151', fontSize: 8, lineHeight: 11, backgroundColor: '#E3F6E9', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 },
  cards: { marginHorizontal: 9, gap: 9 },
  collectionCard: { minHeight: 137, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderWidth: 1, borderColor: '#D9EDE0', padding: 9 },
  collectionHeader: { minHeight: 42, flexDirection: 'row', alignItems: 'center' },
  farmerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#C9EFD7', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  farmerCopy: { flex: 1 },
  farmerName: { color: '#263F3F', fontSize: 9, lineHeight: 13 },
  farmerId: { color: '#8EA1A6', fontSize: 8, lineHeight: 11 },
  landText: { color: '#48826C', fontSize: 8, lineHeight: 11 },
  cardDivider: { height: 1, backgroundColor: '#E6EFEA', marginVertical: 7 },
  collectionMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, minWidth: 77 },
  metaLabel: { color: '#2E4C45', fontSize: 8, lineHeight: 11 },
  metaCaption: { color: '#91A1A5', fontSize: 7, lineHeight: 9 },
  recordedBadge: { height: 27, borderRadius: 9, backgroundColor: '#E3FAED', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, marginTop: 7 },
  recordedText: { color: '#168C56', fontSize: 8, lineHeight: 11 },
  emptyText: { textAlign: 'center', color: '#718582', paddingVertical: 30, fontSize: 11 },
  footerMessage: { color: '#4B9C77', fontSize: 8, textAlign: 'center', marginTop: 26 },
  bottomNavigation: { height: 55, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 45 },
  bottomLabel: { color: '#8C9AA8', fontSize: 7, lineHeight: 10 },
  bottomLabelActive: { color: '#087A4A', fontWeight: '700' },
  pressed: { opacity: 0.82 },
});
