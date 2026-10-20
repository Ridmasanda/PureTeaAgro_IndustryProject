import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function FieldOfficerRegistrationSuccessScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Image
            accessibilityLabel="PureTeaAgro"
            source={require('@/assets/images/logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />

          <View style={styles.successIconOuter}>
            <View style={styles.successIconMiddle}>
              <View style={styles.successIcon}>
                <MaterialCommunityIcons name="check" size={43} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.title}>
            Registration Submitted!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Your field officer account has been{`\n`}successfully submitted.
          </ThemedText>

          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIcon}>
                <MaterialCommunityIcons name="card-account-details-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.statusDetails}>
                <ThemedText style={styles.statusLabel}>Officer ID</ThemedText>
                <ThemedText type="smallBold" style={styles.statusValue}>
                  FO-00123
                </ThemedText>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.statusRow}>
              <View style={styles.statusIcon}>
                <MaterialCommunityIcons name="check-circle-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.statusDetails}>
                <ThemedText style={styles.statusLabel}>Account Status</ThemedText>
              </View>
              <View style={styles.pendingBadge}>
                <MaterialCommunityIcons name="timer-sand" size={12} color="#875C00" />
                <ThemedText style={styles.pendingText}>Pending Verification</ThemedText>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityLabel="Go to Login"
            accessibilityRole="button"
            onPress={() => router.replace('/login')}
            style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}>
            <ThemedText type="smallBold" style={styles.loginText}>
              Go to Login
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 7,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 22,
  },
  logo: {
    width: 150,
    height: 35,
  },
  successIconOuter: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 2,
    borderColor: '#9BE6BB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 31,
  },
  successIconMiddle: {
    width: 91,
    height: 91,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: '#B8EED0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1BA052',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B7B43',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    color: '#174D2C',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
    marginTop: 19,
  },
  subtitle: {
    color: '#63806D',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
  statusCard: {
    width: '88%',
    borderRadius: 13,
    backgroundColor: 'rgba(241, 252, 246, 0.94)',
    borderWidth: 1,
    borderColor: '#D5EDE0',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 20,
  },
  statusRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 35,
    height: 35,
    borderRadius: 9,
    backgroundColor: '#2CA863',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  statusDetails: {
    flex: 1,
  },
  statusLabel: {
    color: '#698074',
    fontSize: 9,
    lineHeight: 13,
  },
  statusValue: {
    color: '#194C30',
    fontSize: 13,
    lineHeight: 17,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#D8EDE0',
    marginVertical: 8,
    marginLeft: 48,
  },
  pendingBadge: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0CF69',
    backgroundColor: '#FFF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  pendingText: {
    color: '#875C00',
    fontSize: 9,
    lineHeight: 12,
  },
  loginButton: {
    width: '88%',
    height: 46,
    borderRadius: 24,
    backgroundColor: '#087338',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#F8FFF6',
    fontSize: 12,
    lineHeight: 16,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
