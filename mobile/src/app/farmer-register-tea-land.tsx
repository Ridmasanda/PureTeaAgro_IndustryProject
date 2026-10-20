import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Form = {
  landName: string;
  registrationNumber: string;
  address: string;
  district: string;
  area: string;
  ownership: string;
  location: string;
  teaVariety: string;
  bushes: string;
  irrigation: string;
};

const steps = ['Basic Info', 'Size', 'Location', 'Details', 'Submit'];
const districts = ['Nuwara Eliya', 'Kandy', 'Badulla', 'Galle', 'Matara'];
const initialForm: Form = {
  landName: '',
  registrationNumber: '',
  address: '',
  district: '',
  area: '',
  ownership: '',
  location: '',
  teaVariety: '',
  bushes: '',
  irrigation: '',
};

function validateStep(step: number, form: Form) {
  if (step === 0) return Boolean(form.landName.trim() && form.address.trim() && form.district.trim());
  if (step === 1) return Boolean(form.area.trim());
  if (step === 2) return Boolean(form.location.trim());
  return true;
}

export default function FarmerRegisterTeaLandScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initialForm);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const next = () => {
    if (!validateStep(step, form)) {
      setError(step === 0 ? 'Complete the required land information fields.' : 'Please complete the required field before continuing.');
      return;
    }
    setError('');
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
    } else {
      Alert.alert('Tea Land Registered', `${form.landName} has been submitted for verification.`, [{ text: 'View My Lands', onPress: () => router.replace('/farmer-my-tea-lands') }]);
    }
  };

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => step > 0 ? setStep((current) => current - 1) : router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#173F25" />
          </Pressable>
          <ThemedText type="smallBold" style={styles.title}>Register Tea Land</ThemedText>
          <MaterialCommunityIcons name="leaf" size={28} color="#13813C" />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Progress step={step} />
          {step === 0 && <BasicInfo form={form} update={update} districtOpen={districtOpen} setDistrictOpen={setDistrictOpen} />}
          {step === 1 && <SizeInfo form={form} update={update} />}
          {step === 2 && <LocationInfo form={form} update={update} />}
          {step === 3 && <LandDetails form={form} update={update} />}
          {step === 4 && <Review form={form} />}
          {!!error && <ThemedText type="small" style={styles.error}>{error}</ThemedText>}
          <Pressable accessibilityRole="button" onPress={next} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.primaryText}>{step === 4 ? 'Register Tea Land' : 'Next'}</ThemedText>
            <MaterialCommunityIcons name={step === 4 ? 'check' : 'arrow-right'} size={20} color="#FFF" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Progress({ step }: { step: number }) {
  return <View style={styles.progress}>{steps.map((label, index) => <View key={label} style={styles.progressItem}><View style={[styles.stepDot, index <= step && styles.activeDot]}>{index < step ? <MaterialCommunityIcons name="check" size={13} color="#FFF" /> : <ThemedText type="smallBold" style={[styles.dotNumber, index === step && styles.activeNumber]}>{index + 1}</ThemedText>}</View><ThemedText type="small" style={[styles.stepLabel, index === step && styles.activeStepLabel]}>{label}</ThemedText>{index < steps.length - 1 && <View style={[styles.stepLine, index < step && styles.activeLine]} />}</View>)}</View>;
}

function BasicInfo({ form, update, districtOpen, setDistrictOpen }: { form: Form; update: (key: keyof Form, value: string) => void; districtOpen: boolean; setDistrictOpen: (open: boolean) => void }) {
  return <View><SectionTitle title="1. Basic Land Information" /><Field label="Land Name *" placeholder="e.g. Green Valley" value={form.landName} onChangeText={(value) => update('landName', value)} /><Field label="Land Registration Number (if applicable)" placeholder="e.g. REG-12345" value={form.registrationNumber} onChangeText={(value) => update('registrationNumber', value)} /><Field label="Address *" placeholder="e.g. No. 12, Green Lane" value={form.address} onChangeText={(value) => update('address', value)} /><ThemedText type="small" style={styles.fieldLabel}>District *</ThemedText><Pressable onPress={() => setDistrictOpen(!districtOpen)} style={styles.select}><MaterialCommunityIcons name="map-marker-outline" size={18} color="#168B3E" /><ThemedText type="small" style={[styles.selectText, !form.district && styles.placeholder]}>{form.district || 'Select District'}</ThemedText><MaterialCommunityIcons name="chevron-down" size={18} color="#39785B" /></Pressable>{districtOpen && <View style={styles.menu}>{districts.map((district) => <Pressable key={district} onPress={() => { update('district', district); setDistrictOpen(false); }} style={styles.menuItem}><ThemedText type="small">{district}</ThemedText></Pressable>)}</View>}</View>;
}

