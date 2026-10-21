import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type OrganizationCategory = 'Tea Factory' | 'Tea Board Office' | 'Research Institute' | 'Other';
type OrganizationStatus = 'Active' | 'Pending';
type Organization = {
  id: string;
  name: string;
  category: OrganizationCategory;
  status: OrganizationStatus;
};
type OrganizationFilter = 'All' | OrganizationCategory;

const filters: OrganizationFilter[] = [
  'All',
  'Tea Factory',
  'Tea Board Office',
  'Research Institute',
  'Other',
];

const initialOrganizations: Organization[] = [
  { id: 'ORG-001', name: 'Thalawakale Tea Factory', category: 'Tea Factory', status: 'Active' },
  { id: 'ORG-002', name: 'Kandy Tea Board Office', category: 'Tea Board Office', status: 'Active' },
  { id: 'ORG-003', name: 'Tea Research Institute', category: 'Research Institute', status: 'Active' },
  { id: 'ORG-004', name: 'Lanka Tea Traders (Pvt) Ltd', category: 'Other', status: 'Pending' },
];

const organizationIcons: Record<OrganizationCategory, IconName> = {
  'Tea Factory': 'factory',
  'Tea Board Office': 'domain',
  'Research Institute': 'leaf',
  Other: 'domain',
};

