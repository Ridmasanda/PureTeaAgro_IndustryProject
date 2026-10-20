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

function DetailRow({
  icon,
  label,
  value,
  badge,
}: {
  icon: 'phone' | 'home' | 'map-marker';
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={16} color="#248A57" />
      </View>
      <View style={styles.detailCopy}>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText type="smallBold" style={styles.detailValue}>
          {value}
        </ThemedText>
      </View>
      {badge && (
        <View style={styles.sectorBadge}>
          <ThemedText style={styles.sectorText}>{badge}</ThemedText>
        </View>
      )}
    </View>
  );
}

function ActivityStat({ icon, label, value }: { icon: 'calendar-outline' | 'leaf' | 'shield-check-outline'; label: string; value: string }) {
  return (
    <View style={styles.activityStat}>
      <View style={styles.activityIcon}>
        <MaterialCommunityIcons name={icon} size={15} color="#168D58" />
      </View>
      <ThemedText style={styles.activityLabel}>{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.activityValue}>{value}</ThemedText>
    </View>
  );
}

export default function FieldOfficerFarmerDetailsScreen() {
  const params = useLocalSearchParams<{ name?: string; id?: string; area?: string; avatar?: string }>();
  const name = params.name ?? 'Nimal Perera';
  const id = params.id ?? 'F001';
  const area = params.area ?? '3.5 ha';
  const isWoman = params.avatar === 'woman';

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
              <Pressable accessibilityLabel="Go back to farmers" accessibilityRole="button" onPress={() => router.back()} style={styles.headerButton}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#233A4B" />
              </Pressable>
              <ThemedText type="smallBold" style={styles.headerTitle}>Farmer Details</ThemedText>
              <Pressable accessibilityLabel="More farmer options" accessibilityRole="button" style={styles.headerButton}>
                <MaterialCommunityIcons name="dots-vertical" size={21} color="#16834B" />
              </Pressable>
            </View>

            <View style={styles.profile}>
              <View style={styles.profileAvatar}>
                <View style={[styles.avatarHair, isWoman && styles.avatarHairWoman]} />
                <View style={styles.avatarFace} />
                <View style={styles.avatarShirt} />
              </View>
              <View style={styles.profileCopy}>
                <ThemedText type="smallBold" style={styles.name}>{name}</ThemedText>
                <ThemedText style={styles.id}>Farmer ID: {id}</ThemedText>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <ThemedText style={styles.statusText}>Active</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.detailsCard}>
              <DetailRow icon="phone" label="Contact" value="071 234 5678" />
              <View style={styles.divider} />
              <DetailRow icon="home" label="Tea Land" value={`${area.replace(' ha', '')} hectares`} badge="Small Sector" />
              <View style={styles.divider} />
              <DetailRow icon="map-marker" label="Location" value="Kandy" />
            </View>

            <ThemedText type="smallBold" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="sprout" size={15} color="#16834B" /> Recent Field Activity
            </ThemedText>
            <View style={styles.activityCard}>
              <ActivityStat icon="calendar-outline" label="Last Visit" value="25 Sep 2026" />
              <ActivityStat icon="leaf" label="Last Collection" value="245 kg" />
              <ActivityStat icon="shield-check-outline" label="Compliance" value="Compliant" />
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
            <Pressable
              accessibilityLabel="View Tea Land"
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/field-officer-tea-land-details',
                  params: { name, id, area },
                })
              }
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="map-outline" size={17} color="#177A4B" />
              <ThemedText type="smallBold" style={styles.secondaryText}>View Tea Land</ThemedText>
            </Pressable>
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
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.32)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  scrollContent: { paddingBottom: 13 },
  header: { height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, backgroundColor: 'rgba(250,255,251,0.76)' },
  headerButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', color: '#174B2F', fontSize: 14, lineHeight: 19 },
  profile: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, paddingTop: 10, paddingBottom: 12 },
  profileAvatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#C8EFD5', borderWidth: 2, borderColor: '#F5FFF7', overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  avatarHair: { position: 'absolute', top: 10, width: 25, height: 18, borderRadius: 14, backgroundColor: '#257B48' },
  avatarHairWoman: { width: 29, height: 31, top: 8, borderRadius: 16 },
  avatarFace: { width: 18, height: 19, borderRadius: 10, backgroundColor: '#E8B68A', marginBottom: 14 },
  avatarShirt: { position: 'absolute', bottom: 0, width: 38, height: 18, borderRadius: 18, backgroundColor: '#186A3E' },
  profileCopy: { marginLeft: 12 },
  name: { color: '#124B2D', fontSize: 15, lineHeight: 20 },
  id: { color: '#6D8C7B', fontSize: 9, lineHeight: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 9, backgroundColor: '#DDF4E6', paddingHorizontal: 7, paddingVertical: 2, marginTop: 3 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#1A9B5D', marginRight: 4 },
  statusText: { color: '#21824D', fontSize: 7, lineHeight: 10 },
  detailsCard: { marginHorizontal: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 12, paddingVertical: 4 },
  detailRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center' },
  detailIcon: { width: 29, height: 29, borderRadius: 15, backgroundColor: '#E6F6EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  detailCopy: { flex: 1 },
  detailLabel: { color: '#86939C', fontSize: 8, lineHeight: 11 },
  detailValue: { color: '#26384D', fontSize: 10, lineHeight: 14 },
  sectorBadge: { borderRadius: 10, backgroundColor: '#E0F7E9', borderWidth: 1, borderColor: '#B9ECCE', paddingHorizontal: 8, paddingVertical: 4 },
  sectorText: { color: '#20824F', fontSize: 8, lineHeight: 11 },
  divider: { height: 1, backgroundColor: '#E6EEE9', marginLeft: 39 },
  sectionTitle: { color: '#16452A', fontSize: 10, lineHeight: 14, marginHorizontal: 17, marginTop: 14, marginBottom: 7 },
  activityCard: { flexDirection: 'row', marginHorizontal: 12, gap: 7 },
  activityStat: { flex: 1, minHeight: 67, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  activityIcon: { width: 22, height: 22, borderRadius: 7, backgroundColor: '#E2F7EA', alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  activityLabel: { color: '#82918A', fontSize: 7, lineHeight: 10 },
  activityValue: { color: '#26384D', fontSize: 8, lineHeight: 11, marginTop: 2 },
  primaryButton: { height: 35, marginHorizontal: 12, borderRadius: 8, backgroundColor: '#087338', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 13 },
  primaryText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  secondaryButton: { height: 35, marginHorizontal: 12, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#B2D9C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 7 },
  secondaryText: { color: '#177A4B', fontSize: 10, lineHeight: 14 },
  pressed: { opacity: 0.82 },
  bottomNavigation: { height: 57, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 54 },
  bottomLabel: { color: '#9CA6B3', fontSize: 8, lineHeight: 11 },
  bottomLabelActive: { color: '#16834B', fontWeight: '700' },
});
