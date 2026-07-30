import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function LoginScreen() {
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#3A4D35" />
        </Pressable>

        <View style={styles.content}>
          <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logoImage} />

          <ThemedText type="subtitle" style={styles.title}>
            Welcome Back!{` `}
            <MaterialCommunityIcons name="leaf" size={22} color="#2E7A33" />
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Login to continue your journey with PureTeaAgro
          </ThemedText>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialCommunityIcons name="account-outline" size={18} color="#4D7D4F" />
                <ThemedText type="smallBold" style={styles.labelText}>
                  NIC Number
                </ThemedText>
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  value={nic}
                  onChangeText={setNic}
                  placeholder="Enter your NIC number"
                  placeholderTextColor="#8A918F"
                  style={styles.input}
                  autoCapitalize="characters"
                />
                <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#4D7D4F" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MaterialCommunityIcons name="lock-outline" size={18} color="#4D7D4F" />
                <ThemedText type="smallBold" style={styles.labelText}>
                  Password
                </ThemedText>
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#8A918F"
                  style={styles.input}
                  secureTextEntry
                />
                <MaterialCommunityIcons name="eye-off-outline" size={18} color="#4D7D4F" />
              </View>
            </View>

            <Pressable accessibilityRole="button" style={styles.forgotPasswordButton}>
              <ThemedText type="smallBold" style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </Pressable>

            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.loginButton, pressed && styles.loginPressed]}>
              <MaterialCommunityIcons name="login" size={22} color="#F8FFF6" />
              <ThemedText type="smallBold" style={styles.loginText}>
                Login
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityIconWrap}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color="#FFFFFF" />
            </View>

            <View style={styles.securityTextWrap}>
              <ThemedText type="smallBold" style={styles.securityTitle}>
                Secure Login
              </ThemedText>
              <ThemedText type="small" style={styles.securityDescription}>
                Your data is protected with advanced security
              </ThemedText>
            </View>

            <MaterialCommunityIcons name="shield-lock-outline" size={34} color="rgba(31,104,49,0.75)" />
          </View>
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 16,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginTop: 25,
    marginBottom: 28,
  },
  title: {
    color: '#1C6A2F',
    fontSize: 41,
    lineHeight: 44,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: '#58645A',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  formCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    color: '#1F2C1F',
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(45,84,45,0.22)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#18271A',
    fontSize: 15,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginTop: 2,
  },
  forgotPasswordText: {
    color: '#2A7B37',
    fontSize: 13,
  },
  loginButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#156E31',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loginPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  loginText: {
    color: '#F8FFF6',
    fontSize: 20,
  },
  securityCard: {
    marginTop: 20,
    width: '100%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(240, 247, 238, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(56, 102, 56, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  securityIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#14682E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextWrap: {
    flex: 1,
  },
  securityTitle: {
    color: '#214B21',
    marginBottom: 2,
  },
  securityDescription: {
    color: '#5E6D5E',
    fontSize: 12,
    lineHeight: 16,
  },
});
