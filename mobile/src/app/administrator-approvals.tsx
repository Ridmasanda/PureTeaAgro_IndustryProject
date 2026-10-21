import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ComponentProps } from 'react';
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
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
type ApprovalFilter = 'Pending' | 'Approved' | 'Rejected';
type ApprovalRequest = {
  id: string;
  name: string;
  requestedRole: string;
  district: string;
  submitted: string;
  nic: string;
  mobile: string;
  email: string;
  organization: string;
  status: ApprovalStatus;
};

const initialRequests: ApprovalRequest[] = [
  {
    id: 'REQ-2025-018',
    name: 'Nimal Perera',
    requestedRole: 'Farmer',
    district: 'Nuwara Eliya',
    submitted: 'Today',
    nic: '987654321V',
    mobile: '+94 77 123 4567',
    email: 'nimal.perera@example.lk',
    organization: 'Thalawakale Tea Factory',
    status: 'Pending',
  },
  {
    id: 'REQ-2025-017',
    name: 'Kamalani Silva',
    requestedRole: 'Tea Inspector',
    district: 'Kandy',
    submitted: 'Today',
    nic: '925678901V',
    mobile: '+94 76 987 6543',
    email: 'kamalani.silva@example.lk',
    organization: 'Central Inspection Office',
    status: 'Pending',
  },
  {
    id: 'REQ-2025-016',
    name: 'Sampath Wickramasinghe',
    requestedRole: 'Leaf Collector',
    district: 'Matara',
    submitted: 'Yesterday',
    nic: '901234567V',
    mobile: '+94 77 223 4455',
    email: 'sampath.w@example.lk',
    organization: 'Thalawakale Tea Factory',
    status: 'Pending',
  },
  {
    id: 'REQ-2025-015',
    name: 'Ruwani Fernando',
    requestedRole: 'Farmer',
    district: 'Galle',
    submitted: 'Yesterday',
    nic: '916543210V',
    mobile: '+94 71 222 3344',
    email: 'ruwani.fernando@example.lk',
    organization: 'Galle Regional Office',
    status: 'Pending',
  },
  {
    id: 'REQ-2025-014',
    name: 'Amal Jayawardena',
    requestedRole: 'Factory Manager',
    district: 'Badulla',
    submitted: 'Sep 06',
    nic: '882345678V',
    mobile: '+94 72 444 5566',
    email: 'amal.j@example.lk',
    organization: 'Uva Tea Factory',
    status: 'Pending',
  },
  {
    id: 'REQ-2025-013',
    name: 'Chathuri Peris',
    requestedRole: 'Tea Inspector',
    district: 'Kandy',
    submitted: 'Sep 05',
    nic: '936789012V',
    mobile: '+94 75 555 6677',
    email: 'chathuri.p@example.lk',
    organization: 'Central Inspection Office',
    status: 'Approved',
  },
  {
    id: 'REQ-2025-012',
    name: 'Dilan Kumara',
    requestedRole: 'Farmer',
    district: 'Matara',
    submitted: 'Sep 04',
    nic: '903456789V',
    mobile: '+94 77 666 7788',
    email: 'dilan.k@example.lk',
    organization: 'Southern Tea Society',
    status: 'Rejected',
  },
];

const approvalFilters: { label: ApprovalFilter; icon: IconName }[] = [
  { label: 'Pending', icon: 'clock-outline' },
  { label: 'Approved', icon: 'check-circle-outline' },
  { label: 'Rejected', icon: 'close-circle-outline' },
];

const roleIcons: Record<string, IconName> = {
  Farmer: 'account-tie-hat',
  'Tea Inspector': 'account-search',
  'Leaf Collector': 'leaf',
  'Factory Manager': 'factory',
};

