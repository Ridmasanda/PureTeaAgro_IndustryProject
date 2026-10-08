import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const stats = [
  { icon: 'map-outline' as IconName, value: '2', label: 'Total Tea Lands', tone: 'green' },
  { icon: 'map-marker-radius-outline' as IconName, value: '6.5 ha', label: 'Total Land Area', tone: 'blue' },
  { icon: 'shield-check-outline' as IconName, value: 'Compliant', label: 'Compliance Status', tone: 'green' },
  { icon: 'leaf' as IconName, value: 'Eligible', label: 'Harvest Eligibility', tone: 'purple' },
];

const actions = [
  { icon: 'flask-outline' as IconName, label: 'Add Agrochemical\nRecord', tone: 'green' },
  { icon: 'sprout' as IconName, label: 'View Harvest\nEligibility', tone: 'yellow' },
  { icon: 'map-outline' as IconName, label: 'View My Lands', tone: 'green' },
  { icon: 'flask-outline' as IconName, label: 'View Approved\nChemicals', tone: 'purple' },
];

export default function FarmerDashboardScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandLeaf}><MaterialCommunityIcons name="leaf" size={22} color="#2A994B" /></View>
              <ThemedText type="smallBold" style={styles.brand}>PureTeaAgro</ThemedText>
            </View>
            <View style={styles.topActions}>
              <Pressable accessibilityLabel="Notifications" style={styles.iconButton}><MaterialCommunityIcons name="bell-outline" size={22} color="#215C3A" /></Pressable>
              <View style={styles.avatar}><MaterialCommunityIcons name="account" size={27} color="#2A994B" /></View>
            </View>
          </View>

          <ThemedText type="small" style={styles.greeting}>Good Morning,</ThemedText>
          <ThemedText type="subtitle" style={styles.name}>Saman Kumara <ThemedText style={styles.wave}>👋</ThemedText></ThemedText>
          <ThemedText type="small" style={styles.role}>Farmer  •  FRM-00124</ThemedText>

          <Pressable accessibilityRole="button" onPress={() => router.push('/farmer-profile')} style={({ pressed }) => [styles.profileCard, pressed && styles.pressed]}>
            <View style={styles.profileIcon}><MaterialCommunityIcons name="leaf" size={29} color="#168B3E" /></View>
            <View style={styles.profileDetails}><ThemedText type="smallBold" style={styles.cardTitle}>Farmer Profile</ThemedText><View style={styles.badge}><ThemedText type="smallBold" style={styles.badgeText}>Small Sector</ThemedText></View><ThemedText type="small" style={styles.cardCaption}>Total Tea Land: <ThemedText type="smallBold" style={styles.cardValue}>6.5 hectares</ThemedText></ThemedText></View>
            <MaterialCommunityIcons name="chevron-right" size={23} color="#39785B" />
          </Pressable>

          <View style={styles.statsGrid}>{stats.map((stat) => <DashboardCard key={stat.label} {...stat} />)}</View>

          <ThemedText type="smallBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>{actions.map((action) => <Pressable key={action.label} accessibilityRole="button" onPress={action.label.startsWith('Add Agrochemical') || action.label.startsWith('View Approved') ? () => router.push('/agrochemicals') : undefined} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}><View style={[styles.actionIcon, styles[`${action.tone}Icon` as keyof typeof styles] as object]}><MaterialCommunityIcons name={action.icon} size={21} color="#FFF" /></View><ThemedText type="smallBold" style={styles.actionText}>{action.label}</ThemedText><MaterialCommunityIcons name="chevron-right" size={19} color="#39785B" /></Pressable>)}</View>

          <View style={styles.inspectionCard}><View style={styles.inspectionIcon}><MaterialCommunityIcons name="file-document-outline" size={30} color="#FFF" /><View style={styles.inspectionIconBadge}><MaterialCommunityIcons name="check" size={10} color="#FFF" /></View></View><View style={styles.inspectionContent}><ThemedText type="smallBold" style={styles.inspectionTitle}>Inspection Status</ThemedText><ThemedText type="small" style={styles.inspectionLand}>Green Valley Tea Land</ThemedText><View style={styles.inspectionBadge}><MaterialCommunityIcons name="check-circle" size={16} color="#168B3E" /><ThemedText type="smallBold" style={styles.inspectionBadgeText}>Inspection Completed</ThemedText></View><ThemedText type="small" style={styles.inspectionDate}>18 Sep 2026</ThemedText></View><Pressable accessibilityRole="button" style={styles.inspectionDetails}><ThemedText type="smallBold" style={styles.inspectionDetailsText}>View Details</ThemedText><MaterialCommunityIcons name="chevron-right" size={21} color="#39785B" /></Pressable></View>

          <View style={styles.complianceCard}><View style={styles.bellCircle}><MaterialCommunityIcons name="bell-outline" size={22} color="#AD7A00" /></View><View style={styles.complianceText}><ThemedText type="smallBold" style={styles.complianceTitle}>Smart Compliance Summary</ThemedText><ThemedText type="small" style={styles.complianceCaption}>Your registered tea lands have 2 upcoming compliance reminders.</ThemedText></View><Pressable accessibilityRole="button"><ThemedText type="smallBold" style={styles.detailsText}>View Details</ThemedText><MaterialCommunityIcons name="chevron-right" size={16} color="#926A00" /></Pressable></View>

          <ThemedText type="smallBold" style={styles.sectionTitle}>Recent Activity</ThemedText>
          <View style={styles.activityCard}><Activity icon="flask-outline" title="Agrochemical record submitted" detail="Product A • Green Valley Land" time="2 hours ago" tone="green" /><Activity icon="check-circle-outline" title="Inspection completed" detail="Green Valley Land • Compliant" time="1 day ago" tone="blue" /><Activity icon="bell-outline" title="New approved chemical information" detail="Product B is now available" time="2 days ago" tone="yellow" /></View>
        </ScrollView>
        <View style={styles.bottomNav}><NavItem icon="home" label="Home" active /><NavItem icon="map-outline" label="My Lands" /><NavItem icon="flask-outline" label="Agrochemicals" onPress={() => router.push('/agrochemicals')} /><NavItem icon="bell-outline" label="Notifications" /><NavItem icon="account-outline" label="Profile" onPress={() => router.push('/farmer-profile')} /></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function DashboardCard({ icon, value, label, tone }: { icon: IconName; value: string; label: string; tone: string }) {
  return <Pressable accessibilityRole="button" style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}><View style={[styles.statIcon, styles[`${tone}Soft` as keyof typeof styles] as object]}><MaterialCommunityIcons name={icon} size={22} color={tone === 'purple' ? '#7B42C5' : tone === 'blue' ? '#148AC8' : '#168B3E'} /></View><MaterialCommunityIcons name="chevron-right" size={19} color="#39785B" style={styles.statChevron} /><ThemedText type="smallBold" style={styles.statValue}>{value}</ThemedText><ThemedText type="small" style={styles.statLabel}>{label}</ThemedText></Pressable>;
}

