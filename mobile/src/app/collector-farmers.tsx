import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CollectorDashboardShell } from '@/app/collector-dashboard-shell';

const farmers = [
  { name: 'Nimal Perera', id: 'FRM-0021', sector: 'Small Sector', hectares: '6.5 ha', location: 'Galle', status: 'Collected' },
  { name: 'Kamala Silva', id: 'FRM-0045', sector: 'Medium Sector', hectares: '18.2 ha', location: 'Matara', status: 'Pending' },
  { name: 'Sampath Wickramasinghe', id: 'FRM-0078', sector: 'State Sector', hectares: '52.4 ha', location: 'Hambantota', status: 'Collected' },
  { name: 'Sunil Fernando', id: 'FRM-0092', sector: 'Small Sector', hectares: '7.8 ha', location: 'Galle', status: 'Pending' },
  { name: 'Ranjith Silva', id: 'FRM-0101', sector: 'Medium Sector', hectares: '16.3 ha', location: 'Matara', status: 'Collected' },
];

export default function CollectorFarmersScreen() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const visibleFarmers = farmers.filter((farmer) => (
    `${farmer.name} ${farmer.id} ${farmer.location}`.toLowerCase().includes(search.trim().toLowerCase())
    && (sector === 'All' || farmer.sector.startsWith(sector))
  ));
  const sectors = ['All', 'Small', 'Medium', 'State'];

  return (
    <CollectorDashboardShell activeTab="Farmers">
      <View style={styles.heading}>
        <MaterialCommunityIcons name="account-group-outline" size={23} color="#24733E" />
        <ThemedText type="smallBold" style={styles.title}>Assigned Farmers</ThemedText>
      </View>
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={19} color="#36724A" />
        <TextInput
          accessibilityLabel="Search farmer name or ID"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setSearch}
          placeholder="Search farmer name or ID..."
          placeholderTextColor="#839289"
          style={styles.searchInput}
          value={search}
        />
        {search.length > 0 && (
          <Pressable accessibilityLabel="Clear farmer search" onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close-circle" size={17} color="#819087" />
          </Pressable>
        )}
      </View>
      <View style={styles.sectors}>
        {sectors.map((item) => {
          const selected = sector === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={item}
              onPress={() => setSector(item)}
              style={[styles.sectorChip, selected && styles.sectorChipSelected]}>
              <ThemedText type="smallBold" style={[styles.sectorText, selected && styles.sectorTextSelected]}>
                {item}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.list}>
        {visibleFarmers.map((farmer) => (
          <Pressable
            accessibilityRole="button"
            key={farmer.id}
            style={({ pressed }) => [styles.farmerCard, pressed && styles.pressed]}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account-tie-hat" size={26} color="#287A40" />
            </View>
            <View style={styles.details}>
              <View style={styles.titleRow}>
                <View style={styles.nameWrap}>
                  <ThemedText type="smallBold" style={styles.name}>{farmer.name}</ThemedText>
                  <ThemedText type="small" style={styles.id}>{farmer.id}</ThemedText>
                </View>
                <View style={[styles.status, farmer.status === 'Pending' && styles.pending]}>
                  <ThemedText type="smallBold" style={[styles.statusText, farmer.status === 'Pending' && styles.pendingText]}>
                    {farmer.status}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.sectorLine}>
                <ThemedText type="smallBold" style={styles.sectorLabel}>{farmer.sector}</ThemedText>
              </View>
              <View style={styles.facts}>
                <MaterialCommunityIcons name="sprout" size={13} color="#267541" />
                <ThemedText type="small" style={styles.factText}>{farmer.hectares}</ThemedText>
                <MaterialCommunityIcons name="map-marker" size={13} color="#267541" />
                <ThemedText type="small" style={styles.factText}>{farmer.location}</ThemedText>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={19} color="#315F40" />
          </Pressable>
        ))}
        {visibleFarmers.length === 0 && (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="account-search-outline" size={26} color="#7C9382" />
            <ThemedText type="small" style={styles.emptyText}>No farmers match your search.</ThemedText>
          </View>
        )}
      </View>
    </CollectorDashboardShell>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.88 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 9, marginBottom: 12 },
  title: { color: '#174A2A', fontSize: 19, lineHeight: 25 },
  searchBox: {
    minHeight: 41,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBE0',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  searchInput: { flex: 1, minWidth: 0, minHeight: 39, color: '#294B34', fontSize: 11, paddingHorizontal: 9 },
  sectors: { flexDirection: 'row', gap: 8, marginBottom: 11 },
  sectorChip: {
    minWidth: 62,
    minHeight: 31,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D5E8D9',
    backgroundColor: 'rgba(255,255,255,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
  },
  sectorChipSelected: { backgroundColor: '#087235', borderColor: '#087235' },
  sectorText: { color: '#607568', fontSize: 9 },
  sectorTextSelected: { color: '#FFFFFF' },
  list: { gap: 8 },
  farmerCard: {
    minHeight: 86,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDECE0',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#E5F5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  details: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 },
  nameWrap: { flex: 1, minWidth: 0 },
  name: { color: '#254B37', fontSize: 11, lineHeight: 15 },
  id: { color: '#819187', fontSize: 8, lineHeight: 12 },
  status: { minWidth: 55, borderRadius: 11, alignItems: 'center', backgroundColor: '#DDF4D9', paddingHorizontal: 7, paddingVertical: 3 },
  pending: { backgroundColor: '#FFF0C9' },
  statusText: { color: '#318045', fontSize: 8, lineHeight: 11 },
  pendingText: { color: '#A66A00' },
  sectorLine: { flexDirection: 'row', marginTop: 3 },
  sectorLabel: { color: '#34794A', backgroundColor: '#DDF4D9', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 2, fontSize: 8, lineHeight: 11 },
  facts: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
  factText: { color: '#668274', fontSize: 8, lineHeight: 11, marginRight: 7 },
  empty: { minHeight: 100, borderRadius: 13, backgroundColor: '#FFFFFFE8', alignItems: 'center', justifyContent: 'center', gap: 7 },
  emptyText: { color: '#76867A', fontSize: 11 },
});
