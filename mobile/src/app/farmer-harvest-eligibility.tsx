import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const calendarWeeks = [
  ['30', '31', '1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '10', '11', '12'],
  ['13', '14', '15', '16', '17', '18', '19'],
  ['20', '21', '22', '23', '24', '25', '26'],
  ['27', '28', '29', '30', '1', '2', '3'],
];

export default function FarmerHarvestEligibilityScreen() {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back to farmer dashboard" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#173F25" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.title}>Harvest Eligibility</ThemedText>
            <MaterialCommunityIcons name="leaf" size={29} color="#13813C" />
          </View>

          <ThemedText type="smallBold" style={styles.label}>Select Land</ThemedText>
          <Pressable accessibilityRole="button" accessibilityLabel="Selected land: Green Valley Tea Land" style={styles.landPicker}>
            <Image source={require('@/assets/images/background.png')} style={styles.landImage} />
            <ThemedText type="smallBold" style={styles.landName}>Green Valley Tea Land</ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#255C50" />
          </Pressable>

          <View style={styles.eligibilityCard}>
            <View style={styles.eligibilityHeading}>
              <MaterialCommunityIcons name="leaf" size={43} color="#07863C" />
              <View>
                <ThemedText type="subtitle" style={styles.eligibleTitle}>ELIGIBLE</ThemedText>
                <ThemedText type="small" style={styles.eligibleSubtitle}>Harvest Eligibility</ThemedText>
              </View>
            </View>
            <View style={styles.nextHarvest}>
              <MaterialCommunityIcons name="calendar-month-outline" size={27} color="#0B6B3B" />
              <View>
                <ThemedText type="small" style={styles.nextLabel}>Next Eligible Harvest</ThemedText>
                <ThemedText type="smallBold" style={styles.nextDate}>28 Sep 2026</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.timeline}>
            <TimelineItem icon="file-document-outline" label="Last Application" value="12 Sep 2026" />
            <TimelineItem icon="timer-outline" label="Waiting Period" value="15 days" />
            <TimelineItem icon="leaf" label="Earliest Harvest" value="27 Sep 2026" />
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.monthHeader}>
              <ThemedText type="smallBold" style={styles.month}>September 2026</ThemedText>
              <MaterialCommunityIcons name="chevron-right" size={21} color="#327761" />
            </View>
            <View style={styles.weekHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <ThemedText key={day} type="small" style={styles.weekDay}>{day}</ThemedText>)}
            </View>
            {calendarWeeks.map((week, weekIndex) => (
              <View key={`${weekIndex}`} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  const isOutsideMonth = (weekIndex === 0 && dayIndex < 2) || (weekIndex === 4 && dayIndex > 3);
                  const isRestricted = ['27', '28'].includes(day) && weekIndex === 3;
                  const isEligible = day === '20' && weekIndex === 3;
                  return (
                    <View key={`${weekIndex}-${dayIndex}`} style={styles.dayCell}>
                      {isEligible ? <View style={styles.selectedDay}><ThemedText type="smallBold" style={styles.selectedDayText}>{day}</ThemedText></View> : <ThemedText type="small" style={[styles.day, isOutsideMonth && styles.outsideDay, isRestricted && styles.restrictedDay]}>{day}</ThemedText>}
                      {isRestricted && <View style={styles.redDot} />}
                    </View>
                  );
                })}
              </View>
            ))}
            <View style={styles.legend}>
              <LegendDot color="#159447" label="Eligible" />
              <LegendDot color="#E43C2F" label="Restricted" />
              <LegendDot color="#8FAFC3" label="Application" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function TimelineItem({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.timelineItem}><View style={styles.timelineIcon}><MaterialCommunityIcons name={icon} size={19} color="#168B3E" /></View><ThemedText type="small" style={styles.timelineLabel}>{label}</ThemedText><ThemedText type="smallBold" style={styles.timelineValue}>{value}</ThemedText></View>;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: color }]} /><ThemedText type="small" style={styles.legendText}>{label}</ThemedText></View>;
}

function NavItem({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={active ? '#168B3E' : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, active && styles.activeLabel]}>{label}</ThemedText>{active && <View style={styles.indicator} />}</Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.65 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 7, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#173F35', fontSize: 18 },
  label: { color: '#4A7180', fontSize: 15, marginBottom: 5 },
  landPicker: { height: 50, borderRadius: 10, borderWidth: 1, borderColor: '#C8E5D8', backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', paddingRight: 10, gap: 9 },
  landImage: { width: 60, height: 48, borderRadius: 8 },
  landName: { flex: 1, color: '#47736D', fontSize: 12 },
  eligibilityCard: { borderRadius: 12, borderWidth: 1.5, borderColor: '#9BE0A8', backgroundColor: 'rgba(239, 255, 237, 0.88)', padding: 12, alignItems: 'center', marginTop: 15 },
  eligibilityHeading: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  eligibleTitle: { color: '#0B713B', fontSize: 25, lineHeight: 29, fontWeight: '800' },
  eligibleSubtitle: { color: '#50906C', fontSize: 11 },
  nextHarvest: { width: '68%', minHeight: 66, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.65)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 },
  nextLabel: { color: '#4E8068', fontSize: 10 },
  nextDate: { color: '#1C6748', fontSize: 20, marginTop: 2 },
  timeline: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2F1E7', marginTop: 15, paddingVertical: 10 },
  timelineItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E2F1E7' },
  timelineIcon: { height: 24, justifyContent: 'center' },
  timelineLabel: { color: '#64847B', fontSize: 9, textAlign: 'center', marginTop: 2 },
  timelineValue: { color: '#34705A', fontSize: 10, marginTop: 2 },
  calendarCard: { borderRadius: 12, borderWidth: 1, borderColor: '#CFE8DA', backgroundColor: 'rgba(255,255,255,0.88)', padding: 12, marginTop: 13 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  month: { color: '#2A5C4F', fontSize: 15 },
  weekHeader: { flexDirection: 'row', marginTop: 12 },
  weekDay: { flex: 1, textAlign: 'center', color: '#8AA09C', fontSize: 8 },
  weekRow: { flexDirection: 'row', minHeight: 29, alignItems: 'center' },
  dayCell: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 29 },
  day: { color: '#47736D', fontSize: 10 },
  outsideDay: { color: '#C2D0CE' },
  restrictedDay: { color: '#E23B36', fontWeight: '700' },
  selectedDay: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#119448', alignItems: 'center', justifyContent: 'center' },
  selectedDayText: { color: '#FFF', fontSize: 10 },
  redDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#EA493C', position: 'absolute', bottom: -1, right: 8 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E4F1E7', paddingTop: 11, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: '#70908A', fontSize: 9 },
  bottomNav: { height: 61, borderTopWidth: 1, borderTopColor: '#D9E9DC', backgroundColor: 'rgba(255,255,255,0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 58, height: 58 },
  navLabel: { color: '#648074', fontSize: 8, marginTop: 2 },
  activeLabel: { color: '#168B3E', fontWeight: '700' },
  indicator: { width: 20, height: 2, borderRadius: 1, backgroundColor: '#168B3E', marginTop: 3 },
});
