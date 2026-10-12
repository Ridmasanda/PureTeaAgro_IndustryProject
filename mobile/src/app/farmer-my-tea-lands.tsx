import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const lands = [
  { name: 'Green Valley Tea Land', size: '6.5 hectares', sector: 'Small Sector', location: 'Thalawaka­le', image: true },
  { name: 'Sunrise Estate', size: '12.3 hectares', sector: 'Medium Sector', location: 'Haputale', image: true },
  { name: 'Silver Leaf Land', size: '3.2 hectares', sector: 'Small Sector', location: 'Kandy', image: true },
];

export default function MyTeaLandsScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" /></Pressable>
            <ThemedText type="smallBold" style={styles.title}>My Tea Lands</ThemedText>
            <Image source={require('@/assets/images/icon.png')} style={styles.headerLogo} resizeMode="contain" />
          </View>
          {lands.map((land) => <LandCard key={land.name} {...land} />)}
          <Pressable accessibilityRole="button" style={styles.addButton}><MaterialCommunityIcons name="plus-circle-outline" size={18} color="#FFF" /><ThemedText type="smallBold" style={styles.addText}>Add New Tea Land</ThemedText></Pressable>
          <View style={styles.footerActions}><Pressable accessibilityRole="button" onPress={() => router.push('/edit-tea-land')} style={styles.secondaryButton}><MaterialCommunityIcons name="pencil-outline" size={17} color="#168B3E" /><ThemedText type="smallBold" style={styles.secondaryText}>Edit Land</ThemedText></Pressable><Pressable style={styles.secondaryButton}><MaterialCommunityIcons name="history" size={17} color="#168B3E" /><ThemedText type="smallBold" style={styles.secondaryText}>View History</ThemedText></Pressable></View>
        </ScrollView>
        <View style={styles.bottomNav}><NavItem icon="home-outline" label="Home" onPress={() => router.replace('/farmer-dashboard')} /><NavItem icon="map" label="My Lands" active /><NavItem icon="flask-outline" label="Agrochemicals" onPress={() => router.push('/agrochemicals')} /><NavItem icon="bell-outline" label="Notifications" onPress={() => router.push('/notifications')} /><NavItem icon="account-outline" label="Profile" onPress={() => router.push('/farmer-profile')} /></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function LandCard({ name, size, sector, location }: (typeof lands)[number]) {
  return <Pressable accessibilityRole="button" style={({ pressed }) => [styles.landCard, pressed && styles.pressed]}><Image source={require('@/assets/images/background.png')} style={styles.landImage} /><View style={styles.landDetails}><View style={styles.landTop}><ThemedText type="smallBold" style={styles.landName}>{name}</ThemedText><MaterialCommunityIcons name="chevron-right" size={20} color="#39785B" /></View><View style={styles.activeBadge}><ThemedText type="smallBold" style={styles.activeText}>Active</ThemedText></View><LandInfo icon="ruler-square" label="Land Size" value={size} /><LandInfo icon="domain" label="Sector" value={sector} /><LandInfo icon="map-marker-outline" label="Location" value={location} /><LandInfo icon="shield-check-outline" label="Compliance" value="Compliant" /></View></Pressable>;
}

function LandInfo({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.landInfo}><MaterialCommunityIcons name={icon} size={14} color="#168B3E" /><ThemedText type="small" style={styles.infoLabel}>{label}</ThemedText><ThemedText type="smallBold" style={styles.infoValue}>{value}</ThemedText></View>;
}

function NavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={22} color={active ? '#168B3E' : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, active && styles.activeLabel]}>{label}</ThemedText>{active && <View style={styles.indicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 }, safeArea: { flex: 1 }, content: { paddingHorizontal: 14, paddingBottom: 18 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' }, title: { color: '#173F25', fontSize: 18 }, headerLogo: { width: 34, height: 34 }, landCard: { minHeight: 131, padding: 9, borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', backgroundColor: 'rgba(255,255,255,0.92)', flexDirection: 'row', gap: 10, marginBottom: 10 }, landImage: { width: 83, height: 83, borderRadius: 9, marginTop: 1 }, landDetails: { flex: 1 }, landTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, landName: { color: '#244D3A', fontSize: 12, flex: 1 }, activeBadge: { alignSelf: 'flex-start', backgroundColor: '#C9F0CF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginVertical: 3 }, activeText: { color: '#168B3E', fontSize: 9 }, landInfo: { minHeight: 17, flexDirection: 'row', alignItems: 'center', gap: 6 }, infoLabel: { color: '#648071', fontSize: 9, width: 62 }, infoValue: { color: '#315945', fontSize: 9, flex: 1 }, addButton: { minHeight: 43, borderRadius: 9, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 2 }, addText: { color: '#FFF', fontSize: 11 }, footerActions: { flexDirection: 'row', gap: 9, marginTop: 10 }, secondaryButton: { flex: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: '#A9DDB4', backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 }, secondaryText: { color: '#315945', fontSize: 10 }, bottomNav: { height: 61, borderTopWidth: 1, borderTopColor: '#D9E9DC', backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 58, height: 58 }, navLabel: { color: '#648074', fontSize: 8, marginTop: 2 }, activeLabel: { color: '#168B3E', fontWeight: '700' }, indicator: { width: 20, height: 2, borderRadius: 1, backgroundColor: '#168B3E', marginTop: 3 }, pressed: { opacity: 0.8 },
});
