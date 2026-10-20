import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ComponentProps } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Metric = {
  icon: IconName;
  label: string;
  value: string;
  suffix?: string;
  tone: 'green' | 'yellow' | 'mint' | 'red';
};

const metrics: Metric[] = [
  { icon: 'account-group-outline', label: 'Farmers', value: '12', tone: 'green' },
  { icon: 'clipboard-text-outline', label: 'Pending Field Visits', value: '4', tone: 'yellow' },
  { icon: 'leaf', label: 'Leaf Collection', value: '1,240', suffix: ' kg', tone: 'mint' },
  { icon: 'alert-circle', label: 'Issues', value: '2', tone: 'red' },
];

const activities: { icon: IconName; title: string; detail: string; tone: 'green' | 'yellow' }[] = [
  { icon: 'check', title: 'Field visit completed', detail: 'Nimal Perera · 25 Sep 202', tone: 'green' },
  { icon: 'leaf', title: 'Collection recorded', detail: 'COL-00125 · 245 kg', tone: 'green' },
  { icon: 'alert-outline', title: 'Inspection required', detail: 'Tea land - Kandy', tone: 'yellow' },
];

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <View style={[styles.metricCard, styles[`${metric.tone}Card`]]}>
      <View style={[styles.metricIcon, styles[`${metric.tone}Icon`]]}>
        <MaterialCommunityIcons name={metric.icon} size={17} color={styles[`${metric.tone}IconColor`].color} />
      </View>
      <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
      <ThemedText type="smallBold" style={styles.metricValue}>
        {metric.value}
        {metric.suffix && <ThemedText style={styles.metricSuffix}>{metric.suffix}</ThemedText>}
      </ThemedText>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}>
      <View style={styles.actionIcon}>
        <MaterialCommunityIcons name={icon} size={17} color="#187B48" />
      </View>
      <ThemedText type="small" style={styles.actionLabel}>
        {label}
      </ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={21} color="#278A62" />
    </Pressable>
  );
}

