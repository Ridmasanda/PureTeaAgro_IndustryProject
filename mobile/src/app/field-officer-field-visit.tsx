import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
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

const purposes = [
  { label: 'Routine Visit', icon: 'leaf' as const },
  { label: 'Plucking Check', icon: 'content-cut' as const },
  { label: 'Crop Quality Check', icon: 'shield-check-outline' as const },
  { label: 'Agrochemical Check', icon: 'flask-outline' as const },
  { label: 'Land Maintenance Check', icon: 'chart-bar' as const },
  { label: 'Other', icon: 'dots-horizontal' as const },
];

function SelectInput({
  placeholder,
  value,
  onPress,
}: {
  placeholder: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={value ?? placeholder} onPress={onPress} style={styles.selectInput}>
      <ThemedText style={[styles.selectText, !value && styles.placeholderText]}>{value ?? placeholder}</ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={18} color="#97AAB5" />
    </Pressable>
  );
}

export default function FieldOfficerFieldVisitScreen() {
  const params = useLocalSearchParams<{ name?: string; id?: string; area?: string }>();
  const [purpose, setPurpose] = useState('Routine Visit');
  const [findings, setFindings] = useState('');
  const [issues, setIssues] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [photos, setPhotos] = useState(2);

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
                  <MaterialCommunityIcons name="arrow-left" size={21} color="#233A4B" />
                </Pressable>
                <ThemedText type="smallBold" style={styles.headerTitle}>Field Visit</ThemedText>
                <ThemedText style={styles.headerBrand}>PureTeaAgro</ThemedText>
              </View>

              <View style={styles.farmerHeader}>
                <View style={styles.farmerAvatar}>
                  <MaterialCommunityIcons name="account" size={30} color="#0A7044" />
                </View>
                <View style={styles.farmerCopy}>
                  <ThemedText type="smallBold" style={styles.farmerName}>{params.name ?? 'Nimal Perera'}</ThemedText>
                  <ThemedText style={styles.farmerId}>Farmer ID: {params.id ?? 'FRM-0021'}</ThemedText>
                </View>
                <View style={styles.sectorBadge}><ThemedText style={styles.sectorText}>Small Sector</ThemedText></View>
              </View>

              <View style={styles.visitMeta}>
                <MetaItem icon="leaf" label="TEA LAND" value="Kandy Estate" />
                <MetaItem icon="calendar-outline" label="VISIT DATE" value="12 Sep 2026" />
                <MetaItem icon="target" label="VISIT PURPOSE" value="Routine Check" />
              </View>

              <ThemedText type="smallBold" style={styles.sectionTitle}>Select Visit Purpose</ThemedText>
              <View style={styles.purposeGrid}>
                {purposes.map((item) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    key={item.label}
                    onPress={() => setPurpose(item.label)}
                    style={[styles.purposeCard, purpose === item.label && styles.purposeCardSelected]}>
                    <MaterialCommunityIcons name={item.icon} size={17} color={purpose === item.label ? '#008D5A' : '#1D9A68'} />
                    <ThemedText style={styles.purposeText}>{item.label}</ThemedText>
                  </Pressable>
                ))}
              </View>

              <ThemedText type="smallBold" style={styles.sectionTitle}>Findings</ThemedText>
              <SelectInput placeholder="Add your findings..." value={findings} onPress={() => setFindings('Tea plants are growing well')} />
              <ThemedText type="smallBold" style={styles.sectionTitle}>Issues Observed</ThemedText>
              <SelectInput placeholder="Select Issues (optional)" value={issues} onPress={() => setIssues('No issues observed')} />
              <ThemedText type="smallBold" style={styles.sectionTitle}>Recommendations</ThemedText>
              <SelectInput placeholder="Add recommendations..." value={recommendations} onPress={() => setRecommendations('Continue regular maintenance')} />

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                <MaterialCommunityIcons name="camera-outline" size={13} color="#1A7651" /> Upload Photos
              </ThemedText>
              <View style={styles.photos}>
                <Pressable accessibilityLabel="Take a photo" accessibilityRole="button" style={styles.cameraTile}>
                  <MaterialCommunityIcons name="camera-outline" size={24} color="#FFFFFF" />
                </Pressable>
                {Array.from({ length: photos }).map((_, index) => (
                  <Image key={index} source={require('@/assets/images/background.png')} style={styles.photo} />
                ))}
                <Pressable accessibilityLabel="Add photo" accessibilityRole="button" onPress={() => setPhotos((count) => Math.min(count + 1, 4))} style={styles.addPhoto}>
                  <MaterialCommunityIcons name="plus" size={24} color="#159867" />
                </Pressable>
              </View>
            </ScrollView>

            <Pressable accessibilityLabel="Save Field Visit" accessibilityRole="button" style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="content-save-outline" size={17} color="#FFFFFF" />
              <ThemedText type="smallBold" style={styles.saveText}>Save Field Visit</ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function MetaItem({ icon, label, value }: { icon: 'leaf' | 'calendar-outline' | 'target'; label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIcon}><MaterialCommunityIcons name={icon} size={13} color="#17915E" /></View>
      <View><ThemedText style={styles.metaLabel}>{label}</ThemedText><ThemedText type="smallBold" style={styles.metaValue}>{value}</ThemedText></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.3)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  keyboard: { flex: 1 },
  page: { flex: 1 },
  content: { paddingBottom: 12 },
  header: { height: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: 'rgba(250,255,251,0.76)' },
  backButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#233A4B', fontSize: 14, lineHeight: 19, marginLeft: 6 },
  headerBrand: { color: '#5AA486', fontSize: 7, lineHeight: 10 },
  farmerHeader: { minHeight: 59, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' },
  farmerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#CFF0DA', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  farmerCopy: { flex: 1, marginLeft: 10 },
  farmerName: { color: '#26384D', fontSize: 11, lineHeight: 15 },
  farmerId: { color: '#8CA0AB', fontSize: 8, lineHeight: 11 },
  sectorBadge: { borderRadius: 10, backgroundColor: '#E0F7E9', paddingHorizontal: 8, paddingVertical: 3 },
  sectorText: { color: '#20824F', fontSize: 7, lineHeight: 10 },
  visitMeta: { marginHorizontal: 10, minHeight: 38, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.86)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaIcon: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#E2F7EA', alignItems: 'center', justifyContent: 'center' },
  metaLabel: { color: '#91A09B', fontSize: 6, lineHeight: 8 },
  metaValue: { color: '#3E5B50', fontSize: 7, lineHeight: 10 },
  sectionTitle: { color: '#16452A', fontSize: 9, lineHeight: 13, marginHorizontal: 10, marginTop: 10, marginBottom: 5 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 10, rowGap: 7 },
  purposeCard: { width: '31.8%', height: 57, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.93)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  purposeCardSelected: { borderWidth: 1.5, borderColor: '#00AE70', backgroundColor: 'rgba(240,255,246,0.92)' },
  purposeText: { color: '#566E68', textAlign: 'center', fontSize: 7, lineHeight: 9, marginTop: 4 },
  selectInput: { height: 31, marginHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 },
  selectText: { flex: 1, color: '#4E6C60', fontSize: 8, lineHeight: 11 },
  placeholderText: { color: '#9BAAB2' },
  photos: { flexDirection: 'row', gap: 7, marginHorizontal: 10, alignItems: 'center' },
  cameraTile: { width: 35, height: 35, borderRadius: 7, backgroundColor: '#00834D', alignItems: 'center', justifyContent: 'center' },
  photo: { width: 35, height: 35, borderRadius: 7 },
  addPhoto: { width: 35, height: 35, borderRadius: 7, borderWidth: 1, borderStyle: 'dashed', borderColor: '#9BE6C2', backgroundColor: 'rgba(240,255,247,0.6)', alignItems: 'center', justifyContent: 'center' },
  saveButton: { height: 36, marginHorizontal: 17, marginBottom: 7, borderRadius: 8, backgroundColor: '#056D31', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  saveText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  pressed: { opacity: 0.82 },
});