function Activity({ icon, title, detail, time, tone }: { icon: IconName; title: string; detail: string; time: string; tone: string }) {
  return <View style={styles.activityRow}><View style={[styles.activityIcon, styles[`${tone}Icon` as keyof typeof styles] as object]}><MaterialCommunityIcons name={icon} size={18} color="#FFF" /></View><View style={styles.activityText}><ThemedText type="smallBold" style={styles.activityTitle}>{title}</ThemedText><ThemedText type="small" style={styles.activityDetail}>{detail}</ThemedText></View><ThemedText type="small" style={styles.activityTime}>{time}</ThemedText><MaterialCommunityIcons name="chevron-right" size={18} color="#39785B" /></View>;
}

function NavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress ?? (active ? () => router.replace('/farmer-dashboard') : undefined)} style={styles.navItem}><MaterialCommunityIcons name={icon} size={22} color={active ? '#168B3E' : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>{active && <View style={styles.navIndicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' }, backgroundOverlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.58 }, safeArea: { flex: 1 }, content: { paddingHorizontal: 14, paddingBottom: 16 }, topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, brandLeaf: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#DFF5E1', alignItems: 'center', justifyContent: 'center' }, brand: { color: '#19833A', fontSize: 15 }, topActions: { flexDirection: 'row', alignItems: 'center', gap: 10 }, iconButton: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' }, avatar: { width: 41, height: 41, borderRadius: 21, backgroundColor: '#DFF5E1', borderWidth: 2, borderColor: '#8BCB92', alignItems: 'center', justifyContent: 'center' }, greeting: { color: '#295D43', marginTop: 2 }, name: { color: '#174B32', fontSize: 22, lineHeight: 27, fontWeight: '800', marginTop: 1 }, wave: { fontSize: 18 }, role: { color: '#5A806B', marginTop: 1 }, profileCard: { marginTop: 14, borderRadius: 14, borderWidth: 1, borderColor: '#C9EAD0', backgroundColor: '#ECFAF0', minHeight: 76, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }, profileIcon: { width: 48, height: 48, borderRadius: 25, backgroundColor: '#D8F3DC', alignItems: 'center', justifyContent: 'center' }, profileDetails: { flex: 1 }, cardTitle: { color: '#194B31' }, badge: { alignSelf: 'flex-start', backgroundColor: '#6BDA85', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 }, badgeText: { color: '#17612F', fontSize: 9 }, cardCaption: { color: '#4E735E', marginTop: 3, fontSize: 10 }, cardValue: { color: '#236B3D' }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }, statCard: { width: '48.3%', minHeight: 87, borderRadius: 13, borderWidth: 1, borderColor: '#E0EEE4', backgroundColor: '#FFF', padding: 10, shadowColor: '#1D5C39', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 1 }, statIcon: { width: 37, height: 37, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, greenSoft: { backgroundColor: '#DDF5E1' }, blueSoft: { backgroundColor: '#D9F1FF' }, purpleSoft: { backgroundColor: '#EEE0FF' }, statChevron: { position: 'absolute', right: 8, top: 28 }, statValue: { color: '#234B35', fontSize: 14, marginTop: 4 }, statLabel: { color: '#648071', fontSize: 10, marginTop: 1 }, sectionTitle: { color: '#1A5134', fontSize: 14, marginTop: 15, marginBottom: 7 }, actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, actionCard: { width: '48.4%', minHeight: 51, borderRadius: 12, borderWidth: 1, borderColor: '#E0EEE4', backgroundColor: '#FFF', paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 7 }, actionIcon: { width: 32, height: 32, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }, greenIcon: { backgroundColor: '#17B95B' }, yellowIcon: { backgroundColor: '#F9B900' }, purpleIcon: { backgroundColor: '#8745C5' }, actionText: { color: '#315945', flex: 1, fontSize: 9, lineHeight: 12 }, inspectionCard: { marginTop: 14, minHeight: 128, borderRadius: 18, borderWidth: 1, borderColor: '#C9EDF4', backgroundColor: 'rgba(237,252,255,0.92)', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 }, inspectionIcon: { width: 66, height: 66, borderRadius: 34, backgroundColor: '#62C4EE', alignItems: 'center', justifyContent: 'center', position: 'relative' }, inspectionIconBadge: { position: 'absolute', right: 4, bottom: 5, width: 17, height: 17, borderRadius: 9, backgroundColor: '#168B3E', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFF' }, inspectionContent: { flex: 1 }, inspectionTitle: { color: '#195448', fontSize: 16 }, inspectionLand: { color: '#648071', fontSize: 12, marginTop: 2 }, inspectionBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#C9F0CF', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, marginTop: 7 }, inspectionBadgeText: { color: '#28733A', fontSize: 10 }, inspectionDate: { color: '#648071', fontSize: 11, marginTop: 5 }, inspectionDetails: { flexDirection: 'row', alignItems: 'center', gap: 2 }, inspectionDetailsText: { color: '#286652', fontSize: 10 }, complianceCard: { marginTop: 11, borderRadius: 13, backgroundColor: '#FFF3C7', padding: 9, flexDirection: 'row', alignItems: 'center', gap: 8 }, bellCircle: { width: 34, height: 34, borderRadius: 18, backgroundColor: '#FFE29A', alignItems: 'center', justifyContent: 'center' }, complianceText: { flex: 1 }, complianceTitle: { color: '#6A560D', fontSize: 10 }, complianceCaption: { color: '#806D2B', fontSize: 8, lineHeight: 11, marginTop: 2 }, detailsText: { color: '#806300', fontSize: 8 },   activityCard: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2EEE5', overflow: 'hidden' }, activityRow: { minHeight: 49, paddingHorizontal: 9, borderBottomWidth: 1, borderBottomColor: '#EAF1EB', flexDirection: 'row', alignItems: 'center', gap: 8 }, activityIcon: { width: 28, height: 28, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, activityText: { flex: 1 }, activityTitle: { color: '#2A5740', fontSize: 9 }, activityDetail: { color: '#789080', fontSize: 8, marginTop: 1 }, activityTime: { color: '#8AA093', fontSize: 7 }, bottomNav: { height: 61, borderTopWidth: 1, borderTopColor: '#D9E9DC', backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 54, height: 58 }, navLabel: { color: '#648074', fontSize: 8, marginTop: 2 }, navLabelActive: { color: '#168B3E', fontWeight: '700' }, navIndicator: { width: 20, height: 2, borderRadius: 1, backgroundColor: '#168B3E', marginTop: 3 }, pressed: { opacity: 0.8 },
});