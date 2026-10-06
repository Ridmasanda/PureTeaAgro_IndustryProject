import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Step = 0 | 1 | 2 | 3 | 4 | 5;

const green = '#087A38';
const paleGreen = '#E9F8EC';

export default function AgrochemicalsScreen() {
  const [step, setStep] = useState<Step | null>(null);
  const [land, setLand] = useState('Green Valley Tea Land');
  const [chemicalType, setChemicalType] = useState<'Fertilizer' | 'Pesticide'>('Fertilizer');
  const [quantity, setQuantity] = useState('5');
  const [date, setDate] = useState('19 Sep 2026');
  const [submitted, setSubmitted] = useState(false);

  if (step !== null) {
    return (
      <RecordFlow
        step={step}
        land={land}
        setLand={setLand}
        chemicalType={chemicalType}
        setChemicalType={setChemicalType}
        quantity={quantity}
        setQuantity={setQuantity}
        date={date}
        setDate={setDate}
        onBack={() => setStep(step === 0 ? null : ((step - 1) as Step))}
        onNext={() => step === 5 ? setSubmitted(true) : setStep((step + 1) as Step)}
        submitted={submitted}
        onClose={() => { setSubmitted(false); setStep(null); }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header title="Agrochemical Overview" />
          <View style={styles.statsGrid}>
            <Stat icon="flask-outline" label="Total Applications" value="5" />
            <Stat icon="calendar-month-outline" label="This Month's Applications" value="2" />
            <Stat icon="clock-outline" label="Pending Verification" value="1" />
            <Stat icon="alert-circle" label="Compliance Alerts" value="0" alert />
          </View>
          <ActionButton icon="plus-circle" label="Record Agrochemical Usage" primary onPress={() => setStep(0)} />
          <ActionButton icon="file-document-outline" label="View Application History" onPress={() => undefined} />
          <ActionButton icon="sprout-outline" label="View Approved Agrochemicals" onPress={() => undefined} />
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={green} />
            <View style={styles.tipCopy}>
              <ThemedText type="smallBold" style={styles.tipTitle}>Keep your records up to date</ThemedText>
              <ThemedText type="small" style={styles.tipText}>Record every application to maintain compliance and traceability.</ThemedText>
            </View>
          </View>
        </ScrollView>
        <BottomNav active="Agrochemicals" />
      </SafeAreaView>
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" onPress={onBack ?? (() => router.back())} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" />
      </Pressable>
      <ThemedText type="smallBold" style={styles.headerTitle}>{title}</ThemedText>
      <MaterialCommunityIcons name="leaf" size={24} color={green} />
    </View>
  );
}

function Stat({ icon, label, value, alert }: { icon: IconName; label: string; value: string; alert?: boolean }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, alert && styles.alertIcon]}>
        <MaterialCommunityIcons name={icon} size={23} color={alert ? '#F04438' : green} />
      </View>
      <View style={styles.statCopy}>
        <ThemedText type="small" style={styles.statLabel}>{label}</ThemedText>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

function ActionButton({ icon, label, primary, onPress }: { icon: IconName; label: string; primary?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.primaryAction, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={22} color={primary ? '#FFF' : green} />
      <ThemedText type="smallBold" style={[styles.actionText, primary && styles.primaryActionText]}>{label}</ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={21} color={primary ? '#FFF' : '#47745C'} />
    </Pressable>
  );
}

function RecordFlow({
  step, land, setLand, chemicalType, setChemicalType, quantity, setQuantity, date, setDate, onBack, onNext, submitted, onClose,
}: {
  step: Step; land: string; setLand: (value: string) => void; chemicalType: 'Fertilizer' | 'Pesticide'; setChemicalType: (value: 'Fertilizer' | 'Pesticide') => void;
  quantity: string; setQuantity: (value: string) => void; date: string; setDate: (value: string) => void; onBack: () => void; onNext: () => void; submitted: boolean; onClose: () => void;
}) {
  if (submitted) {
    return <View style={styles.container}><SafeAreaView style={styles.success}><MaterialCommunityIcons name="check-circle" size={72} color={green} /><ThemedText type="subtitle" style={styles.successTitle}>Record Submitted</ThemedText><ThemedText type="small" style={styles.successText}>Your agrochemical application was submitted for verification.</ThemedText><Pressable onPress={onClose} style={styles.primaryButton}><ThemedText type="smallBold" style={styles.primaryButtonText}>Back to Overview</ThemedText></Pressable></SafeAreaView></View>;
  }

  const titles: Record<Step, string> = { 0: 'Select Tea Land', 1: 'Select Agrochemical', 2: 'Enter Quantity', 3: 'Application Date', 4: 'Additional Details', 5: 'Review & Submit' };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header title={titles[step]} onBack={onBack} />
          <View style={styles.progress}><View style={[styles.progressFill, { width: `${((step + 1) / 6) * 100}%` }]} /></View>
          {step === 0 && <LandStep land={land} setLand={setLand} />}
          {step === 1 && <ChemicalStep chemicalType={chemicalType} setChemicalType={setChemicalType} />}
          {step === 2 && <QuantityStep quantity={quantity} setQuantity={setQuantity} />}
          {step === 3 && <DateStep date={date} setDate={setDate} />}
          {step === 4 && <DetailsStep />}
          {step === 5 && <ReviewStep land={land} chemicalType={chemicalType} quantity={quantity} date={date} />}
          <Pressable accessibilityRole="button" onPress={onNext} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.primaryButtonText}>{step === 5 ? 'Submit Record' : 'Next'}</ThemedText>
            <MaterialCommunityIcons name={step === 5 ? 'send' : 'arrow-right'} size={20} color="#FFF" />
          </Pressable>
          {step > 0 && <Pressable onPress={onBack} style={styles.backLink}><ThemedText type="small" style={styles.backLinkText}>Back</ThemedText></Pressable>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LandStep({ land, setLand }: { land: string; setLand: (value: string) => void }) {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Your tea lands</ThemedText>{['Green Valley Tea Land', 'Hilltop Tea Land'].map((name, index) => <Pressable key={name} onPress={() => setLand(name)} style={[styles.landCard, land === name && styles.selectedCard]}><View style={styles.landImage}><MaterialCommunityIcons name="image-outline" size={30} color="#6BA777" /></View><View style={styles.landCopy}><ThemedText type="smallBold">{name}</ThemedText><ThemedText type="small" style={styles.muted}>{index === 0 ? '6.5 hectares' : '12 hectares'}</ThemedText><View style={styles.sector}><ThemedText type="small" style={styles.sectorText}>{index === 0 ? 'Small Sector' : 'Medium Sector'}</ThemedText></View></View><MaterialCommunityIcons name={land === name ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={land === name ? green : '#B6D8C0'} /></Pressable>)}</View>;
}

function ChemicalStep({ chemicalType, setChemicalType }: { chemicalType: 'Fertilizer' | 'Pesticide'; setChemicalType: (value: 'Fertilizer' | 'Pesticide') => void }) {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Chemical Category</ThemedText><View style={styles.segment}><Pressable onPress={() => setChemicalType('Fertilizer')} style={[styles.segmentItem, chemicalType === 'Fertilizer' && styles.segmentActive]}><ThemedText type="smallBold" style={chemicalType === 'Fertilizer' ? styles.segmentTextActive : styles.muted}>Fertilizer</ThemedText></Pressable><Pressable onPress={() => setChemicalType('Pesticide')} style={[styles.segmentItem, chemicalType === 'Pesticide' && styles.segmentActive]}><ThemedText type="smallBold" style={chemicalType === 'Pesticide' ? styles.segmentTextActive : styles.muted}>Pesticide</ThemedText></Pressable></View><Field label="Chemical Name" value="Product A (Approved)" /><Field label="Product / Brand" value="Brand A" /><Field label="Active Ingredient" value="Active Ingredient A" /><View style={styles.notice}><MaterialCommunityIcons name="shield-check" size={20} color={green} /><ThemedText type="small" style={styles.noticeText}>Only approved chemicals can be selected.</ThemedText></View></View>;
}

function QuantityStep({ quantity, setQuantity }: { quantity: string; setQuantity: (value: string) => void }) {
  return <View style={styles.stepBody}><Field label="Quantity" value={quantity} onChangeText={setQuantity} suffix="kg" /><Field label="Application Area (Optional)" value="" placeholder="e.g. 0.5 hectares" /></View>;
}

function DateStep({ date, setDate }: { date: string; setDate: (value: string) => void }) {
  return <View style={styles.stepBody}><Field label="Application Date" value={date} onChangeText={setDate} icon="calendar-month-outline" /><Field label="Time (Optional)" value="" placeholder="Select time" icon="clock-outline" /></View>;
}

function DetailsStep() {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Purpose of Application</ThemedText><Field label="" value="Disease Control" suffix="⌄" /><ThemedText type="smallBold" style={styles.fieldLabel}>Upload Purchase Receipt</ThemedText><Upload label="Upload Receipt" /><ThemedText type="smallBold" style={styles.fieldLabel}>Upload Chemical Label Photo</ThemedText><Upload label="Upload Label Photo" /><Field label="Notes (Optional)" value="" placeholder="Add any additional notes..." /></View>;
}

function ReviewStep({ land, chemicalType, quantity, date }: { land: string; chemicalType: string; quantity: string; date: string }) {
  return <View style={styles.reviewCard}><ReviewRow icon="map-marker-outline" label="Land" value={land} /><ReviewRow icon="flask-outline" label="Chemical" value={`${chemicalType} • Product A`} /><ReviewRow icon="scale-balance" label="Quantity" value={`${quantity} kg`} /><ReviewRow icon="calendar-month-outline" label="Date" value={date} /><ReviewRow icon="shield-check-outline" label="Purpose" value="Disease Control" /></View>;
}

function ReviewRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.reviewRow}><MaterialCommunityIcons name={icon} size={21} color={green} /><View><ThemedText type="small" style={styles.muted}>{label}</ThemedText><ThemedText type="smallBold">{value}</ThemedText></View></View>;
}

function Field({ label, value, onChangeText, placeholder, suffix, icon }: { label: string; value: string; onChangeText?: (value: string) => void; placeholder?: string; suffix?: string; icon?: IconName }) {
  return <View style={styles.field}><ThemedText type="smallBold" style={styles.fieldLabel}>{label}</ThemedText><View style={styles.inputWrap}>{icon && <MaterialCommunityIcons name={icon} size={20} color="#527568" />}<TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9AB4A6" style={styles.input} /><ThemedText type="small" style={styles.suffix}>{suffix}</ThemedText></View></View>;
}

function Upload({ label }: { label: string }) {
  return <Pressable style={styles.upload}><MaterialCommunityIcons name="cloud-upload-outline" size={23} color={green} /><View><ThemedText type="smallBold">{label}</ThemedText><ThemedText type="small" style={styles.muted}>JPG, PNG or PDF</ThemedText></View></Pressable>;
}

function BottomNav({ active }: { active: string }) {
  const items: [IconName, string][] = [['home', 'Home'], ['map-outline', 'My Lands'], ['flask-outline', 'Agrochemicals'], ['bell-outline', 'Notifications'], ['account-outline', 'Profile']];
  return <View style={styles.bottomNav}>{items.map(([icon, label]) => <Pressable key={label} onPress={label === 'Home' ? () => router.replace('/farmer-dashboard') : undefined} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={label === active ? green : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, label === active && styles.navLabelActive]}>{label}</ThemedText></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 34, height: 34, justifyContent: 'center' },
  headerTitle: { color: '#173F25', fontSize: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  stat: { width: '48%', minHeight: 82, borderWidth: 1, borderColor: '#CFE8D5', borderRadius: 12, backgroundColor: '#FBFFFC', padding: 11, flexDirection: 'row', alignItems: 'center', gap: 9 },
  statIcon: { width: 34, height: 34, borderRadius: 18, backgroundColor: '#DDF6E2', justifyContent: 'center', alignItems: 'center' },
  alertIcon: { backgroundColor: '#FFE3DF' },
  statCopy: { flex: 1 },
  statLabel: { color: '#597467', fontSize: 10, lineHeight: 13 },
  statValue: { color: '#123F2C', fontWeight: '700', fontSize: 20, lineHeight: 25 },
  action: { minHeight: 48, borderWidth: 1, borderColor: '#B8DCC2', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12, marginTop: 10, backgroundColor: '#FAFFFB' },
  primaryAction: { backgroundColor: green, borderColor: green },
  actionText: { color: '#2D5C49', flex: 1 },
  primaryActionText: { color: '#FFF' },
  tipCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 12, backgroundColor: paleGreen, marginTop: 22, alignItems: 'center' },
  tipCopy: { flex: 1 },
  tipTitle: { color: '#1C5635' },
  tipText: { color: '#5A7868', fontSize: 12, lineHeight: 17 },
  bottomNav: { height: 67, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', gap: 2, minWidth: 58 },
  navLabel: { color: '#58776A', fontSize: 10 },
  navLabelActive: { color: green, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  progress: { height: 5, backgroundColor: '#DCEDE0', borderRadius: 3, marginBottom: 22 },
  progressFill: { height: 5, backgroundColor: green, borderRadius: 3 },
  stepBody: { gap: 12, minHeight: 360 },
  fieldLabel: { color: '#315D4A', fontSize: 12, marginBottom: -4 },
  landCard: { borderWidth: 1, borderColor: '#D4E9D9', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF' },
  selectedCard: { borderColor: green, backgroundColor: '#F3FFF5' },
  landImage: { width: 62, height: 62, borderRadius: 9, backgroundColor: '#DCEED7', alignItems: 'center', justifyContent: 'center' },
  landCopy: { flex: 1, gap: 2 },
  muted: { color: '#6E8B7C', fontSize: 12 },
  sector: { backgroundColor: '#DDF5E1', borderRadius: 10, paddingHorizontal: 8, alignSelf: 'flex-start' },
  sectorText: { color: green, fontSize: 10 },
  segment: { flexDirection: 'row', gap: 6 },
  segmentItem: { flex: 1, height: 43, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: green, borderColor: green },
  segmentTextActive: { color: '#FFF' },
  field: { gap: 5 },
  inputWrap: { minHeight: 45, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, color: '#244B39', fontSize: 13, paddingVertical: 10 },
  suffix: { color: '#527568' },
  notice: { backgroundColor: '#E5F9E4', borderRadius: 9, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  noticeText: { color: '#2E6842', fontSize: 12 },
  upload: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#B6DCC1', borderRadius: 9, minHeight: 57, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FAFFFB' },
  reviewCard: { borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 14, marginBottom: 20 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8F2EA' },
  primaryButton: { minHeight: 46, borderRadius: 24, backgroundColor: green, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryButtonText: { color: '#FFF' },
  backLink: { alignSelf: 'center', padding: 12 },
  backLinkText: { color: '#467260' },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  successTitle: { color: '#173F25', textAlign: 'center', marginTop: 16 },
  successText: { color: '#597467', textAlign: 'center', marginTop: 8, marginBottom: 26 },
});
