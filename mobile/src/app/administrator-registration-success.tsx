import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function AdministratorRegistrationSuccessScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#163E25" />
        </Pressable>
        <View style={styles.content}>
          <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
          <View style={styles.successArtwork}>
            <MaterialCommunityIcons name="leaf" size={29} color="#4C9A36" style={styles.leftLeaf} />
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check" size={52} color="#FFFFFF" />
            </View>
            <MaterialCommunityIcons name="leaf" size={27} color="#71AE45" style={styles.rightLeaf} />
          </View>
          <ThemedText type="smallBold" style={styles.title}>Administrator Access</ThemedText>
          <ThemedText type="smallBold" style={styles.title}>Request Submitted</ThemedText>

          <View style={styles.statusCard}>
            <ThemedText type="smallBold" style={styles.statusLabel}>Account Status</ThemedText>
            <View style={styles.pendingBadge}>
              <MaterialCommunityIcons name="star-four-points" size={16} color="#E0A000" />
              <ThemedText type="smallBold" style={styles.pendingText}>Pending Authorization</ThemedText>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/login?role=admin')}
            style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.loginText}>Go to Login</ThemedText>
          </Pressable>

          <View style={styles.securityArtwork}>
            <MaterialCommunityIcons name="leaf" size={30} color="#70AD45" style={styles.securityLeafLeft} />
            <View style={styles.shield}>
              <MaterialCommunityIcons name="shield-lock" size={72} color="#176B32" />
              <MaterialCommunityIcons name="lock" size={24} color="#FFFFFF" style={styles.lock} />
            </View>
            <MaterialCommunityIcons name="leaf" size={29} color="#4D9838" style={styles.securityLeafRight} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(249,255,246,0.73)' },
  safeArea: { flex: 1, paddingHorizontal: 22 },
  backButton: { width: 36, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 12 },
  logo: { width: 100, height: 52, marginBottom: 6 },
  successArtwork: { width: 136, height: 113, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  successIcon: { width: 88, height: 88, borderRadius: 46, backgroundColor: '#37A33E', borderWidth: 7, borderColor: 'rgba(211,242,198,0.9)', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  leftLeaf: { position: 'absolute', left: 2, bottom: 13, transform: [{ rotate: '-38deg' }] },
  rightLeaf: { position: 'absolute', right: 1, bottom: 18, transform: [{ rotate: '38deg' }] },
  title: { color: '#174A2A', fontSize: 20, lineHeight: 26, textAlign: 'center' },
  statusCard: { width: '100%', borderRadius: 12, borderWidth: 1, borderColor: '#D7E6D9', backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', paddingVertical: 15, marginTop: 22, marginBottom: 16 },
  statusLabel: { color: '#3F5945', fontSize: 12, marginBottom: 9 },
  pendingBadge: { borderRadius: 20, backgroundColor: '#FFF0C2', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, gap: 6 },
  pendingText: { color: '#815500', fontSize: 11 },
  loginButton: { width: '100%', minHeight: 48, borderRadius: 11, backgroundColor: '#176B32', alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#FFFFFF', fontSize: 14 },
  securityArtwork: { width: 150, height: 105, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  shield: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  lock: { position: 'absolute', top: 33 },
  securityLeafLeft: { position: 'absolute', left: 4, bottom: 12, transform: [{ rotate: '-35deg' }] },
  securityLeafRight: { position: 'absolute', right: 3, bottom: 15, transform: [{ rotate: '35deg' }] },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