export default function FieldOfficerDashboardScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account-tie" size={25} color="#165A37" />
              </View>
              <View style={styles.greeting}>
                <ThemedText style={styles.goodMorning}>Good Morning,</ThemedText>
                <ThemedText type="smallBold" style={styles.officerName}>
                  Field Officer
                </ThemedText>
                <ThemedText style={styles.brandName}>PureTeaAgro</ThemedText>
              </View>
              <Pressable
                accessibilityLabel="Notifications"
                accessibilityRole="button"
                onPress={() => router.push('./field-officer-notifications')}
                style={styles.notificationButton}>
                <MaterialCommunityIcons name="bell-outline" size={21} color="#17633D" />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>

            <ThemedText type="smallBold" style={styles.sectionHeading}>
              <MaterialCommunityIcons name="lightning-bolt" size={15} color="#16804A" /> Today's Work
            </ThemedText>

            <View style={styles.metricsGrid}>
              {metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </View>

            <ThemedText type="smallBold" style={[styles.sectionHeading, styles.quickHeading]}>
              <MaterialCommunityIcons name="lightning-bolt" size={15} color="#16804A" /> Quick Actions
            </ThemedText>
            <View style={styles.actions}>
              <QuickAction
                icon="clipboard-edit-outline"
                label="Record Field Diary"
                onPress={() => router.push('./field-officer-diary')}
              />
              <QuickAction
                icon="leaf"
                label="Record Leaf Collection"
                onPress={() => router.push('./field-officer-collections')}
              />
              <QuickAction
                icon="account-group-outline"
                label="View Farmers"
                onPress={() => router.push('/field-officer-farmers')}
              />
            </View>

            <ThemedText type="smallBold" style={[styles.sectionHeading, styles.activityHeading]}>
              <MaterialCommunityIcons name="history" size={15} color="#16804A" /> Recent Activity
            </ThemedText>
            <View style={styles.activityList}>
              {activities.map((activity) => (
                <Pressable
                  accessibilityLabel={`${activity.title}, ${activity.detail}`}
                  accessibilityRole="button"
                  key={activity.title}
                  style={({ pressed }) => [styles.activityRow, pressed && styles.actionPressed]}>
                  <View style={[styles.activityIcon, activity.tone === 'yellow' && styles.activityIconYellow]}>
                    <MaterialCommunityIcons
                      name={activity.icon}
                      size={16}
                      color={activity.tone === 'yellow' ? '#DB8A00' : '#1A9A5E'}
                    />
                  </View>
                  <View style={styles.activityDetails}>
                    <ThemedText type="smallBold" style={styles.activityTitle}>
                      {activity.title}
                    </ThemedText>
                    <ThemedText style={styles.activityDetail}>{activity.detail}</ThemedText>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={19} color="#A2AFBC" />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.bottomNavigation}>
            <BottomTab icon="home" label="Home" active />
            <BottomTab
              icon="account-group-outline"
              label="Farmers"
              onPress={() => router.push('/field-officer-farmers')}
            />
            <BottomTab icon="leaf" label="Collections" onPress={() => router.push('./field-officer-collections')} />
            <BottomTab icon="clipboard-text-outline" label="Diary" onPress={() => router.push('./field-officer-diary-history')} />
            <BottomTab icon="account-outline" label="Profile" onPress={() => router.push('./field-officer-profile')} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
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
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#16834B' : '#A2AABA'} />
      <ThemedText style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.37)',
  },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  page: { flex: 1 },
  scrollContent: { paddingBottom: 10 },
  header: {
    minHeight: 76,
    backgroundColor: 'rgba(245, 255, 249, 0.74)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D7E9DD',
    backgroundColor: '#E9F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { flex: 1, marginLeft: 10 },
  goodMorning: { color: '#4D8469', fontSize: 9, lineHeight: 12 },
  officerName: { color: '#174A30', fontSize: 16, lineHeight: 19 },
  brandName: { color: '#138149', fontSize: 9, lineHeight: 12 },
  notificationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5FFF8',
    borderWidth: 1,
    borderColor: '#CDE5D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E75252',
  },
  sectionHeading: {
    color: '#16452A',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 7,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    rowGap: 7,
  },
  metricCard: {
    width: '48.5%',
    height: 75,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
  },
  greenCard: { backgroundColor: 'rgba(233, 247, 238, 0.94)', borderColor: '#D6EDDE' },
  yellowCard: { backgroundColor: 'rgba(255, 249, 234, 0.94)', borderColor: '#F4E4BE' },
  mintCard: { backgroundColor: 'rgba(234, 249, 241, 0.94)', borderColor: '#D4EDDF' },
  redCard: { backgroundColor: 'rgba(255, 241, 241, 0.94)', borderColor: '#F2DADA' },
  metricIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  greenIcon: { backgroundColor: '#D0EFE0' },
  yellowIcon: { backgroundColor: '#FFEAB5' },
  mintIcon: { backgroundColor: '#D0F1E1' },
  redIcon: { backgroundColor: '#FFD9D9' },
  greenIconColor: { color: '#17814A' },
  yellowIconColor: { color: '#B37B0D' },
  mintIconColor: { color: '#17814A' },
  redIconColor: { color: '#D73C3C' },
  metricLabel: { color: '#658071', fontSize: 8, lineHeight: 11 },
  metricValue: { color: '#164A2D', fontSize: 17, lineHeight: 20 },
  metricSuffix: { color: '#164A2D', fontSize: 10, lineHeight: 14 },
  quickHeading: { marginTop: 11 },
  actions: { paddingHorizontal: 10, gap: 7 },
  actionButton: {
    height: 39,
    borderRadius: 11,
    backgroundColor: 'rgba(236, 249, 241, 0.94)',
    borderWidth: 1,
    borderColor: '#D6ECDE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  actionButtonPrimary: { backgroundColor: '#198448', borderColor: '#198448' },
  actionIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#D2F0DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionLabel: { flex: 1, color: '#185133', fontSize: 10, lineHeight: 14 },
  actionPressed: { opacity: 0.82 },
  activityHeading: { marginTop: 12 },
  activityList: { paddingHorizontal: 10, gap: 7 },
  activityRow: {
    minHeight: 42,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E3E9E6',
  },
  activityIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#D9F3E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  activityIconYellow: { backgroundColor: '#FFF0C6' },
  activityDetails: { flex: 1 },
  activityTitle: { color: '#263D30', fontSize: 9, lineHeight: 12 },
  activityDetail: { color: '#82918A', fontSize: 8, lineHeight: 11 },
  bottomNavigation: {
    height: 57,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E4E8E6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomTab: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 54 },
  bottomLabel: { color: '#9CA6B3', fontSize: 8, lineHeight: 11 },
  bottomLabelActive: { color: '#16834B', fontWeight: '700' },
});
