import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const personalInformation: [IconName, string, string][] = [
  ['account-outline', 'Full Name', 'Saman Kumara'],
  ['card-account-details-outline', 'NIC', 'Not provided'],
  ['phone-outline', 'Mobile Number', 'Not provided'],
  ['home-outline', 'Address', 'Not provided'],
  ['map-marker-outline', 'District', 'Not provided'],
];

const profileActions: [IconName, string][] = [
  ['square-edit-outline', 'Edit Personal Details'],
  ['map-outline', 'View Registered Lands'],
  ['map-marker-radius-outline', 'View Land Category Information'],
  ['lock-outline', 'Change Password'],
  ['cog-outline', 'Settings'],
];

export default function FarmerProfileScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" />
            </Pressable>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons name="leaf" size={22} color="#168B3E" />
              <ThemedText type="smallBold" style={styles.brand}>PureTeaAgro</ThemedText>
            </View>
            <View style={styles.headerSpace} />
          </View>

          <View style={styles.profileHero}>
            <View style={styles.avatar}><MaterialCommunityIcons name="account" size={45} color="#168B3E" /></View>
            <View style={styles.heroDetails}>
              <ThemedText type="smallBold" style={styles.name}>Saman Kumara</ThemedText>
              <ThemedText type="small" style={styles.farmerId}>Farmer ID: FRM-00124</ThemedText>
              <View style={styles.verified}><MaterialCommunityIcons name="check-circle" size={13} color="#168B3E" /><ThemedText type="smallBold" style={styles.verifiedText}>Verified</ThemedText></View>
            </View>
          </View>

          <View style={styles.card}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>Personal Information</ThemedText>
            {personalInformation.map(([icon, label, value]) => <InfoRow key={label} icon={icon} label={label} value={value} />)}
          </View>

          <View style={styles.landCard}>
            <View style={styles.landHeading}><MaterialCommunityIcons name="leaf" size={25} color="#168B3E" /><ThemedText type="smallBold" style={styles.sectionTitle}>FARMER LAND PROFILE</ThemedText></View>
            <ThemedText type="small" style={styles.muted}>Total Registered Land</ThemedText>
            <ThemedText type="subtitle" style={styles.landValue}>6.5 hectares</ThemedText>
            <View style={styles.sector}><ThemedText type="smallBold" style={styles.sectorText}>SMALL SECTOR</ThemedText></View>
            <ThemedText type="small" style={styles.landNote}>Based on registered land size</ThemedText>
          </View>

          <View style={styles.actionCard}>
            {profileActions.map(([icon, label]) => <Pressable key={label} accessibilityRole="button" onPress={() => undefined} style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}><MaterialCommunityIcons name={icon} size={18} color="#168B3E" /><ThemedText type="small" style={styles.actionLabel}>{label}</ThemedText><MaterialCommunityIcons name="chevron-right" size={18} color="#39785B" /></Pressable>)}
          </View>

          <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}><MaterialCommunityIcons name="logout" size={19} color="#D52C2C" /><ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText></Pressable>
        </ScrollView>
        <View style={styles.bottomNav}><NavItem icon="home" label="Home" onPress={() => router.replace('/farmer-dashboard')} /><NavItem icon="map-outline" label="My Lands" /><NavItem icon="flask-outline" label="Agrochemicals" onPress={() => router.push('/agrochemicals')} /><NavItem icon="bell-outline" label="Notifications" /><NavItem icon="account" label="Profile" active /></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.infoRow}><MaterialCommunityIcons name={icon} size={17} color="#168B3E" /><ThemedText type="small" style={styles.infoLabel}>{label}</ThemedText><ThemedText type="small" style={styles.infoValue}>{value}</ThemedText></View>;
}

function NavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={22} color={active ? '#168B3E' : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  brand: { color: '#19833A', fontSize: 15 },
  headerSpace: { width: 36 },
  profileHero: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: '#EAF8EE', borderWidth: 1, borderColor: '#C5E8CD', marginBottom: 12 },
  avatar: { width: 78, height: 78, borderRadius: 40, backgroundColor: '#D5F0D9', borderWidth: 2, borderColor: '#6BBC7A', alignItems: 'center', justifyContent: 'center' },
  heroDetails: { marginLeft: 14 },
  name: { color: '#174B32', fontSize: 20 },
  farmerId: { color: '#5A806B', marginTop: 2 },
  verified: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#C9F0CF', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, marginTop: 7 },
  verifiedText: { color: '#168B3E', fontSize: 10 },
  card: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, borderWidth: 1, borderColor: '#C9EAD0', padding: 12, marginBottom: 12 },
  sectionTitle: { color: '#195436', fontSize: 13 },
  infoRow: { minHeight: 32, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E6F1E8', gap: 8 },
  infoLabel: { color: '#648071', width: 95, fontSize: 10 },
  infoValue: { color: '#315945', flex: 1, fontSize: 10 },
  landCard: { backgroundColor: 'rgba(239,255,242,0.94)', borderRadius: 14, borderWidth: 1, borderColor: '#63BE73', padding: 12, marginBottom: 12 },
  landHeading: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  muted: { color: '#648071', fontSize: 10, marginTop: 7 },
  landValue: { color: '#168B3E', fontSize: 22, lineHeight: 28, fontWeight: '800' },
  sector: { alignSelf: 'flex-start', backgroundColor: '#B9EBC1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 3, marginTop: 2 },
  sectorText: { color: '#28733A', fontSize: 9 },
  landNote: { color: '#648071', fontSize: 9, marginTop: 7 },
  actionCard: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', overflow: 'hidden', marginBottom: 12 },
  actionRow: { minHeight: 42, paddingHorizontal: 11, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 9 },
  actionLabel: { color: '#315945', flex: 1, fontSize: 10 },
  logout: { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: '#F09B9B', backgroundColor: 'rgba(255,246,246,0.95)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  logoutText: { color: '#D52C2C', fontSize: 11 },
  bottomNav: { height: 61, borderTopWidth: 1, borderTopColor: '#D9E9DC', backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 54, height: 58 },
  navLabel: { color: '#648074', fontSize: 8, marginTop: 2 },
  navLabelActive: { color: '#168B3E', fontWeight: '700' },
  navIndicator: { width: 20, height: 2, borderRadius: 1, backgroundColor: '#168B3E', marginTop: 3 },
  pressed: { opacity: 0.8 },
});
