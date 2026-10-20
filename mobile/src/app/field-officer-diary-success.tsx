import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function FieldOfficerDiarySuccessScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.successDecor}>
            <MaterialCommunityIcons name="leaf" size={27} color="#56D889" style={styles.leftLeaf} />
            <MaterialCommunityIcons name="leaf" size={34} color="#49C97D" style={styles.rightLeaf} />
            <View style={styles.successCircleOuter}>
              <View style={styles.successCircle}>
                <MaterialCommunityIcons name="check" size={43} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.title}>
            Saved Successfully
          </ThemedText>
          <ThemedText style={styles.subtitle}>Field diary has been recorded.</ThemedText>

          <View style={styles.diaryCard}>
            <View style={styles.diaryIcon}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color="#FFFFFF" />
            </View>
            <View>
              <ThemedText style={styles.diaryLabel}>DIARY ID</ThemedText>
              <ThemedText type="smallBold" style={styles.diaryId}>FD-000125</ThemedText>
            </View>
          </View>

          <Pressable
            accessibilityLabel="Done"
            accessibilityRole="button"
            onPress={() => router.replace('/field-officer-dashboard')}
            style={({ pressed }) => [styles.doneButton, pressed && styles.buttonPressed]}>
            <ThemedText type="smallBold" style={styles.doneText}>Done</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.29)' },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  content: { flex: 1, alignItems: 'center', paddingTop: 90 },
  successDecor: { width: 140, height: 130, alignItems: 'center', justifyContent: 'center' },
  successCircleOuter: {
    width: 99,
    height: 99,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(27, 143, 82, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 87,
    height: 87,
    borderRadius: 44,
    backgroundColor: '#168C4C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0E6D3B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  leftLeaf: { position: 'absolute', left: 6, top: 43, transform: [{ rotate: '-35deg' }] },
  rightLeaf: { position: 'absolute', right: 1, top: 25, transform: [{ rotate: '55deg' }] },
  title: {
    color: '#165631',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: { color: '#6D8477', fontSize: 11, lineHeight: 16, marginTop: 3 },
  diaryCard: {
    width: '82%',
    height: 59,
    borderRadius: 12,
    backgroundColor: 'rgba(237, 252, 243, 0.94)',
    borderWidth: 1,
    borderColor: '#D4EFDE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 14,
  },
  diaryIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#177D4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  diaryLabel: { color: '#589076', fontSize: 8, lineHeight: 11 },
  diaryId: { color: '#205239', fontSize: 12, lineHeight: 16, marginTop: 1 },
  doneButton: {
    width: '82%',
    height: 43,
    borderRadius: 23,
    backgroundColor: '#075F31',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 103,
  },
  doneText: { color: '#FFFFFF', fontSize: 12, lineHeight: 16 },
  buttonPressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
});
