import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

function LandRow({
  icon,
  label,
  value,
  badge,
}: {
  icon: 'account-outline' | 'card-account-details-outline' | 'ruler-square' | 'map-outline' | 'map-marker';
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <View style={styles.landRow}>
      <View style={styles.landIcon}>
        <MaterialCommunityIcons name={icon} size={15} color="#168D58" />
      </View>
      <ThemedText style={styles.landLabel}>{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.landValue}>{value}</ThemedText>
      {badge && (
        <View style={styles.sectorBadge}>
          <ThemedText style={styles.sectorText}>{badge}</ThemedText>
        </View>
      )}
    </View>
  );
}

function HistoryRow({ icon, label, value, badge }: { icon: 'calendar-outline' | 'shield-check-outline' | 'check-circle'; label: string; value: string; badge?: string }) {
  return (
    <View style={styles.historyRow}>
      <View style={styles.historyIcon}>
        <MaterialCommunityIcons name={icon} size={15} color="#168D58" />
      </View>
      <ThemedText style={styles.historyLabel}>{label}</ThemedText>
      {badge ? (
        <View style={styles.compliantBadge}>
          <ThemedText style={styles.compliantText}>{badge}</ThemedText>
        </View>
      ) : (
        <ThemedText type="smallBold" style={styles.historyValue}>{value}</ThemedText>
      )}
    </View>
  );
}

export default function FieldOfficerTeaLandDetailsScreen() {
  const params = useLocalSearchParams<{ name?: string; id?: string; area?: string }>();
  const name = params.name ?? 'Nimal Perera';
  const id = params.id ?? 'F001';
  const area = params.area ?? '3.5 ha';
  const hectares = `${area.replace(' ha', '')} hectares`;

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable accessibilityLabel="Go back to farmer details" accessibilityRole="button" onPress={() => router.back()} style={styles.headerButton}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#233A4B" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>Tea Land Details</ThemedText>
              <View style={styles.headerButton} />
            </View>

            <View style={styles.landHero}>
              <View style={styles.leafBadge}>
                <MaterialCommunityIcons name="leaf" size={29} color="#00A66F" />
              </View>
              <View style={styles.landIdCopy}>
                <ThemedText style={styles.landIdLabel}>Land ID</ThemedText>
                <View style={styles.landIdBadge}>
                  <ThemedText style={styles.landIdText}>TL-001</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.ownerCard}>
              <LandRow icon="account-outline" label="Farmer Name" value={name} />
              <LandRow icon="card-account-details-outline" label="Farmer ID" value={id} />
              <LandRow icon="ruler-square" label="Land Size" value={hectares} />
              <LandRow icon="map-outline" label="Sector" value="" badge="Small Sector" />
              <LandRow icon="map-marker" label="Location" value="Kandy" />
            </View>

            <ThemedText type="smallBold" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="leaf" size={15} color="#16834B" /> Cultivation Status
            </ThemedText>
            <View style={styles.cultivationCard}>
              <View style={styles.cultivationIcon}>
                <MaterialCommunityIcons name="leaf" size={25} color="#00A66F" />
              </View>
              <View>
                <ThemedText type="smallBold" style={styles.healthyText}>Healthy</ThemedText>
                <ThemedText style={styles.healthyCaption}>Tea plants growing well</ThemedText>
              </View>
            </View>

            <View style={styles.historyCard}>
              <HistoryRow icon="calendar-outline" label="Last Field Visit" value="25 Sep 2026" />
              <HistoryRow icon="shield-check-outline" label="Last Inspection" value="12 Sep 2026" />
              <HistoryRow icon="check-circle" label="Agrochemical Compliance" value="" badge="Compliant" />
            </View>

            <Pressable
              accessibilityLabel="Record Field Visit"
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/field-officer-field-visit',
                  params: { name, id, area },
                })
              }
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="calendar-plus-outline" size={17} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.primaryText}>Record Field Visit</ThemedText>
            </Pressable>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
            <BottomTab icon="account-group-outline" label="Farmers" active onPress={() => router.push('./field-officer-farmers')} />
            <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
            <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
            <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function BottomTab({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: 'home' | 'account-group-outline' | 'leaf' | 'clipboard-text-outline' | 'account-outline';
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.31)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  scrollContent: { paddingBottom: 13 },
  header: { height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, backgroundColor: 'rgba(250,255,251,0.76)' },
  headerButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#174B2F', fontSize: 15, lineHeight: 20, marginLeft: 4 },
  landHero: { height: 70, marginHorizontal: 12, marginTop: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.94)', borderWidth: 1, borderColor: '#D8EFE0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  leafBadge: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#E2F7EA', alignItems: 'center', justifyContent: 'center' },
  landIdCopy: { flex: 1, alignItems: 'flex-end' },
  landIdLabel: { color: '#8A969A', fontSize: 8, lineHeight: 11 },
  landIdBadge: { borderRadius: 12, backgroundColor: '#E2F7EA', borderWidth: 1, borderColor: '#BDE9CC', paddingHorizontal: 9, paddingVertical: 4, marginTop: 2 },
  landIdText: { color: '#20824F', fontSize: 9, lineHeight: 12 },
  ownerCard: { marginHorizontal: 12, marginTop: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 12, paddingVertical: 5 },
  landRow: { minHeight: 39, flexDirection: 'row', alignItems: 'center' },
  landIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E6F6EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  landLabel: { color: '#75818D', fontSize: 8, lineHeight: 11, flex: 1 },
  landValue: { color: '#26384D', fontSize: 10, lineHeight: 14, textAlign: 'right' },
  sectorBadge: { borderRadius: 10, backgroundColor: '#E0F7E9', borderWidth: 1, borderColor: '#B9ECCE', paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
  sectorText: { color: '#20824F', fontSize: 8, lineHeight: 11 },
  sectionTitle: { color: '#16452A', fontSize: 10, lineHeight: 14, marginHorizontal: 17, marginTop: 14, marginBottom: 7 },
  cultivationCard: { minHeight: 60, marginHorizontal: 12, borderRadius: 11, backgroundColor: 'rgba(236,252,242,0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  cultivationIcon: { width: 38, height: 38, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  healthyText: { color: '#17603A', fontSize: 12, lineHeight: 16 },
  healthyCaption: { color: '#7B9185', fontSize: 8, lineHeight: 11 },
  historyCard: { marginHorizontal: 12, marginTop: 10, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 12, paddingVertical: 5 },
  historyRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center' },
  historyIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E6F6EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  historyLabel: { flex: 1, color: '#75818D', fontSize: 8, lineHeight: 11 },
  historyValue: { color: '#26384D', fontSize: 10, lineHeight: 14 },
  compliantBadge: { borderRadius: 11, backgroundColor: '#E0F7E9', borderWidth: 1, borderColor: '#B9ECCE', paddingHorizontal: 9, paddingVertical: 4 },
  compliantText: { color: '#20824F', fontSize: 8, lineHeight: 11 },
  primaryButton: { height: 38, marginHorizontal: 12, borderRadius: 8, backgroundColor: '#087338', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 },
  primaryText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  pressed: { opacity: 0.82 },
  bottomNavigation: { height: 57, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 54 },
  bottomLabel: { color: '#9CA6B3', fontSize: 8, lineHeight: 11 },
  bottomLabelActive: { color: '#16834B', fontWeight: '700' },
});
