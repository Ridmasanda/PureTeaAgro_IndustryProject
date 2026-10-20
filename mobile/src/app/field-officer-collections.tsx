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

const qualities = [
  { label: 'Good', icon: 'leaf' as IconName, color: '#008F5A' },
  { label: 'Average', icon: 'leaf' as IconName, color: '#F2A400' },
  { label: 'Poor', icon: 'leaf' as IconName, color: '#F04768' },
];

function CollectionField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  trailing = 'chevron-down',
  noTrailing = false,
}: {
  label: string;
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  trailing?: IconName;
  noTrailing?: boolean;
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
        {!noTrailing && <MaterialCommunityIcons name={trailing} size={16} color="#23845C" />}
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

export default function FieldOfficerCollectionsScreen() {
  const [farmer, setFarmer] = useState('');
  const [land, setLand] = useState('');
  const [date, setDate] = useState('02 Oct 2026');
  const [time, setTime] = useState('10:30 AM');
  const [weight, setWeight] = useState('245');
  const [vehicle, setVehicle] = useState('');
  const [collector, setCollector] = useState('');
  const [remarks, setRemarks] = useState('');
  const [quality, setQuality] = useState('Good');

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
                <ThemedText type="smallBold" style={styles.headerTitle}>Record Leaf Collection</ThemedText>
                <ThemedText style={styles.headerBrand}>PureTeaAgro</ThemedText>
              </View>

              <CollectionField icon="account-outline" label="Farmer" placeholder="Select Farmer" value={farmer} onChangeText={setFarmer} />
              <CollectionField icon="leaf" label="Tea Land" placeholder="Select Land" value={land} onChangeText={setLand} />

              <View style={styles.inlineFields}>
                <View style={styles.inlineFieldWide}>
                  <CollectionField icon="calendar-outline" label="Date & Time" placeholder="Date" value={date} onChangeText={setDate} trailing="calendar-outline" />
                </View>
                <View style={styles.timeField}>
                  <View style={styles.fieldSpacer} />
                  <View style={styles.field}>
                    <TextInput accessibilityLabel="Time" onChangeText={setTime} style={styles.fieldInput} value={time} />
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#23845C" />
                  </View>
                </View>
              </View>

              <View style={styles.weightGroup}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  <MaterialCommunityIcons name="weight-gram" size={12} color="#14774D" /> Green Leaf Weight
                </ThemedText>
                <View style={styles.weightField}>
                  <TextInput accessibilityLabel="Green Leaf Weight" keyboardType="decimal-pad" onChangeText={setWeight} style={styles.weightInput} value={weight} />
                  <ThemedText style={styles.unit}>kg</ThemedText>
                </View>
              </View>

              <ThemedText type="smallBold" style={styles.fieldLabel}>
                <MaterialCommunityIcons name="leaf" size={12} color="#14774D" /> Leaf Quality
              </ThemedText>
              <View style={styles.qualityRow}>
                {qualities.map((item) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityLabel={item.label}
                    accessibilityState={{ selected: quality === item.label }}
                    key={item.label}
                    onPress={() => setQuality(item.label)}
                    style={[styles.qualityCard, quality === item.label && styles.qualitySelected]}>
                    <MaterialCommunityIcons name={item.icon} size={17} color={item.color} />
                    <ThemedText style={styles.qualityText}>{item.label}</ThemedText>
                    <View style={[styles.qualityRadio, quality === item.label && { backgroundColor: item.color, borderColor: item.color }]}>
                      {quality === item.label && <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                ))}
              </View>

              <CollectionField icon="truck-outline" label="Vehicle Number" placeholder="Enter vehicle number (e.g. KA-1234)" value={vehicle} onChangeText={setVehicle} noTrailing />
              <CollectionField icon="account-outline" label="Collector" placeholder="Select Collector" value={collector} onChangeText={setCollector} />

              <View style={styles.remarksGroup}>
                <ThemedText type="smallBold" style={styles.fieldLabel}>
                  <MaterialCommunityIcons name="comment-outline" size={12} color="#14774D" /> Remarks
                </ThemedText>
                <TextInput
                  accessibilityLabel="Remarks"
                  multiline
                  onChangeText={setRemarks}
                  placeholder="Add any notes (optional)"
                  placeholderTextColor="#98AAB2"
                  style={styles.remarks}
                  value={remarks}
                />
              </View>
            </ScrollView>

            <Pressable
              accessibilityLabel="Save Collection"
              accessibilityRole="button"
              onPress={() => router.push('/field-officer-collection-history')}
              style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="content-save-outline" size={17} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.saveText}>Save Collection</ThemedText>
            </Pressable>

            <View style={styles.bottomNavigation}>
              <BottomTab icon="home" label="Home" onPress={() => router.push('./field-officer-dashboard')} />
              <BottomTab icon="account-group-outline" label="Farmers" onPress={() => router.push('./field-officer-farmers')} />
              <BottomTab icon="leaf" label="Collections" active />
              <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
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
  headerTitle: { flex: 1, color: '#1C3444', fontSize: 13, lineHeight: 18, marginLeft: 3 },
  headerBrand: { color: '#5AA486', fontSize: 7, lineHeight: 10 },
  fieldGroup: { marginHorizontal: 14, marginTop: 6 },
  fieldLabel: { color: '#234A3B', fontSize: 8, lineHeight: 12, marginBottom: 4 },
  field: { height: 31, borderRadius: 8, borderWidth: 1, borderColor: '#B8EED0', backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  fieldInput: { flex: 1, color: '#324D52', fontSize: 9, lineHeight: 13, paddingVertical: 0 },
  inlineFields: { flexDirection: 'row', marginHorizontal: 14, gap: 8 },
  inlineFieldWide: { flex: 1.25, marginHorizontal: 0 },
  timeField: { flex: 0.85, marginTop: 6 },
  fieldSpacer: { height: 16 },
  weightGroup: { marginHorizontal: 14, marginTop: 7 },
  weightField: { height: 31, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  weightInput: { flex: 1, color: '#324D52', fontSize: 9 },
  unit: { color: '#879CA5', fontSize: 9, backgroundColor: '#F1F5F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  qualityRow: { flexDirection: 'row', gap: 7, marginHorizontal: 14, marginTop: 3 },
  qualityCard: { flex: 1, height: 49, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  qualitySelected: { borderWidth: 1.5, borderColor: '#00A66F', backgroundColor: 'rgba(238,255,246,0.9)' },
  qualityText: { color: '#405E56', fontSize: 8, lineHeight: 11, marginTop: 3 },
  qualityRadio: { position: 'absolute', right: 5, top: 5, width: 11, height: 11, borderRadius: 6, borderWidth: 1, borderColor: '#D2DEE0', alignItems: 'center', justifyContent: 'center' },
  remarksGroup: { marginHorizontal: 14, marginTop: 6 },
  remarks: { height: 45, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.94)', padding: 10, textAlignVertical: 'top', color: '#324D52', fontSize: 9 },
  saveButton: { height: 36, marginHorizontal: 14, marginBottom: 7, borderRadius: 8, backgroundColor: '#056D31', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  saveText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  pressed: { opacity: 0.82 },
  bottomNavigation: { height: 55, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#E4E8E6', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 45 },
  bottomLabel: { color: '#8C9AA8', fontSize: 7, lineHeight: 10 },
  bottomLabelActive: { color: '#087A4A', fontWeight: '700' },
});