export default function AdministratorOrganizationsScreen() {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<OrganizationFilter>('All');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationCategory, setOrganizationCategory] = useState<OrganizationCategory>('Tea Factory');

  const visibleOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return organizations.filter((organization) => (
      (filter === 'All' || organization.category === filter)
      && (!query || `${organization.name} ${organization.id} ${organization.category}`.toLowerCase().includes(query))
    ));
  }, [filter, organizations, search]);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    }
  }

  function openAddForm() {
    setEditingId(null);
    setOrganizationName('');
    setOrganizationCategory('Tea Factory');
    setEditorOpen(true);
  }

  function openEditForm(organization: Organization) {
    setEditingId(organization.id);
    setOrganizationName(organization.name);
    setOrganizationCategory(organization.category);
    setEditorOpen(true);
  }

  function saveOrganization() {
    const normalizedName = organizationName.trim();
    if (!normalizedName) {
      Alert.alert('Organization name required', 'Enter a name before saving.');
      return;
    }

    if (editingId) {
      setOrganizations((current) => current.map((organization) => (
        organization.id === editingId
          ? { ...organization, name: normalizedName, category: organizationCategory }
          : organization
      )));
    } else {
      const nextNumber = organizations.length + 1;
      const newOrganization: Organization = {
        id: `ORG-${String(nextNumber).padStart(3, '0')}`,
        name: normalizedName,
        category: organizationCategory,
        status: 'Pending',
      };
      setOrganizations((current) => [newOrganization, ...current]);
    }
    setEditorOpen(false);
    Alert.alert(
      editingId ? 'Organization updated' : 'Organization added',
      'This sample change is only available for this session.',
    );
  }

  function showDetails(organization: Organization) {
    Alert.alert(
      organization.name,
      `Organization ID: ${organization.id}\nType: ${organization.category}\nStatus: ${organization.status}`,
    );
  }

  function cycleCategory() {
    const currentIndex = filters.indexOf(organizationCategory);
    const next = filters[(currentIndex + 1) % (filters.length - 1) + 1];
    if (next !== 'All') {
      setOrganizationCategory(next);
    }
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>Organizations</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={17} color="#36744D" />
            <TextInput
              accessibilityLabel="Search organizations"
              onChangeText={setSearch}
              placeholder="Search organization name or ID..."
              placeholderTextColor="#8AA093"
              style={styles.searchInput}
              value={search}
            />
            {search.length > 0 && (
              <Pressable accessibilityLabel="Clear search" onPress={() => setSearch('')}>
                <MaterialCommunityIcons name="close-circle" size={15} color="#81958A" />
              </Pressable>
            )}
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.filtersRow}
            showsHorizontalScrollIndicator={false}>
            {filters.map((item) => {
              const selected = item === filter;
              const label = item === 'Tea Factory'
                ? 'Tea Factories'
                : item === 'Tea Board Office'
                  ? 'Tea Board Offices'
                  : item === 'Research Institute'
                    ? 'Research Institutes'
                    : item;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}>
                  <ThemedText type="smallBold" style={[styles.filterText, selected && styles.filterTextSelected]}>
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={openAddForm}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />
            <ThemedText type="smallBold" style={styles.addButtonText}>Add Organization</ThemedText>
          </Pressable>

          <View style={styles.organizationList}>
            {visibleOrganizations.map((organization) => (
              <View key={organization.id} style={styles.organizationCard}>
                <View style={styles.organizationTop}>
                  <View style={styles.organizationIcon}>
                    <MaterialCommunityIcons
                      name={organizationIcons[organization.category]}
                      size={20}
                      color="#198046"
                    />
                  </View>
                  <View style={styles.organizationInfo}>
                    <ThemedText type="smallBold" numberOfLines={1} style={styles.organizationName}>
                      {organization.name}
                    </ThemedText>
                    <ThemedText type="small" style={styles.organizationMeta}>
                      Organization ID: {organization.id}
                    </ThemedText>
                    <ThemedText type="small" style={styles.organizationMeta}>
                      Type: {organization.category}
                    </ThemedText>
                    <View style={styles.activeLine}>
                      <MaterialCommunityIcons name="account-check" size={11} color="#208348" />
                      <ThemedText type="small" style={styles.activeLineText}>
                        {organization.status === 'Active' ? 'Active' : 'Awaiting approval'}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[
                      styles.statusBadge,
                      organization.status === 'Pending' && styles.pendingBadge,
                    ]}>
                      <View style={[
                        styles.statusDot,
                        organization.status === 'Pending' && styles.pendingDot,
                      ]} />
                      <ThemedText
                        type="smallBold"
                        style={[
                          styles.statusText,
                          organization.status === 'Pending' && styles.pendingText,
                        ]}>
                        {organization.status}
                      </ThemedText>
                    </View>
                    <Pressable
                      accessibilityLabel={`View ${organization.name}`}
                      accessibilityRole="button"
                      onPress={() => showDetails(organization)}
                      style={styles.chevronButton}>
                      <MaterialCommunityIcons name="chevron-right" size={19} color="#547D64" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showDetails(organization)}
                    style={({ pressed }) => [styles.cardActionButton, pressed && styles.pressed]}>
                    <MaterialCommunityIcons name="eye-outline" size={13} color="#397552" />
                    <ThemedText type="smallBold" style={styles.cardActionText}>View Details</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openEditForm(organization)}
                    style={({ pressed }) => [styles.cardActionButton, pressed && styles.pressed]}>
                    <MaterialCommunityIcons name="pencil-outline" size={13} color="#397552" />
                    <ThemedText type="smallBold" style={styles.cardActionText}>Edit</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))}
            {visibleOrganizations.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="domain" size={31} color="#70927A" />
                <ThemedText type="smallBold" style={styles.emptyTitle}>No organizations found</ThemedText>
                <ThemedText type="small" style={styles.emptyText}>Try another search or organization type.</ThemedText>
              </View>
            )}
          </View>
          <ThemedText type="small" style={styles.demoNote}>
            Sample organization records · changes are not saved to a server
          </ThemedText>
        </ScrollView>

        <Modal
          animationType="fade"
          onRequestClose={() => setEditorOpen(false)}
          transparent
          visible={editorOpen}>
          <View style={styles.modalBackdrop}>
            <View style={styles.editorCard}>
              <View style={styles.editorHeader}>
                <ThemedText type="smallBold" style={styles.editorTitle}>
                  {editingId ? 'Edit Organization' : 'Add Organization'}
                </ThemedText>
                <Pressable
                  accessibilityLabel="Close organization form"
                  onPress={() => setEditorOpen(false)}>
                  <MaterialCommunityIcons name="close" size={20} color="#537C65" />
                </Pressable>
              </View>
              <ThemedText type="smallBold" style={styles.editorLabel}>Organization Name</ThemedText>
              <TextInput
                accessibilityLabel="Organization name"
                onChangeText={setOrganizationName}
                placeholder="Enter organization name"
                placeholderTextColor="#8AA093"
                style={styles.editorInput}
                value={organizationName}
              />
              <ThemedText type="smallBold" style={styles.editorLabel}>Organization Type</ThemedText>
              <Pressable onPress={cycleCategory} style={styles.editorSelect}>
                <ThemedText type="small" style={styles.editorSelectText}>{organizationCategory}</ThemedText>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#39744F" />
              </Pressable>
              <View style={styles.editorActions}>
                <Pressable onPress={() => setEditorOpen(false)} style={styles.cancelButton}>
                  <ThemedText type="smallBold" style={styles.cancelText}>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={saveOrganization} style={styles.saveButton}>
                  <ThemedText type="smallBold" style={styles.saveText}>Save</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <AdministratorBottomTabs
          activeTab="Organizations"
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
  content: { flexGrow: 1, paddingHorizontal: 11, paddingTop: 2, paddingBottom: 8 },
  header: { minHeight: 40, flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  backButton: { width: 33, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 16 },
  headerSpacer: { width: 33 },
  searchBox: { minHeight: 34, borderWidth: 1, borderColor: '#D5E9DE', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9 },
  searchInput: { flex: 1, height: 32, color: '#476B55', fontSize: 8, paddingVertical: 0 },
  filtersRow: { alignItems: 'center', gap: 5, paddingVertical: 7 },
  filterChip: { minHeight: 23, borderRadius: 14, borderWidth: 1, borderColor: '#D8EAE1', backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  filterChipSelected: { backgroundColor: '#108343', borderColor: '#108343' },
  filterText: { color: '#557965', fontSize: 6 },
  filterTextSelected: { color: '#FFFFFF' },
  addButton: { minHeight: 30, borderRadius: 17, backgroundColor: '#108541', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 7 },
  addButtonText: { color: '#FFFFFF', fontSize: 8 },
  organizationList: { gap: 7 },
  organizationCard: { minHeight: 92, borderWidth: 1, borderColor: '#D7E9DF', borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', padding: 7 },
  organizationTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  organizationIcon: { width: 36, height: 36, borderRadius: 19, backgroundColor: '#E0F5DF', alignItems: 'center', justifyContent: 'center' },
  organizationInfo: { flex: 1, minWidth: 0, gap: 1 },
  organizationName: { color: '#315E42', fontSize: 8, lineHeight: 12 },
  organizationMeta: { color: '#819388', fontSize: 6, lineHeight: 9 },
  activeLine: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  activeLineText: { color: '#5F826A', fontSize: 6 },
  cardRight: { minHeight: 43, alignItems: 'flex-end', justifyContent: 'space-between' },
  statusBadge: { minHeight: 17, borderRadius: 9, backgroundColor: '#E6F8E8', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6 },
  pendingBadge: { backgroundColor: '#FFF5DD' },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#23A151' },
  pendingDot: { backgroundColor: '#EBA323' },
  statusText: { color: '#39804D', fontSize: 6 },
  pendingText: { color: '#B27B14' },
  chevronButton: { width: 23, height: 20, alignItems: 'flex-end', justifyContent: 'center' },
  cardActions: { flexDirection: 'row', gap: 5, marginLeft: 43, marginTop: 4 },
  cardActionButton: { minWidth: 88, minHeight: 21, borderWidth: 1, borderColor: '#D7E9E0', borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 7 },
  cardActionText: { color: '#527662', fontSize: 6 },
  emptyState: { minHeight: 145, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyTitle: { color: '#315E42', fontSize: 10 },
  emptyText: { color: '#758579', fontSize: 7, textAlign: 'center' },
  demoNote: { color: '#829184', fontSize: 6, textAlign: 'center', marginTop: 6 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,45,27,0.38)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  editorCard: { width: '100%', borderRadius: 14, backgroundColor: '#FFFFFF', padding: 14 },
  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  editorTitle: { color: '#245C39', fontSize: 13 },
  editorLabel: { color: '#527360', fontSize: 9, marginBottom: 5 },
  editorInput: { height: 36, borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 7, paddingHorizontal: 9, color: '#456C54', fontSize: 9, marginBottom: 10 },
  editorSelect: { minHeight: 36, borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 9 },
  editorSelectText: { color: '#456C54', fontSize: 9 },
  editorActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 7, marginTop: 15 },
  cancelButton: { minWidth: 68, minHeight: 31, borderWidth: 1, borderColor: '#D8EAE0', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#547461', fontSize: 8 },
  saveButton: { minWidth: 68, minHeight: 31, borderRadius: 16, backgroundColor: '#108541', alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontSize: 8 },
  pressed: { opacity: 0.82 },
});
