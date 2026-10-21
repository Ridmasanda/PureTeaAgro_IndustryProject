import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type AssignmentType = 'Inspector' | 'Collector';
type AssignmentField = 'inspector' | 'district' | 'area' | 'collector' | 'factory' | 'collectionArea';
type AssignmentValues = Record<AssignmentField, string>;

const options: Record<AssignmentField, string[]> = {
  inspector: ['Select Inspector', 'Kamalani Silva', 'Ruwan Perera', 'Nadeesha Fernando'],
  district: ['Select District', 'Nuwara Eliya', 'Kandy', 'Badulla', 'Matara'],
  area: ['Select Area', 'Hatton', 'Talawakelle', 'Nawalapitiya', 'Gampola'],
  collector: ['Select Collector', 'Sampath Wickramasinghe', 'Dilan Kumara', 'Nimal Jayasuriya'],
  factory: ['Select Factory', 'Thalawakale Tea Factory', 'Uva Tea Factory', 'Central Tea Factory'],
  collectionArea: ['Select Area', 'Hatton North', 'Talawakelle East', 'Nawalapitiya South'],
};

const fieldMeta: Record<AssignmentField, { label: string; icon: IconName }> = {
  inspector: { label: 'Inspector', icon: 'account' },
  district: { label: 'District', icon: 'map-marker' },
  area: { label: 'Assigned Area', icon: 'map-outline' },
  collector: { label: 'Collector', icon: 'account' },
  factory: { label: 'Factory', icon: 'domain' },
  collectionArea: { label: 'Collection Area', icon: 'leaf' },
};

const assignmentBenefits: Record<AssignmentType, string[]> = {
  Inspector: [
    'Link inspector with farmers in the selected area',
    'Enable inspection tracking',
    'Help with report generation',
  ],
  Collector: [
    'Link collector with collection areas',
    'Track leaf collection activities',
    'Support factory operations',
  ],
};

const emptyValues: AssignmentValues = {
  inspector: '',
  district: '',
  area: '',
  collector: '',
  factory: '',
  collectionArea: '',
};

