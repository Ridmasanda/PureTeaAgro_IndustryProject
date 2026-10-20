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

type Farmer = {
  name: string;
  id: string;
  area: string;
  avatar: 'man' | 'woman';
};

const farmers: Farmer[] = [
  { name: 'Nimal Perera', id: 'F001', area: '3.5 ha', avatar: 'man' },
  { name: 'Sunil Silva', id: 'F002', area: '5.2 ha', avatar: 'man' },
  { name: 'Kamalani Fernando', id: 'F003', area: '2.8 ha', avatar: 'woman' },
  { name: 'Wijesinghe Rohan', id: 'F004', area: '4.1 ha', avatar: 'man' },
  { name: 'Sampath Jayasinghe', id: 'F005', area: '6.3 ha', avatar: 'man' },
  { name: 'Chandrika Perera', id: 'F006', area: '3.2 ha', avatar: 'woman' },
];

function FarmerAvatar({ type }: { type: Farmer['avatar'] }) {
  return (
    <View style={styles.avatar}>
      <View style={[styles.avatarHair, type === 'woman' && styles.avatarHairWoman]} />
      <View style={styles.avatarFace} />
      <View style={styles.avatarShirt} />
    </View>
  );
}

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
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#16834B' : '#A2AABA'} />
      <ThemedText style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

export default function FieldOfficerFarmersScreen() {
  const [search, setSearch] = useState('');
  const filteredFarmers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return farmers;
    return farmers.filter((farmer) => `${farmer.name} ${farmer.id}`.toLowerCase().includes(query));
  }, [search]);

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable
                accessibilityLabel="Go back to dashboard"
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.headerButton}>
                <MaterialCommunityIcons name="arrow-left" size={21} color="#233A4B" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>
                Farmers
              </ThemedText>
              <Pressable accessibilityLabel="Add farmer" accessibilityRole="button" style={styles.headerButton}>
                <MaterialCommunityIcons name="account-plus-outline" size={21} color="#16834B" />
              </Pressable>
            </View>

            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={18} color="#16935E" />
              <TextInput
                accessibilityLabel="Search farmers"
                onChangeText={setSearch}
                placeholder="Search farmer name or ID..."
                placeholderTextColor="#A2AFB7"
                style={styles.searchInput}
                value={search}
              />
              <MaterialCommunityIcons name="leaf" size={15} color="#C1D993" />
            </View>

            <ThemedText type="smallBold" style={styles.countText}>
              {filteredFarmers.length === farmers.length ? farmers.length : filteredFarmers.length} Farmers
            </ThemedText>

            <View style={styles.farmerList}>
              {filteredFarmers.map((farmer) => (
                <Pressable
                  accessibilityLabel={`${farmer.name}, Farmer ID ${farmer.id}, ${farmer.area}, Active`}
                  accessibilityRole="button"
                  key={farmer.id}
                  onPress={() =>
                    router.push({
                      pathname: '/field-officer-farmer-details',
                      params: { name: farmer.name, id: farmer.id, area: farmer.area, avatar: farmer.avatar },
                    })
                  }
                  style={({ pressed }) => [styles.farmerCard, pressed && styles.cardPressed]}>
                  <FarmerAvatar type={farmer.avatar} />
                  <View style={styles.farmerDetails}>
                    <ThemedText type="smallBold" style={styles.farmerName}>
                      {farmer.name}
                    </ThemedText>
                    <ThemedText style={styles.farmerId}>Farmer ID: {farmer.id}</ThemedText>
                    <View style={styles.farmerMeta}>
                      <MaterialCommunityIcons name="map-marker" size={11} color="#14905A" />
                      <ThemedText style={styles.areaText}>{farmer.area}</ThemedText>
                      <View style={styles.activeBadge}>
                        <ThemedText style={styles.activeText}>Active</ThemedText>
                      </View>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#66A38C" />
                </Pressable>
              ))}
              {filteredFarmers.length === 0 && (
                <ThemedText style={styles.emptyText}>No farmers found.</ThemedText>
              )}
            </View>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
            <BottomTab icon="account-group-outline" label="Farmers" active />
            <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
            <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
            <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.37)',
  },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  scrollContent: { paddingBottom: 12 },
  header: {
    height: 59,
    backgroundColor: 'rgba(250, 255, 251, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerButton: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#174B2F',
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 3,
  },
  searchWrap: {
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BEEFD0',
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: '#26384D',
    fontSize: 9,
    lineHeight: 13,
    marginHorizontal: 7,
    paddingVertical: 0,
  },
  countText: {
    color: '#174B2F',
    fontSize: 10,
    lineHeight: 14,
    marginHorizontal: 17,
    marginTop: 12,
    marginBottom: 8,
  },
  farmerList: { paddingHorizontal: 13, gap: 7 },
  farmerCard: {
    minHeight: 58,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: '#E0EAE5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardPressed: { opacity: 0.84 },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#C9EED6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 11,
  },
  avatarHair: {
    position: 'absolute',
    top: 5,
    width: 19,
    height: 14,
    borderRadius: 12,
    backgroundColor: '#257B48',
  },
  avatarHairWoman: {
    width: 22,
    height: 23,
    top: 4,
    borderRadius: 13,
  },
  avatarFace: {
    width: 13,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E8B68A',
    marginBottom: 9,
  },
  avatarShirt: {
    position: 'absolute',
    bottom: 0,
    width: 25,
    height: 11,
    borderRadius: 12,
    backgroundColor: '#186A3E',
  },
  farmerDetails: { flex: 1 },
  farmerName: { color: '#233842', fontSize: 9, lineHeight: 13 },
  farmerId: { color: '#98A6AB', fontSize: 8, lineHeight: 11 },
  farmerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  areaText: { color: '#3D6F5A', fontSize: 8, lineHeight: 11, marginLeft: 2 },
  activeBadge: {
    borderRadius: 8,
    backgroundColor: '#DDF4E6',
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 7,
  },
  activeText: { color: '#21824D', fontSize: 7, lineHeight: 10 },
  emptyText: {
    textAlign: 'center',
    color: '#6B7C74',
    fontSize: 12,
    paddingVertical: 35,
  },
  bottomNavigation: {
    height: 57,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E4E8E6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 54 },
  bottomLabel: { color: '#9CA6B3', fontSize: 8, lineHeight: 11 },
  bottomLabelActive: { color: '#16834B', fontWeight: '700' },
});
