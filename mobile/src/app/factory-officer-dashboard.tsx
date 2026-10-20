import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
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

const green = '#07824D';
const darkGreen = '#075A38';

const stats: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  background: string;
  color: string;
}[] = [
  {
    label: 'Green Leaf Received',
    value: '1,250 kg',
    detail: 'Today',
    icon: 'leaf',
    background: '#EFF8F2',
    color: '#07824D',
  },
  {
    label: 'Processing Batches',
    value: '04',
    detail: 'Active',
    icon: 'database-outline',
    background: '#EFF5FF',
    color: '#3474E8',
  },
  {
    label: 'Pending Chemical Orders',
    value: '01',
    detail: 'To be processed',
    icon: 'flask-outline',
    background: '#FFF8E9',
    color: '#D48A08',
  },
  {
    label: 'PHI Checks',
    value: '02',
    detail: 'Pending',
    icon: 'shield-check-outline',
    background: '#FFF0F1',
    color: '#E34654',
  },
];

const quickActions: { label: string; icon: IconName; color: string }[] = [
  { label: 'Green Leaf Book', icon: 'book-open-variant', color: '#078C54' },
  { label: 'Production', icon: 'factory', color: '#2878E7' },
  { label: 'Chemical Order', icon: 'flask-outline', color: '#EC8424' },
  { label: 'Tea Dispatch', icon: 'truck-delivery-outline', color: '#7D63CB' },
];

const activities: { title: string; detail: string; time: string; icon: IconName; color: string }[] = [
  {
    title: 'Green leaf record added',
    detail: 'COL-000125 • 245 kg',
    time: '10:30 AM',
    icon: 'leaf',
    color: '#09A665',
  },
  {
    title: 'Batch updated',
    detail: 'Batch #004 • Processing',
    time: '09:45 AM',
    icon: 'cog-outline',
    color: '#3474E8',
  },
  {
    title: 'Chemical order received',
    detail: 'Order #CH-019 • Pending',
    time: '09:15 AM',
    icon: 'flask-outline',
    color: '#EC8424',
  },
];

function StatCard({
  label,
  value,
  detail,
  icon,
  background,
  color,
}: (typeof stats)[number]) {
  return (
    <View style={[styles.statCard, { backgroundColor: background }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <MaterialCommunityIcons name={icon} size={17} color={color} />
      </View>
      <ThemedText type="small" style={styles.statLabel}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={[styles.statValue, { color }]}>
        {value}
      </ThemedText>
      <ThemedText type="small" style={styles.statDetail}>
        {detail}
      </ThemedText>
    </View>
  );
}

function DashboardAction({ label, icon, color }: (typeof quickActions)[number]) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        if (label === 'Green Leaf Book') {
          router.push('/green-leaf-book');
        } else if (label === 'Chemical Order') {
          router.push('/chemical-order');
        } else if (label === 'Production') {
          router.push('/tea-production');
        } else if (label === 'Tea Dispatch') {
          router.push('/tea-dispatch');
        }
      }}
      style={({ pressed }) => [styles.actionButton, { backgroundColor: color }, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={17} color="#FFFFFF" />
      <ThemedText type="smallBold" style={styles.actionLabel}>
        {label}
      </ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={17} color="#FFFFFF" />
    </Pressable>
  );
}