export default function AdministratorApprovalsScreen() {
  const [activeFilter, setActiveFilter] = useState<ApprovalFilter>('Pending');
  const [requests, setRequests] = useState(initialRequests);
  const [counts, setCounts] = useState<Record<ApprovalFilter, number>>({
    Pending: 5,
    Approved: 12,
    Rejected: 3,
  });
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const visibleRequests = useMemo(
    () => requests.filter((request) => request.status === activeFilter),
    [activeFilter, requests],
  );

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
      return;
    }
    if (tab === 'Users') {
      router.replace('/administrator-users');
      return;
    }
    if (tab === 'Approvals') {
      return;
    }
    router.replace({ pathname: '/administrator-home', params: { section: tab } });
  }

  function updateRequestStatus(id: string, status: ApprovalStatus) {
    const currentRequest = requests.find((request) => request.id === id);
    if (!currentRequest || currentRequest.status === status) {
      return;
    }
    setRequests((current) => current.map((request) => (
      request.id === id ? { ...request, status } : request
    )));
    setCounts((current) => ({
      ...current,
      [currentRequest.status]: current[currentRequest.status] - 1,
      [status]: current[status] + 1,
    }));
    setExpandedRequest(null);
  }

  function showMoreInfo(request: ApprovalRequest) {
    Alert.alert(
      'Registration Request',
      `Request ID: ${request.id}\nName: ${request.name}\nRole: ${request.requestedRole}\nNIC: ${request.nic}\nEmail: ${request.email}\nOrganization: ${request.organization}`,
    );
  }

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
            <ThemedText type="smallBold" style={styles.headerTitle}>Registration Approvals</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.filterRow}>
            {approvalFilters.map((filter) => {
              const selected = activeFilter === filter.label;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={filter.label}
                  onPress={() => {
                    setActiveFilter(filter.label);
                    setExpandedRequest(null);
                  }}
                  style={[styles.filterTab, selected && styles.filterTabSelected]}>
                  <MaterialCommunityIcons
                    name={filter.icon}
                    size={11}
                    color={selected ? '#FFFFFF' : '#648472'}
                  />
                  <ThemedText type="smallBold" style={[styles.filterLabel, selected && styles.filterLabelSelected]}>
                    {filter.label}
                  </ThemedText>
                  <View style={[styles.countBadge, selected && styles.countBadgeSelected]}>
                    <ThemedText type="smallBold" style={[styles.countText, selected && styles.countTextSelected]}>
                        {counts[filter.label]}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.requestList}>
            {visibleRequests.map((request) => {
              const expanded = expandedRequest === request.id;
              const pending = request.status === 'Pending';
              const approved = request.status === 'Approved';

              return (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.requestTypeBadge, !pending && styles[approved ? 'approvedBadge' : 'rejectedBadge']]}>
                      <ThemedText type="smallBold" style={[styles.requestTypeText, !pending && styles[approved ? 'approvedText' : 'rejectedText']]}>
                        {pending ? 'New Registration' : request.status}
                      </ThemedText>
                    </View>
                    <ThemedText type="small" style={styles.dateText}>{request.submitted}</ThemedText>
                  </View>

                  <View style={styles.profileRow}>
                    <View style={styles.avatar}>
                      <MaterialCommunityIcons
                        name={roleIcons[request.requestedRole] ?? 'account-outline'}
                        size={26}
                        color="#247843"
                      />
                    </View>
                    <View style={styles.requestDetails}>
                      <ThemedText type="smallBold" style={styles.userName}>{request.name}</ThemedText>
                      <View style={styles.infoLine}>
                        <MaterialCommunityIcons name="account-outline" size={12} color="#43845A" />
                        <ThemedText type="small" style={styles.infoText}>Requested Role: {request.requestedRole}</ThemedText>
                      </View>
                      <View style={styles.infoLine}>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#43845A" />
                        <ThemedText type="small" style={styles.infoText}>District: {request.district}</ThemedText>
                      </View>
                      <View style={styles.infoLine}>
                        <MaterialCommunityIcons name="calendar-check" size={12} color="#43845A" />
                        <ThemedText type="small" style={styles.infoText}>Submitted: {request.submitted}</ThemedText>
                      </View>
                    </View>
                    <Pressable
                      accessibilityLabel={`Toggle details for ${request.name}`}
                      accessibilityRole="button"
                      accessibilityState={{ expanded }}
                      onPress={() => setExpandedRequest(expanded ? null : request.id)}
                      style={styles.openDetailsButton}>
                      <MaterialCommunityIcons
                        name={expanded ? 'chevron-up' : 'chevron-right'}
                        size={20}
                        color="#388052"
                      />
                    </Pressable>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setExpandedRequest(expanded ? null : request.id)}
                    style={styles.viewDetailsBar}>
                    <ThemedText type="smallBold" style={styles.viewDetailsText}>
                      {expanded ? 'Hide Details' : 'View Details'}
                    </ThemedText>
                    <MaterialCommunityIcons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={15}
                      color="#398057"
                    />
                  </Pressable>

                  {expanded && (
                    <View style={styles.expandedDetails}>
                      <DetailLine label="Request ID" value={request.id} />
                      <DetailLine label="NIC Number" value={request.nic} />
                      <DetailLine label="Mobile Number" value={request.mobile} />
                      <DetailLine label="Email Address" value={request.email} />
                      <DetailLine label="Organization" value={request.organization} />
                    </View>
                  )}

                  <View style={styles.cardActions}>
                    {pending ? (
                      <>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => updateRequestStatus(request.id, 'Approved')}
                          style={({ pressed }) => [styles.approveButton, pressed && styles.pressed]}>
                          <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" />
                          <ThemedText type="smallBold" style={styles.approveText}>Approve</ThemedText>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => updateRequestStatus(request.id, 'Rejected')}
                          style={({ pressed }) => [styles.rejectButton, pressed && styles.pressed]}>
                          <MaterialCommunityIcons name="close" size={15} color="#E34949" />
                          <ThemedText type="smallBold" style={styles.rejectText}>Reject</ThemedText>
                        </Pressable>
                      </>
                    ) : (
                      <View style={[styles.statusResult, approved ? styles.approvedResult : styles.rejectedResult]}>
                        <MaterialCommunityIcons
                          name={approved ? 'check-circle-outline' : 'close-circle-outline'}
                          size={15}
                          color={approved ? '#238047' : '#D34A4A'}
                        />
                        <ThemedText type="smallBold" style={approved ? styles.approvedText : styles.rejectedText}>
                          {request.status}
                        </ThemedText>
                      </View>
                    )}
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => showMoreInfo(request)}
                      style={({ pressed }) => [styles.moreInfoButton, pressed && styles.pressed]}>
                      <MaterialCommunityIcons name="information" size={14} color="#2683D1" />
                      <ThemedText type="smallBold" style={styles.moreInfoText}>More Info</ThemedText>
                    </Pressable>
                  </View>
                </View>
              );
            })}
            {visibleRequests.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name={activeFilter === 'Pending' ? 'clipboard-check-outline' : activeFilter === 'Approved' ? 'check-circle-outline' : 'close-circle-outline'}
                  size={34}
                  color="#6D9278"
                />
                <ThemedText type="smallBold" style={styles.emptyTitle}>No {activeFilter.toLowerCase()} requests</ThemedText>
                <ThemedText type="small" style={styles.emptyText}>
                  Requests with this status will appear here.
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="small" style={styles.demoNote}>
            Sample registration requests · changes are not saved to a server
          </ThemedText>
        </ScrollView>
        <AdministratorBottomTabs
          activeTab="Approvals"
          onSelect={selectTab}
          onRoute={router.replace}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <ThemedText type="small" style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 3, paddingBottom: 8 },
  header: { minHeight: 43, flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 17 },
  headerSpacer: { width: 34 },
  filterRow: { flexDirection: 'row', gap: 5, marginBottom: 8 },
  filterTab: { flex: 1, minHeight: 33, borderRadius: 18, borderWidth: 1, borderColor: '#D5E9DE', backgroundColor: 'rgba(255,255,255,0.93)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 5 },
  filterTabSelected: { backgroundColor: '#11743C', borderColor: '#11743C' },
  filterLabel: { color: '#557765', fontSize: 8 },
  filterLabelSelected: { color: '#FFFFFF' },
  countBadge: { minWidth: 16, height: 16, borderRadius: 9, backgroundColor: '#E8F2EB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  countBadgeSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  countText: { color: '#4C705A', fontSize: 7 },
  countTextSelected: { color: '#FFFFFF' },
  requestList: { gap: 8 },
  requestCard: { borderRadius: 12, borderWidth: 1, borderColor: '#D7E9DF', backgroundColor: 'rgba(255,255,255,0.96)', padding: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  requestTypeBadge: { minHeight: 19, borderRadius: 10, backgroundColor: '#FFF1CA', justifyContent: 'center', paddingHorizontal: 8 },
  approvedBadge: { backgroundColor: '#E0F5E4' },
  rejectedBadge: { backgroundColor: '#FDE8E6' },
  requestTypeText: { color: '#B46F00', fontSize: 7 },
  approvedText: { color: '#287043', fontSize: 8 },
  rejectedText: { color: '#C74343', fontSize: 8 },
  dateText: { color: '#759184', fontSize: 7 },
  profileRow: { minHeight: 65, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#E1F3DF', borderWidth: 1, borderColor: '#D1E8D2', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  requestDetails: { flex: 1, minWidth: 0 },
  userName: { color: '#2B573E', fontSize: 10, lineHeight: 14, marginBottom: 1 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 14 },
  infoText: { color: '#688273', fontSize: 8, lineHeight: 11 },
  openDetailsButton: { width: 25, height: 40, alignItems: 'flex-end', justifyContent: 'center', marginLeft: 2 },
  viewDetailsBar: { minHeight: 24, borderRadius: 7, backgroundColor: '#EFF9F4', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 4 },
  viewDetailsText: { color: '#398057', fontSize: 8 },
  expandedDetails: { borderBottomWidth: 1, borderBottomColor: '#E5EFE8', paddingVertical: 5, marginBottom: 5 },
  detailLine: { minHeight: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  detailLabel: { color: '#7A8B7F', fontSize: 8 },
  detailValue: { flex: 1, color: '#4A6B56', fontSize: 8, textAlign: 'right' },
  cardActions: { flexDirection: 'row', gap: 6, marginTop: 6 },
  approveButton: { flex: 1, minHeight: 27, borderRadius: 15, backgroundColor: '#159047', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  approveText: { color: '#FFFFFF', fontSize: 8 },
  rejectButton: { flex: 1, minHeight: 27, borderRadius: 15, borderWidth: 1, borderColor: '#F1D6D4', backgroundColor: '#FFF8F7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  rejectText: { color: '#D54A4A', fontSize: 8 },
  moreInfoButton: { flex: 1, minHeight: 27, borderRadius: 15, borderWidth: 1, borderColor: '#D5E9F7', backgroundColor: '#F4FAFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  moreInfoText: { color: '#267EC0', fontSize: 8 },
  statusResult: { flex: 2, minHeight: 27, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  approvedResult: { backgroundColor: '#EDF8EF' },
  rejectedResult: { backgroundColor: '#FFF1F0' },
  emptyState: { minHeight: 190, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 18 },
  emptyTitle: { color: '#315E42', fontSize: 12 },
  emptyText: { color: '#758579', fontSize: 9, textAlign: 'center' },
  demoNote: { color: '#829184', fontSize: 7, textAlign: 'center', marginTop: 8 },
  pressed: { opacity: 0.84 },
});
