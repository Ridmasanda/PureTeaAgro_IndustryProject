import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import {
  administratorUsers,
  type AdministratorUser,
} from '@/app/administrator-users';
import { ThemedText } from '@/components/themed-text';

function DetailRow({
  icon,
  label,
  value,
  active = false,
}: {
  icon: 'account-outline' | 'card-account-details-outline' | 'phone-outline' | 'account-cog-outline' | 'calendar-month-outline' | 'check-circle-outline' | 'domain' | 'login';
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={15} color="#247843" />
      </View>
      <ThemedText type="small" style={styles.detailLabel}>{label}</ThemedText>
      {active ? (
        <View style={styles.activeValue}>
          <View style={styles.activeDot} />
          <ThemedText type="smallBold" style={styles.activeText}>{value}</ThemedText>
        </View>
      ) : (
        <ThemedText type="smallBold" style={styles.detailValue}>{value}</ThemedText>
      )}
    </View>
  );
}

export default function AdministratorUserDetailsScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const user = administratorUsers.find((item) => item.id === userId);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Users') {
      router.replace('/administrator-users');
      return;
    }
    if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
      return;
    }
    if (tab === 'Home') {
      router.replace('/administrator-home');
      return;
    }
    router.replace({ pathname: '/administrator-home', params: { section: tab } });
  }

  function showRoleAction(action: string, selectedUser: AdministratorUser) {
    Alert.alert(
      action,
      `${action} for ${selectedUser.name} requires administrator confirmation and a connected service.`,
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
              accessibilityLabel="Back to user management"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>User Details</ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          {user ? (
            <>
              <View style={styles.detailsCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account-tie-hat" size={34} color="#247843" />
                  </View>
                  <View style={styles.profileInfo}>
                    <ThemedText type="smallBold" style={styles.name}>{user.name}</ThemedText>
                    <ThemedText type="small" style={styles.userId}>User ID: {user.id}</ThemedText>
                    <View style={styles.roleBadge}>
                      <MaterialCommunityIcons name="check" size={12} color="#238047" />
                      <ThemedText type="smallBold" style={styles.roleText}>{user.role}</ThemedText>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, user.status !== 'Active' && styles.statusBadgeInactive]}>
                    <View style={[styles.activeDot, user.status !== 'Active' && styles.inactiveDot]} />
                    <ThemedText type="smallBold" style={styles.activeText}>{user.status}</ThemedText>
                  </View>
                </View>
                <View style={styles.divider} />
                <DetailRow icon="account-outline" label="Full Name" value={user.name} />
                <DetailRow icon="card-account-details-outline" label="NIC" value={user.nic} />
                <DetailRow icon="phone-outline" label="Contact" value={user.mobile} />
                <DetailRow icon="account-cog-outline" label="Role" value={user.role} />
                <DetailRow icon="calendar-month-outline" label="Registration Date" value={user.registrationDate} />
                <DetailRow icon="check-circle-outline" label="Account Status" value={user.status} active={user.status === 'Active'} />
                <DetailRow icon="domain" label="Organization" value={user.organization} />
                <DetailRow icon="login" label="Last Login" value={user.lastLogin} />
              </View>

              <View style={styles.roleCard}>
                <View style={styles.roleHeading}>
                  <MaterialCommunityIcons name="shield-check" size={19} color="#19723D" />
                  <ThemedText type="smallBold" style={styles.roleHeadingText}>Role Management</ThemedText>
                </View>
                <View style={styles.roleActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showRoleAction('Assign Role', user)}
                    style={({ pressed }) => [styles.roleAction, styles.assignAction, pressed && styles.pressed]}>
                    <View style={[styles.roleActionIcon, styles.assignIcon]}>
                      <MaterialCommunityIcons name="account-plus" size={22} color="#168249" />
                    </View>
                    <ThemedText type="smallBold" style={styles.roleActionText}>Assign Role</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showRoleAction('Change Role', user)}
                    style={({ pressed }) => [styles.roleAction, styles.changeAction, pressed && styles.pressed]}>
                    <View style={[styles.roleActionIcon, styles.changeIcon]}>
                      <MaterialCommunityIcons name="pencil" size={22} color="#2B81A3" />
                    </View>
                    <ThemedText type="smallBold" style={styles.roleActionText}>Change Role</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showRoleAction('Revoke Role', user)}
                    style={({ pressed }) => [styles.roleAction, styles.revokeAction, pressed && styles.pressed]}>
                    <View style={[styles.roleActionIcon, styles.revokeIcon]}>
                      <MaterialCommunityIcons name="close" size={22} color="#DA4C4C" />
                    </View>
                    <ThemedText type="smallBold" style={styles.roleActionText}>Revoke Role</ThemedText>
                  </Pressable>
                </View>
                <View style={styles.auditNote}>
                  <MaterialCommunityIcons name="information" size={15} color="#42816A" />
                  <ThemedText type="small" style={styles.auditText}>
                    Role changes require confirmation and will be recorded in the audit log.
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.demoNote}>Sample user details · not connected to a server</ThemedText>
              </View>
            </>
          ) : (
            <View style={styles.notFound}>
              <MaterialCommunityIcons name="account-alert-outline" size={34} color="#789080" />
              <ThemedText type="smallBold" style={styles.notFoundTitle}>User not found</ThemedText>
              <ThemedText type="small" style={styles.notFoundText}>
                This user is not available in the sample user list.
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace('/administrator-users')}
                style={styles.backToUsersButton}>
                <ThemedText type="smallBold" style={styles.backToUsersText}>Back to User Management</ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
        <AdministratorBottomTabs activeTab="Users" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.78)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 3, paddingBottom: 10 },
  header: { minHeight: 43, flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 17 },
  headerSpacer: { width: 34 },
  detailsCard: { borderRadius: 13, borderWidth: 1, borderColor: '#D6E9DE', backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 10, paddingVertical: 7 },
  profileHeader: { minHeight: 69, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 53, height: 53, borderRadius: 28, backgroundColor: '#E1F3DF', borderWidth: 1, borderColor: '#CDE7D0', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  profileInfo: { flex: 1, minWidth: 0 },
  name: { color: '#28553C', fontSize: 12, lineHeight: 16 },
  userId: { color: '#758B7D', fontSize: 8, lineHeight: 12 },
  roleBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 10, backgroundColor: '#DFF5E1', paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
  roleText: { color: '#287043', fontSize: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, backgroundColor: '#E5F7E8', paddingHorizontal: 7, paddingVertical: 4, marginLeft: 4 },
  statusBadgeInactive: { backgroundColor: '#FFF1C8' },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#16884A' },
  inactiveDot: { backgroundColor: '#D69712' },
  activeText: { color: '#287043', fontSize: 7 },
  divider: { height: 1, backgroundColor: '#E5EFE7', marginBottom: 5 },
  detailRow: { minHeight: 31, flexDirection: 'row', alignItems: 'center', gap: 7 },
  detailIcon: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#E7F6E9', alignItems: 'center', justifyContent: 'center' },
  detailLabel: { width: 91, color: '#779083', fontSize: 8 },
  detailValue: { flex: 1, color: '#426652', fontSize: 8 },
  activeValue: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  roleCard: { borderRadius: 13, borderWidth: 1, borderColor: '#D8EADD', backgroundColor: 'rgba(255,255,255,0.95)', padding: 9, marginTop: 9 },
  roleHeading: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  roleHeadingText: { color: '#2B5E43', fontSize: 11 },
  roleActions: { flexDirection: 'row', gap: 7 },
  roleAction: { flex: 1, minHeight: 71, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 6 },
  assignAction: { backgroundColor: '#ECFAEF', borderColor: '#D1EEDD' },
  changeAction: { backgroundColor: '#EFF8FC', borderColor: '#D5EAF2' },
  revokeAction: { backgroundColor: '#FFF1F0', borderColor: '#F3DCDC' },
  roleActionIcon: { width: 32, height: 32, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  assignIcon: { backgroundColor: '#D7F3DD' },
  changeIcon: { backgroundColor: '#DBF0F8' },
  revokeIcon: { backgroundColor: '#FDE1E0' },
  roleActionText: { color: '#426650', fontSize: 8, textAlign: 'center' },
  auditNote: { minHeight: 36, borderRadius: 9, backgroundColor: '#EFF8F5', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, paddingVertical: 5, marginTop: 8 },
  auditText: { flex: 1, color: '#668579', fontSize: 8, lineHeight: 12 },
  demoNote: { color: '#829184', fontSize: 7, textAlign: 'center', marginTop: 7 },
  notFound: { flex: 1, minHeight: 280, alignItems: 'center', justifyContent: 'center', padding: 20 },
  notFoundTitle: { color: '#315E42', fontSize: 14, marginTop: 8 },
  notFoundText: { color: '#758579', fontSize: 10, textAlign: 'center', marginTop: 4 },
  backToUsersButton: { minHeight: 38, borderRadius: 9, backgroundColor: '#176B32', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 13 },
  backToUsersText: { color: '#FFFFFF', fontSize: 10 },
  pressed: { opacity: 0.86 },
});