export default function FactoryOfficerDashboardScreen() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-tie" size={25} color={green} />
          </View>
          <View style={styles.greeting}>
            <ThemedText type="small" style={styles.goodMorning}>
              Good Morning,
            </ThemedText>
            <ThemedText type="smallBold" style={styles.officerName}>
              Officer
            </ThemedText>
            <ThemedText type="small" style={styles.factoryName}>
              Tea Factory
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/factory-officer-notifications')}
            style={styles.headerButton}>
            <MaterialCommunityIcons name="bell-badge-outline" size={19} color="#31463A" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={() => router.push('/factory-officer-profile')}
            style={styles.headerButton}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#31463A" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.statusCard}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionMarker}>
                <MaterialCommunityIcons name="chart-box-outline" size={15} color={green} />
              </View>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Today’s Factory Status
              </ThemedText>
            </View>
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </View>
          </View>

          <View style={styles.quickActionsSection}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={17} color="#07824D" />
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Quick Actions
              </ThemedText>
            </View>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <DashboardAction key={action.label} {...action} />
              ))}
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#718174" />
                <ThemedText type="smallBold" style={styles.sectionTitle}>
                  Recent Activities
                </ThemedText>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/factory-officer-notifications')}>
                <ThemedText type="smallBold" style={styles.viewAll}>
                  View All
                </ThemedText>
              </Pressable>
            </View>
            {activities.map((activity, index) => (
              <View
                key={activity.title}
                style={[styles.activityRow, index < activities.length - 1 && styles.activityDivider]}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}18` }]}>
                  <MaterialCommunityIcons name={activity.icon} size={15} color={activity.color} />
                </View>
                <View style={styles.activityDescription}>
                  <ThemedText type="smallBold" style={styles.activityTitle}>
                    {activity.title}
                  </ThemedText>
                  <ThemedText type="small" style={styles.activityDetail}>
                    {activity.detail}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.activityTime}>
                  {activity.time}
                </ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.bottomSpace} />
        </ScrollView>

        <View style={styles.bottomNav}>
          {(
            [
              ['Home', 'home'],
              ['Books', 'book-open-variant'],
              ['Alerts', 'bell-outline'],
              ['Reports', 'chart-bar'],
              ['Profile', 'account-outline'],
            ] as [string, IconName][]
          ).map(([label, icon]) => {
            const selected = activeTab === label;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                key={label}
                onPress={() => {
                  if (label === 'Books') {
                    router.push('/factory-books');
                    return;
                  }
                  if (label === 'Alerts') {
                    router.push('/factory-officer-notifications');
                    return;
                  }
                  if (label === 'Reports') {
                    router.push('/factory-reports');
                    return;
                  }
                  if (label === 'Profile') {
                    router.push('/factory-officer-profile');
                    return;
                  }
                  setActiveTab(label);
                }}
                style={styles.navItem}>
                <MaterialCommunityIcons name={icon} size={19} color={selected ? green : '#78837B'} />
                <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(249, 253, 247, 0.84)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9F2E3',
    borderWidth: 1,
    borderColor: '#BCE4CA',
  },
  greeting: {
    flex: 1,
  },
  goodMorning: {
    color: '#637269',
    fontSize: 10,
    lineHeight: 13,
  },
  officerName: {
    color: '#1D3325',
    fontSize: 15,
    lineHeight: 18,
  },
  factoryName: {
    color: green,
    fontSize: 9,
    lineHeight: 12,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: '#E6ECE5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 3,
  },
  statusCard: {
    padding: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#294A31',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionMarker: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#EAF6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#23362A',
    fontSize: 12,
    lineHeight: 17,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginTop: 9,
  },
  statCard: {
    width: '48.7%',
    minHeight: 89,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 11,
  },
  statIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: '#5D6D62',
    fontSize: 9,
    lineHeight: 12,
  },
  statValue: {
    fontSize: 13,
    lineHeight: 17,
    marginTop: 1,
  },
  statDetail: {
    color: '#849087',
    fontSize: 8,
    lineHeight: 11,
  },
  quickActionsSection: {
    marginTop: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 7,
    marginTop: 6,
  },
  actionButton: {
    width: '48.7%',
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    borderRadius: 9,
  },
  actionLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 9,
    lineHeight: 13,
  },
  pressed: {
    opacity: 0.82,
  },
  activityCard: {
    marginTop: 12,
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 3,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#294A31',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewAll: {
    color: green,
    fontSize: 9,
  },
  activityRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  activityDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E9EDE9',
  },
  activityIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDescription: {
    flex: 1,
  },
  activityTitle: {
    color: '#34443A',
    fontSize: 9,
    lineHeight: 13,
  },
  activityDetail: {
    color: '#869188',
    fontSize: 8,
    lineHeight: 11,
  },
  activityTime: {
    color: '#8A948D',
    fontSize: 8,
  },
  bottomSpace: {
    height: 10,
  },
  bottomNav: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: -15,
    borderTopWidth: 1,
    borderTopColor: '#E7ECE6',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  navItem: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  navLabel: {
    color: '#78837B',
    fontSize: 8,
    lineHeight: 12,
  },
  navLabelSelected: {
    color: green,
    fontWeight: '700',
  },
});