export default function AdministratorAssignmentsScreen() {
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('Inspector');
  const [values, setValues] = useState<AssignmentValues>(emptyValues);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    }
  }

  function updateSelection(field: AssignmentField) {
    const choices = options[field];
    const selectedIndex = choices.indexOf(values[field]);
    const nextIndex = (selectedIndex + 1) % choices.length;
    setValues((current) => ({ ...current, [field]: choices[nextIndex] }));
  }

  function saveAssignment() {
    const requiredFields: AssignmentField[] = assignmentType === 'Inspector'
      ? ['inspector', 'district', 'area']
      : ['collector', 'factory', 'collectionArea'];
    const missingField = requiredFields.find((field) => !values[field]);

    if (missingField) {
      Alert.alert('Complete the assignment', `Please select a ${fieldMeta[missingField].label.toLowerCase()} before saving.`);
      return;
    }

    const assignee = assignmentType === 'Inspector' ? values.inspector : values.collector;
    Alert.alert(
      'Assignment saved',
      `${assignee} has been assigned. This sample assignment is not saved to a server.`,
      [{ text: 'OK', onPress: () => setValues(emptyValues) }],
    );
  }

  const activeFields: AssignmentField[] = assignmentType === 'Inspector'
    ? ['inspector', 'district', 'area']
    : ['collector', 'factory', 'collectionArea'];

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>Assignments</ThemedText>
            <MaterialCommunityIcons name="account-cog" size={20} color="#176B32" />
          </View>

          <View style={styles.typeSwitcher}>
            {(['Inspector', 'Collector'] as const).map((type) => {
              const selected = assignmentType === type;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={type}
                  onPress={() => setAssignmentType(type)}
                  style={[styles.typeButton, selected && styles.typeButtonSelected]}>
                  <MaterialCommunityIcons
                    name={type === 'Inspector' ? 'account-search' : 'leaf'}
                    size={14}
                    color={selected ? '#FFFFFF' : '#48755A'}
                  />
                  <ThemedText type="smallBold" style={[styles.typeButtonText, selected && styles.typeButtonTextSelected]}>
                    Assign {type === 'Inspector' ? 'Inspector' : 'Collector'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name={assignmentType === 'Inspector' ? 'account-search' : 'leaf'}
                size={27}
                color="#197C42"
              />
            </View>
            <View style={styles.heroCopy}>
              <ThemedText type="smallBold" style={styles.heroTitle}>
                Assign {assignmentType === 'Inspector' ? 'Tea Inspector' : 'Leaf Collector'}
              </ThemedText>
              <ThemedText type="small" style={styles.heroDescription}>
                {assignmentType === 'Inspector'
                  ? 'Connect inspectors with their assigned areas for better monitoring and verification.'
                  : 'Connect collectors with factories and collection areas for smooth leaf collection operations.'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.formCard}>
            {activeFields.map((field) => (
              <View key={field} style={styles.fieldRow}>
                <View style={styles.fieldIcon}>
                  <MaterialCommunityIcons name={fieldMeta[field].icon} size={18} color="#178044" />
                </View>
                <View style={styles.fieldContent}>
                  <ThemedText type="smallBold" style={styles.fieldLabel}>{fieldMeta[field].label}</ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${fieldMeta[field].label}`}
                    onPress={() => updateSelection(field)}
                    style={({ pressed }) => [styles.selectField, pressed && styles.pressed]}>
                    <ThemedText
                      type="small"
                      numberOfLines={1}
                      style={[styles.selectText, !values[field] && styles.placeholderText]}>
                      {values[field] || options[field][0]}
                    </ThemedText>
                    <MaterialCommunityIcons name="chevron-down" size={16} color="#39744F" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.benefitsCard}>
            <View style={styles.benefitsTitleRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="information" size={14} color="#FFFFFF" />
              </View>
              <ThemedText type="smallBold" style={styles.benefitsTitle}>This assignment will:</ThemedText>
            </View>
            {assignmentBenefits[assignmentType].map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <MaterialCommunityIcons name="check-circle" size={12} color="#15904A" />
                <ThemedText type="small" style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={saveAssignment}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="content-save" size={15} color="#FFFFFF" />
            <ThemedText type="smallBold" style={styles.saveButtonText}>Save Assignment</ThemedText>
          </Pressable>

          <ThemedText type="small" style={styles.demoNote}>
            Assignments are sample data and are not saved to a connected service.
          </ThemedText>
        </ScrollView>
        <AdministratorBottomTabs
          activeTab="Assignments"
          onSelect={selectTab}
          onRoute={router.replace}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 3, paddingBottom: 8 },
  header: { minHeight: 41, flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 16 },
  typeSwitcher: { minHeight: 34, borderRadius: 9, borderWidth: 1, borderColor: '#D8EAE0', backgroundColor: 'rgba(255,255,255,0.93)', flexDirection: 'row', padding: 2, marginBottom: 6 },
  typeButton: { flex: 1, borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  typeButtonSelected: { backgroundColor: '#108343' },
  typeButtonText: { color: '#527765', fontSize: 8 },
  typeButtonTextSelected: { color: '#FFFFFF' },
  hero: { minHeight: 80, borderRadius: 10, backgroundColor: 'rgba(228,248,226,0.95)', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 7 },
  heroIcon: { width: 49, height: 49, borderRadius: 26, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#D8F1D6', alignItems: 'center', justifyContent: 'center' },
  heroCopy: { flex: 1 },
  heroTitle: { color: '#315E42', fontSize: 11, lineHeight: 15 },
  heroDescription: { color: '#668575', fontSize: 8, lineHeight: 12, marginTop: 2 },
  formCard: { borderWidth: 1, borderColor: '#D6EAE0', borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 9, paddingVertical: 5 },
  fieldRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#EEF4EF', paddingVertical: 5 },
  fieldIcon: { width: 31, height: 31, borderRadius: 17, backgroundColor: '#E3F5E4', alignItems: 'center', justifyContent: 'center' },
  fieldContent: { flex: 1, gap: 4 },
  fieldLabel: { color: '#456C54', fontSize: 8 },
  selectField: { minHeight: 30, borderWidth: 1, borderColor: '#DCEBE3', borderRadius: 7, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, paddingHorizontal: 8 },
  selectText: { flex: 1, color: '#456C54', fontSize: 8 },
  placeholderText: { color: '#7D9586' },
  benefitsCard: { borderWidth: 1, borderColor: '#D9EEE0', borderRadius: 10, backgroundColor: 'rgba(233,249,237,0.96)', paddingHorizontal: 9, paddingVertical: 7, marginTop: 8 },
  benefitsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoIcon: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#19834A', alignItems: 'center', justifyContent: 'center' },
  benefitsTitle: { color: '#3C7050', fontSize: 8 },
  benefitRow: { minHeight: 16, flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 23 },
  benefitText: { color: '#638170', fontSize: 7, lineHeight: 10 },
  saveButton: { minHeight: 34, borderRadius: 18, backgroundColor: '#108541', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 9 },
  saveButtonText: { color: '#FFFFFF', fontSize: 8 },
  demoNote: { color: '#829184', fontSize: 6, textAlign: 'center', marginTop: 5 },
  pressed: { opacity: 0.82 },
});
