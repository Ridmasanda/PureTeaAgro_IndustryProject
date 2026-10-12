import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Screen = 'history' | 'details' | 'findings' | 'evidence' | 'timeline' | 'followUp';

const inspections = [
  ['Inspection #001', '18 Sep 2026', 'Completed', 'green'],
  ['Inspection #002', '10 Sep 2026', 'In Progress', 'blue'],
  ['Inspection #003', '02 Sep 2026', 'Scheduled', 'yellow'],
  ['Inspection #004', '25 Aug 2026', 'Follow-up Required', 'red'],
] as const;

export default function InspectionStatusScreen() {
  const [screen, setScreen] = useState<Screen>('history');
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header title={titles[screen]} onBack={screen === 'history' ? () => router.back() : screen === 'details' ? () => setScreen('history') : () => setScreen('details')} />
          {screen === 'history' && <History onSelect={() => setScreen('details')} />}
          {screen === 'details' && <Details onFindings={() => setScreen('findings')} onEvidence={() => setScreen('evidence')} onTimeline={() => setScreen('timeline')} onFollowUp={() => setScreen('followUp')} />}
          {screen === 'findings' && <Findings onBack={() => setScreen('details')} />}
          {screen === 'evidence' && <Evidence onBack={() => setScreen('details')} />}
          {screen === 'timeline' && <Timeline onNext={() => setScreen('followUp')} />}
          {screen === 'followUp' && <FollowUp />}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const titles: Record<Screen, string> = { history: 'Inspection Status', details: 'Inspection Details', findings: 'Inspector Findings', evidence: 'Inspection Evidence', timeline: 'Inspection Timeline', followUp: 'Inspection Status' };

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return <View style={styles.header}><Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.back}><MaterialCommunityIcons name="arrow-left" size={22} color="#173F25" /></Pressable><ThemedText type="smallBold" style={styles.headerTitle}>{title}</ThemedText><Image source={require('@/assets/images/icon.png')} style={styles.headerLogo} resizeMode="contain" /></View>;
}

function History({ onSelect }: { onSelect: () => void }) {
  return <><ThemedText type="smallBold" style={styles.sectionTitle}>Inspection History</ThemedText><View style={styles.card}>{inspections.map(([name, date, status, tone]) => <Pressable key={name} onPress={onSelect} style={styles.historyRow}><View style={[styles.statusIcon, styles[`${tone}Soft` as keyof typeof styles] as object]}><MaterialCommunityIcons name="file-document-check-outline" size={19} color={tone === 'red' ? '#D62D36' : tone === 'yellow' ? '#B07A00' : tone === 'blue' ? '#168AC8' : '#168B3E'} /></View><View style={styles.rowCopy}><ThemedText type="smallBold" style={styles.rowTitle}>{name}</ThemedText><ThemedText type="small" style={styles.rowDate}>{date}</ThemedText><View style={[styles.statusBadge, styles[`${tone}Badge` as keyof typeof styles] as object]}><ThemedText type="smallBold" style={styles.statusText}>{status}</ThemedText></View></View><MaterialCommunityIcons name="chevron-right" size={20} color="#39785B" /></Pressable>)}</View></>;
}

function Details({ onFindings, onEvidence, onTimeline, onFollowUp }: { onFindings: () => void; onEvidence: () => void; onTimeline: () => void; onFollowUp: () => void }) {
  return <><View style={styles.inspectionSummary}><View style={styles.largeIcon}><MaterialCommunityIcons name="file-document-check-outline" size={28} color="#168B3E" /></View><View style={styles.summaryCopy}><View style={styles.summaryTop}><ThemedText type="smallBold" style={styles.rowTitle}>Inspection #001</ThemedText><ThemedText type="smallBold" style={styles.completed}>Completed</ThemedText></View><Info icon="home-outline" label="Land" value="Green Valley Tea Land" /><Info icon="account-outline" label="Inspector" value="Assigned Officer" /><Info icon="calendar-outline" label="Date" value="18 Sep 2026" /></View></View><ThemedText type="smallBold" style={styles.sectionTitle}>Inspection Summary</ThemedText><View style={styles.card}><InfoRow icon="file-check-outline" label="Inspector Findings" value="All good" onPress={onFindings} /><InfoRow icon="shield-check-outline" label="Compliance Status" value="Compliant" onPress={onFindings} /><InfoRow icon="check-circle-outline" label="Corrective Actions" value="None required" /><InfoRow icon="image-multiple-outline" label="Submitted Evidence" value="3 photos, 1 document" onPress={onEvidence} /><InfoRow icon="calendar-clock-outline" label="Follow-up Date" value="Not required" onPress={onFollowUp} /><InfoRow icon="timeline-clock-outline" label="Inspection Timeline" value="View inspection progress" onPress={onTimeline} /></View><ActionButton label="View Evidence" onPress={onEvidence} /></>;
}

