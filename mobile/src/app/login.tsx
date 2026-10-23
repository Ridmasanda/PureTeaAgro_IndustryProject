import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { login as loginWithApi } from '@/services/auth-api';

export default function LoginScreen() {
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = async () => {
    setLoginError('');

    setIsSigningIn(true);

    try {
      const { user } = await loginWithApi(emailInput.trim(), password);

      if (user.role === 'farmer') {
      router.replace('/farmer-dashboard');
      } else if (user.role === 'tea-inspector') {
      router.replace('/tea-inspector-dashboard');
      } else if (user.role === 'factory-officer') {
      router.replace('/factory-officer-dashboard');
      } else if (user.role === 'administrator') {
      router.replace('/administrator-home');
      } else {
      router.replace('/collector-home');
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

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

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
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
                <MaterialCommunityIcons name="email-outline" size={18} color="#4D7D4F" />
                <ThemedText type="smallBold" style={styles.labelText}>
                  Email Address
                </ThemedText>
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  accessibilityLabel="Email address"
                  value={emailInput}
                  onChangeText={(value) => {
                    setEmailInput(value);
                    setLoginError('');
                  }}
                  placeholder="Enter your email address"
                  placeholderTextColor="#8A918F"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                <MaterialCommunityIcons name="email-outline" size={18} color="#4D7D4F" />
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
                  accessibilityLabel="Password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setLoginError('');
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#8A918F"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="go"
                  onSubmitEditing={signIn}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={8}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color="#4D7D4F"
                  />
                </Pressable>
              </View>
              <ThemedText type="small" style={styles.demoNote}>
                Demo login: credentials are not verified by a server.
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/reset-password')}
              style={styles.forgotPasswordButton}>
              <ThemedText type="smallBold" style={styles.forgotPasswordText}>
                Forgot Password?
              </ThemedText>
            </Pressable>

            {loginError ? (
              <ThemedText accessibilityRole="alert" type="small" style={styles.loginError}>
                {loginError}
              </ThemedText>
            ) : null}

            <Pressable
              accessibilityLabel="Login"
              accessibilityRole="button"
              onPress={signIn}
              style={({ pressed }) => [styles.loginButton, pressed && styles.loginPressed]}>
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
        </ScrollView>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 16,
  },
  logoImage: {
    width: 250,
    height: 250,
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
  roleSwitch: {
    width: '100%',
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBE4CE',
    backgroundColor: 'rgba(245,255,246,0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 10,
  },
  roleSwitchText: {
    flex: 1,
    color: '#235D35',
    fontSize: 12,
  },
  roleSwitchAction: {
    color: '#168B3E',
    fontSize: 11,
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
  demoNote: {
    color: '#758276',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  roleOption: {
    minHeight: 40,
    width: '31%',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(45,84,45,0.2)',
    backgroundColor: '#F7FAF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    gap: 5,
  },
  roleOptionSelected: {
    borderColor: '#156E31',
    backgroundColor: '#156E31',
  },
  roleOptionText: {
    color: '#416347',
    fontSize: 10,
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: '#FFFFFF',
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
  loginError: {
    color: '#B42318',
    fontSize: 12,
    marginBottom: 10,
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