function SizeInfo({ form, update }: { form: Form; update: (key: keyof Form, value: string) => void }) {
  return <View><SectionTitle title="2. Land Size" /><View style={styles.sizeRow}><View style={styles.sizeInput}><Field label="Land Area *" placeholder="e.g. 6.5" value={form.area} onChangeText={(value) => update('area', value)} keyboardType="decimal-pad" /></View><View style={styles.sizeInput}><ThemedText type="small" style={styles.fieldLabel}>Unit</ThemedText><View style={styles.fixedSelect}><ThemedText type="small" style={styles.selectText}>Hectares (ha)</ThemedText><MaterialCommunityIcons name="chevron-down" size={18} color="#39785B" /></View></View></View><Field label="Ownership Information (optional)" placeholder="e.g. Own / Lease / Family" value={form.ownership} onChangeText={(value) => update('ownership', value)} /></View>;
}

function LocationInfo({ form, update }: { form: Form; update: (key: keyof Form, value: string) => void }) {
  return <View><SectionTitle title="3. Location" /><ThemedText type="small" style={styles.fieldLabel}>GPS Location *</ThemedText><View style={styles.locationValue}><MaterialCommunityIcons name="map-marker" size={18} color="#168B3E" /><ThemedText type="small" style={[styles.selectText, !form.location && styles.placeholder]}>{form.location || 'Location not selected'}</ThemedText></View><Pressable onPress={() => update('location', '6.0535, 80.2210')} style={styles.locationButton}><MaterialCommunityIcons name="crosshairs-gps" size={18} color="#FFF" /><ThemedText type="smallBold" style={styles.locationButtonText}>{form.location ? 'Update GPS Location' : 'Use Current Location'}</ThemedText></Pressable><View style={styles.mapPreview}><MaterialCommunityIcons name="map-outline" size={40} color="#65A96E" /><ThemedText type="small" style={styles.mapText}>{form.location || 'Map preview will appear here'}</ThemedText></View><Pressable onPress={() => form.location && update('location', form.location)} style={styles.confirmRow}><MaterialCommunityIcons name={form.location ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} size={21} color="#168B3E" /><ThemedText type="small" style={styles.confirmText}>I confirm this is the tea land location</ThemedText></Pressable></View>;
}

function LandDetails({ form, update }: { form: Form; update: (key: keyof Form, value: string) => void }) {
  return <View><SectionTitle title="4. Land Details" /><Field label="Tea Variety (optional)" placeholder="e.g. Pekoe / TRI 2025" value={form.teaVariety} onChangeText={(value) => update('teaVariety', value)} /><Field label="Approximate Number of Tea Bushes (optional)" placeholder="e.g. 4500" value={form.bushes} onChangeText={(value) => update('bushes', value)} keyboardType="number-pad" /><Field label="Irrigation Availability (optional)" placeholder="e.g. Rain-fed / Sprinkler" value={form.irrigation} onChangeText={(value) => update('irrigation', value)} /></View>;
}