function Findings({ onBack }: { onBack: () => void }) {
  return <><View style={styles.inspectionSummary}><View style={styles.largeIcon}><MaterialCommunityIcons name="account-hard-hat" size={28} color="#168B3E" /></View><View><ThemedText type="smallBold" style={styles.rowTitle}>Inspector Report</ThemedText><ThemedText type="small" style={styles.rowDate}>Land inspection completed</ThemedText></View></View><ThemedText type="smallBold" style={styles.sectionTitle}>Key Findings</ThemedText><View style={styles.card}>{['Land condition is good', 'No illegal chemical usage', 'Records are properly maintained'].map((item) => <View key={item} style={styles.finding}><MaterialCommunityIcons name="check-circle" size={16} color="#168B3E" /><ThemedText type="small" style={styles.rowTitle}>{item}</ThemedText></View>)}</View><View style={styles.compliance}><MaterialCommunityIcons name="leaf" size={38} color="#168B3E" /><View style={styles.rowCopy}><ThemedText type="small" style={styles.rowDate}>Compliance Status</ThemedText><ThemedText type="smallBold" style={styles.compliant}>Compliant</ThemedText></View><MaterialCommunityIcons name="check-circle" size={22} color="#168B3E" /></View><ActionButton label="Back" onPress={onBack} /></>;
}

function Evidence({ onBack }: { onBack: () => void }) {
  return <><View style={styles.evidenceGrid}>{['Landscape', 'Tea Leaves', 'Document', 'Inspection'].map((label) => <View key={label} style={styles.evidenceTile}><View style={styles.evidenceImage}><MaterialCommunityIcons name={label === 'Document' ? 'file-document-outline' : 'image-outline'} size={32} color="#168B3E" /></View><ThemedText type="small" style={styles.evidenceLabel}>{label}</ThemedText></View>)}</View><ThemedText type="smallBold" style={styles.sectionTitle}>Evidence</ThemedText><View style={styles.card}><InfoRow icon="camera-outline" label="Photos" value="3" /><InfoRow icon="file-document-outline" label="Documents" value="1" /></View><ActionButton label="Back" onPress={onBack} /></>;
}

function Timeline({ onNext }: { onNext: () => void }) {
  const steps: [IconName, string, string, string][] = [['calendar-check-outline', 'Scheduled', '15 Sep 2026  10:00 AM', 'green'], ['progress-clock', 'In Progress', '18 Sep 2026  09:30 AM', 'blue'], ['check-circle', 'Completed', '18 Sep 2026  02:15 PM', 'green'], ['alert-circle-outline', 'Follow-up Required', '-', 'red']];
  return <><View style={styles.timeline}>{steps.map(([icon, label, date, tone], index) => <View key={label} style={styles.timelineRow}><View style={[styles.timelineIcon, styles[`${tone}Icon` as keyof typeof styles] as object]}><MaterialCommunityIcons name={icon} size={16} color="#FFF" /></View><View style={[styles.timelineLine, index === steps.length - 1 && styles.hidden]} /><View style={[styles.timelineCopy, label === 'Completed' && styles.completedRow]}><ThemedText type="smallBold" style={styles.rowTitle}>{label}</ThemedText><ThemedText type="small" style={styles.rowDate}>{date}</ThemedText></View></View>)}</View><ActionButton label="View Follow-up Status" onPress={onNext} /></>;
}

function FollowUp() {
  return <><View style={styles.followUp}><MaterialCommunityIcons name="alert-circle" size={42} color="#E34B4B" /><View style={styles.rowCopy}><ThemedText type="smallBold" style={styles.followTitle}>Follow-up Required</ThemedText><ThemedText type="small" style={styles.rowDate}>Some issues need to be addressed for the next inspection.</ThemedText></View></View><ThemedText type="smallBold" style={styles.sectionTitle}>Next Steps</ThemedText><View style={styles.card}><InfoRow icon="file-search-outline" label="Review" value="Inspector comments" /><InfoRow icon="check-decagram-outline" label="Actions" value="Take corrective actions" /><InfoRow icon="file-edit-outline" label="Records" value="Update records" /></View><ActionButton label="View Details" onPress={() => undefined} outline /></>;
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.infoLine}><MaterialCommunityIcons name={icon} size={15} color="#168B3E" /><ThemedText type="small" style={styles.infoLabel}>{label}</ThemedText><ThemedText type="small" style={styles.infoValue}>{value}</ThemedText></View>;
}

