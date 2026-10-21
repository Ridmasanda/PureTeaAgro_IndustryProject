import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function CollectorRegistrationSuccessScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />

          <View style={styles.successIconWrap}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check" size={58} color="#FFFFFF" />
            </View>
            <MaterialCommunityIcons name="leaf" size={31} color="#4C9A36" style={styles.leftLeaf} />
            <MaterialCommunityIcons name="leaf" size={29} color="#71AE45" style={styles.rightLeaf} />
          </View>

          <ThemedText type="smallBold" style={styles.title}>
            Leaf Collector
          </ThemedText>
          <ThemedText type="smallBold" style={styles.title}>
            Registration Submitted
          </ThemedText>

          <View style={styles.statusCard}>
            <ThemedText type="smallBold" style={styles.statusLabel}>
              Account Status
            </ThemedText>
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons name="clock-time-four" size={16} color="#D98B00" />
              <ThemedText type="smallBold" style={styles.statusText}>
                Pending Verification
              </ThemedText>
            </View>
          </View>

          <Pressable
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
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(249, 255, 246, 0.73)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  logo: {
    width: 100,
    height: 52,
    marginBottom: 24,
  },
  successIconWrap: {
    width: 136,
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  successIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#37A33E',
    borderWidth: 7,
    borderColor: 'rgba(211,242,198,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B722C',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  leftLeaf: {
    position: 'absolute',
    left: 3,
    bottom: 17,
    transform: [{ rotate: '-38deg' }],
  },
  rightLeaf: {
    position: 'absolute',
    right: 1,
    bottom: 22,
    transform: [{ rotate: '38deg' }],
  },
  title: {
    color: '#174A2A',
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7E6D9',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 26,
    marginBottom: 18,
  },
  statusLabel: {
    color: '#3F5945',
    fontSize: 12,
    marginBottom: 9,
  },
  statusBadge: {
    borderRadius: 20,
    backgroundColor: '#FFF0C2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  statusText: {
    color: '#815500',
    fontSize: 12,
  },
  loginButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: '#176B32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