function Review({ form }: { form: Form }) {
  const rows: [string, string][] = [['Land Name', form.landName], ['Registration No.', form.registrationNumber || 'Not provided'], ['Address', form.address], ['District', form.district], ['Land Area', `${form.area} hectares`], ['GPS Location', form.location], ['Tea Variety', form.teaVariety || 'Not provided'], ['Tea Bushes', form.bushes || 'Not provided'], ['Irrigation', form.irrigation || 'Not provided']];
  return <View><SectionTitle title="5. Review Details" /><View style={styles.reviewCard}>{rows.map(([label, value]) => <View key={label} style={styles.reviewRow}><ThemedText type="small" style={styles.reviewLabel}>{label}</ThemedText><ThemedText type="smallBold" style={styles.reviewValue}>{value}</ThemedText></View>)}</View><View style={styles.notice}><MaterialCommunityIcons name="information-outline" size={18} color="#168B3E" /><ThemedText type="small" style={styles.noticeText}>Your tea land will be reviewed before it becomes active.</ThemedText></View></View>;
}

function SectionTitle({ title }: { title: string }) {
  return <ThemedText type="smallBold" style={styles.sectionTitle}>{title}</ThemedText>;
}

function Field({ label, placeholder, value, onChangeText, keyboardType }: { label: string; placeholder: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'decimal-pad' | 'number-pad' }) {
  return <View style={styles.field}><ThemedText type="small" style={styles.fieldLabel}>{label}</ThemedText><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#8AA4A8" keyboardType={keyboardType} style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.64 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#173F35', fontSize: 18 },
  content: { paddingHorizontal: 14, paddingBottom: 26 },
  progress: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginVertical: 12 },
  progressItem: { flex: 1, alignItems: 'center', position: 'relative' },
  stepDot: { width: 26, height: 26, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2ECEC', zIndex: 1 },
  activeDot: { backgroundColor: '#07863C' },
  dotNumber: { color: '#45656A', fontSize: 11 },
  activeNumber: { color: '#FFF' },
  stepLabel: { color: '#718C8D', fontSize: 8, marginTop: 3 },
  activeStepLabel: { color: '#168B3E', fontWeight: '700' },
  stepLine: { position: 'absolute', top: 12, left: '58%', right: '-42%', height: 1.5, backgroundColor: '#D5E4E1' },
  activeLine: { backgroundColor: '#07863C' },
  sectionTitle: { color: '#1C5142', fontSize: 15, marginTop: 9, marginBottom: 12 },
  field: { marginBottom: 9 },
  fieldLabel: { color: '#527565', fontSize: 10, marginBottom: 4 },
  input: { minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 10, color: '#315945', fontSize: 12 },
  select: { minHeight: 35, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  selectText: { flex: 1, color: '#315945', fontSize: 11 },
  placeholder: { color: '#8AA4A8' },
  menu: { borderWidth: 1, borderColor: '#CFE4D3', borderRadius: 8, backgroundColor: '#FFF', marginTop: 3, overflow: 'hidden' },
  menuItem: { paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EDF5EF' },
  sizeRow: { flexDirection: 'row', gap: 9 },
  sizeInput: { flex: 1 },
  fixedSelect: { minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center' },
  locationValue: { minHeight: 35, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  locationButton: { minHeight: 39, borderRadius: 8, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 9 },
  locationButtonText: { color: '#FFF', fontSize: 11 },
  mapPreview: { height: 105, borderRadius: 9, backgroundColor: '#C8E7C7', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 10 },
  mapText: { color: '#39785B', fontSize: 10 },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 11 },
  confirmText: { color: '#315945', fontSize: 10 },
  reviewCard: { borderRadius: 10, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.92)', padding: 10 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#EDF5EF' },
  reviewLabel: { color: '#6A8980', fontSize: 10 },
  reviewValue: { flex: 1, color: '#315945', fontSize: 10, textAlign: 'right' },
  notice: { marginTop: 11, borderRadius: 9, borderWidth: 1, borderColor: '#8DD39A', backgroundColor: '#E1F8E4', padding: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  noticeText: { color: '#28733A', fontSize: 9, flex: 1 },
  error: { color: '#C0392B', fontSize: 10, marginTop: 10 },
  primaryButton: { minHeight: 41, borderRadius: 22, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 16 },
  primaryText: { color: '#FFF', fontSize: 11 },
  pressed: { opacity: 0.8 },
});