function InfoRow({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress?: () => void }) {
  const content = <View style={styles.infoRow}><View style={styles.statusIcon}><MaterialCommunityIcons name={icon} size={17} color="#168B3E" /></View><View style={styles.rowCopy}><ThemedText type="small" style={styles.rowTitle}>{label}</ThemedText><ThemedText type="small" style={styles.rowDate}>{value}</ThemedText></View><MaterialCommunityIcons name="chevron-right" size={18} color="#39785B" /></View>;
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress}>{content}</Pressable> : content;
}

function ActionButton({ label, onPress, outline = false }: { label: string; onPress: () => void; outline?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.actionButton, outline && styles.actionButtonOutline]}><ThemedText type="smallBold" style={[styles.actionButtonText, outline && styles.actionButtonOutlineText]}>{label}</ThemedText></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 }, safeArea: { flex: 1 }, content: { paddingHorizontal: 14, paddingBottom: 24 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' }, headerTitle: { color: '#173F25', fontSize: 16 }, headerLogo: { width: 34, height: 34 }, sectionTitle: { color: '#195436', fontSize: 14, marginBottom: 9, marginTop: 7 }, card: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', overflow: 'hidden', marginBottom: 14 }, historyRow: { minHeight: 74, padding: 10, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 8 }, statusIcon: { width: 34, height: 34, borderRadius: 18, backgroundColor: '#E5F7E8', alignItems: 'center', justifyContent: 'center' }, rowCopy: { flex: 1 }, rowTitle: { color: '#315945', fontSize: 11 }, rowDate: { color: '#789080', fontSize: 10, marginTop: 2 }, statusBadge: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 3 }, greenSoft: { backgroundColor: '#DDF5E1' }, blueSoft: { backgroundColor: '#D9F1FF' }, yellowSoft: { backgroundColor: '#FFF1C2' }, redSoft: { backgroundColor: '#FFE1E1' }, greenBadge: { backgroundColor: '#C9F0CF' }, blueBadge: { backgroundColor: '#D9F1FF' }, yellowBadge: { backgroundColor: '#FFF1C2' }, redBadge: { backgroundColor: '#FFD2D2' }, statusText: { color: '#28733A', fontSize: 9 }, inspectionSummary: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, borderWidth: 1, borderColor: '#D4E9D9', padding: 12, flexDirection: 'row', gap: 10, marginBottom: 8 }, largeIcon: { width: 44, height: 44, borderRadius: 23, backgroundColor: '#DDF5E1', alignItems: 'center', justifyContent: 'center' }, summaryCopy: { flex: 1 }, summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, completed: { color: '#168B3E', backgroundColor: '#C9F0CF', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, fontSize: 9 }, infoLine: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }, infoLabel: { color: '#789080', fontSize: 9, width: 48 }, infoValue: { color: '#315945', fontSize: 9, flex: 1 }, infoRow: { minHeight: 51, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#E6F1E8', flexDirection: 'row', alignItems: 'center', gap: 8 }, finding: { minHeight: 42, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }, compliance: { marginTop: 8, marginBottom: 13, borderRadius: 13, padding: 14, backgroundColor: 'rgba(219,250,224,0.92)', flexDirection: 'row', alignItems: 'center', gap: 10 }, compliant: { color: '#168B3E', fontSize: 18 }, evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 12 }, evidenceTile: { width: '48.5%', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 12, padding: 7, borderWidth: 1, borderColor: '#D4E9D9' }, evidenceImage: { height: 76, borderRadius: 8, backgroundColor: '#DFF3FA', alignItems: 'center', justifyContent: 'center' }, evidenceLabel: { color: '#315945', fontSize: 10, marginTop: 4 }, timeline: { marginBottom: 14 }, timelineRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', position: 'relative' }, timelineIcon: { width: 34, height: 34, borderRadius: 18, alignItems: 'center', justifyContent: 'center', zIndex: 1 }, greenIcon: { backgroundColor: '#168B3E' }, blueIcon: { backgroundColor: '#218FD6' }, redIcon: { backgroundColor: '#E51E5A' }, timelineLine: { position: 'absolute', left: 16, top: 34, width: 2, height: 68, backgroundColor: '#B7DEC0' }, hidden: { opacity: 0 }, timelineCopy: { flex: 1, marginLeft: 12, padding: 8 }, completedRow: { backgroundColor: 'rgba(219,250,224,0.92)', borderRadius: 12 }, followUp: { borderWidth: 1, borderColor: '#F0A3A3', backgroundColor: 'rgba(255,241,241,0.94)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }, followTitle: { color: '#D52C2C', fontSize: 14 }, actionButton: { minHeight: 45, borderRadius: 23, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center', marginTop: 8 }, actionButtonText: { color: '#FFF', fontSize: 11 }, actionButtonOutline: { backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: '#168B3E' }, actionButtonOutlineText: { color: '#168B3E' },
});
