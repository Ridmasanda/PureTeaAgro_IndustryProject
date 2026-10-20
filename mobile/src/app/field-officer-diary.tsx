import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const workTypes: { label: string; icon: IconName }[] = [
  { label: 'Plucking', icon: 'leaf' },
  { label: 'Pruning', icon: 'content-cut' },
  { label: 'Fertilizer\nApplication', icon: 'beaker-outline' },
  { label: 'Chemical\nApplication', icon: 'flask-outline' },
  { label: 'Weed Control', icon: 'sprout-outline' },
  { label: 'Soil / Water\nManagement', icon: 'water-outline' },
  { label: 'Other', icon: 'dots-horizontal' },
];

function DiaryField({
  label,
  placeholder,
  value,
  icon,
  onChangeText,
  trailing,
}: {
  label: string;
  placeholder: string;
  value: string;
  icon: IconName;
  onChangeText?: (value: string) => void;
  trailing?: IconName;
}) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="smallBold" style={styles.fieldLabel}>
        <MaterialCommunityIcons name={icon} size={12} color="#14774D" /> {label}
      </ThemedText>
      <View style={styles.field}>
        <TextInput
          accessibilityLabel={label}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#98AAB2"
          style={styles.fieldInput}
          value={value}
        />
        {trailing && <MaterialCommunityIcons name={trailing} size={16} color="#23845C" />}
      </View>
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
      <MaterialCommunityIcons name={icon} size={17} color={active ? '#087A4A' : '#8C9AA8'} />
      <ThemedText style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

export default function FieldOfficerDiaryScreen() {
  const [date, setDate] = useState('02 Oct 2026');
  const [farmer, setFarmer] = useState('');
  const [land, setLand] = useState('');
  const [hours, setHours] = useState('6');
  const [workers, setWorkers] = useState('12');
  const [remarks, setRemarks] = useState('');
  const [selectedWork, setSelectedWork] = useState('Plucking');

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
          <View style={styles.page}>
            <ScrollView
              bounces={false}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
                  <MaterialCommunityIcons name="arrow-left" size={21} color="#16834B" />
                </Pressable>
                <ThemedText type="smallBold" style={styles.headerTitle}>Field Diary</ThemedText>
                <ThemedText style={styles.headerBrand}>PureTeaAgro</ThemedText>
              </View>

              <DiaryField
                icon="calendar-outline"
                label="Date"
                placeholder="Date"
                trailing="calendar-outline"
                value={date}
                onChangeText={setDate}
              />
              <DiaryField
                icon="account-outline"
                label="Farmer"
                placeholder="Select Farmer"
                trailing="chevron-down"
                value={farmer}
                onChangeText={setFarmer}
              />
              <DiaryField
                icon="leaf"
                label="Tea Land"
                placeholder="Select Land"
                trailing="chevron-down"
                value={land}
                onChangeText={setLand}
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={12} color="#14774D" /> Today's Field Work
              </ThemedText>
              <View style={styles.workGrid}>
                {workTypes.map((work) => (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={work.label.replace('\n', ' ')}
                    accessibilityState={{ checked: selectedWork === work.label }}
                    key={work.label}
                    onPress={() => setSelectedWork(work.label)}
                    style={[styles.workCard, selectedWork === work.label && styles.workCardSelected]}>
                    <MaterialCommunityIcons name={work.icon} size={16} color="#159467" />
                    <ThemedText style={styles.workText}>{work.label}</ThemedText>
                    <View style={[styles.workCheckbox, selectedWork === work.label && styles.workCheckboxSelected]}>
                      {selectedWork === work.label && <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.inlineFields}>
                <View style={styles.inlineField}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="account-group-outline" size={12} color="#14774D" /> Workers
                  </ThemedText>
                  <TextInput accessibilityLabel="Workers" keyboardType="number-pad" onChangeText={setWorkers} style={styles.inlineInput} value={workers} />
                </View>
                <View style={styles.inlineField}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color="#14774D" /> Working Hours
                  </ThemedText>
                  <TextInput accessibilityLabel="Working Hours" keyboardType="decimal-pad" onChangeText={setHours} style={styles.inlineInput} value={hours} />
                </View>
              </View>

              <DiaryField
                icon="comment-outline"
                label="Remarks"
                placeholder="Add any additional notes..."
                value={remarks}
                onChangeText={setRemarks}
              />
            </ScrollView>

            <Pressable
              accessibilityLabel="Save Field Diary"
              accessibilityRole="button"
              onPress={() => router.push('/field-officer-diary-success')}
              style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="content-save-outline" size={17} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.saveText}>Save Field Diary</ThemedText>
            </Pressable>

            <View style={styles.bottomNavigation}>
              <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
              <BottomTab icon="account-group-outline" label="Farmers" onPress={() => router.push('./field-officer-farmers')} />
              <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
              <BottomTab icon="clipboard-text-outline" label="Diary" active onPress={() => router.push('./field-officer-diary-history')} />
              <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.3)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  keyboard: { flex: 1 },
  page: { flex: 1 },
  content: { paddingBottom: 10 },
  header: { height: 53, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, backgroundColor: 'rgba(250,255,251,0.74)' },
  backButton: { width: 29, height: 29, justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#1C3444', fontSize: 14, lineHeight: 19, marginLeft: 3 },
  headerBrand: { color: '#5AA486', fontSize: 7, lineHeight: 10 },
  fieldGroup: { marginHorizontal: 14, marginTop: 5 },
  fieldLabel: { color: '#234A3B', fontSize: 8, lineHeight: 12, marginBottom: 4 },
  field: { height: 31, borderRadius: 8, borderWidth: 1, borderColor: '#B8EED0', backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  fieldInput: { flex: 1, color: '#324D52', fontSize: 9, lineHeight: 13, paddingVertical: 0 },
  sectionTitle: { color: '#234A3B', fontSize: 8, lineHeight: 12, marginHorizontal: 14, marginTop: 9, marginBottom: 5 },
  workGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 7, marginHorizontal: 14 },
  workCard: { width: '48.5%', minHeight: 37, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  workCardSelected: { borderWidth: 1, borderColor: '#00A66F', backgroundColor: 'rgba(238,255,246,0.9)' },
  workText: { flex: 1, color: '#536C65', fontSize: 8, lineHeight: 10, marginLeft: 7 },
  workCheckbox: { width: 12, height: 12, borderRadius: 3, borderWidth: 1, borderColor: '#D1DDE0' },
  workCheckboxSelected: { borderColor: '#159467', backgroundColor: '#159467', alignItems: 'center', justifyContent: 'center' },
  inlineFields: { flexDirection: 'row', gap: 8, marginHorizontal: 14, marginTop: 8 },
  inlineField: { flex: 1 },
  inlineInput: { height: 30, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 10, color: '#324D52', fontSize: 9 },
  saveButton: { height: 36, marginHorizontal: 14, marginBottom: 7, borderRadius: 8, backgroundColor: '#056D31', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  saveText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  pressed: { opacity: 0.82 },
  bottomNavigation: { height: 55, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 45 },
  bottomLabel: { color: '#8C9AA8', fontSize: 7, lineHeight: 10 },
  bottomLabelActive: { color: '#087A4A', fontWeight: '700' },
});
