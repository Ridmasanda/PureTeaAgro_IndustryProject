import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function ResetPasswordScreen() {
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={25} color="#163E25" />
          </Pressable>

          <View style={styles.securityIllustration}>
            <MaterialCommunityIcons name="shield-lock" size={86} color="#08702F" />
            <MaterialCommunityIcons name="lock" size={27} color="#E9F7E3" style={styles.lockIcon} />
          </View>

          <ThemedText type="subtitle" style={styles.title}>
            Reset password
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            We'll send you an OTP to your registered{`\n`}NIC / Email / Mobile.
          </ThemedText>

          <View style={styles.form}>
            <InputRow icon="email-outline">
              <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="NIC / Email / Mobile"
                placeholderTextColor="#87928C"
                style={styles.input}
                autoCapitalize="none"
              />
            </InputRow>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}>
              <MaterialCommunityIcons name="send-outline" size={21} color="#F8FFF6" />
              <ThemedText type="smallBold" style={styles.actionText}>
                Send OTP
              </ThemedText>
            </Pressable>

            <View style={styles.sectionDivider}>
              <View style={styles.dividerLine} />
              <ThemedText type="smallBold" style={styles.dividerText}>
                OTP Verification
              </ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <InputRow icon="shield-key-outline" trailingText={formatTimer(secondsLeft)}>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6 digit OTP"
                placeholderTextColor="#87928C"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
              />
            </InputRow>

            <InputRow
              icon="lock-outline"
              trailingIcon={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
              onTrailingPress={() => setShowNewPassword((visible) => !visible)}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#87928C"
                style={styles.input}
                secureTextEntry={!showNewPassword}
              />
            </InputRow>

            <InputRow
              icon="lock-outline"
              trailingIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              onTrailingPress={() => setShowConfirmPassword((visible) => !visible)}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#87928C"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
              />
            </InputRow>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.actionButton, styles.resetButton, pressed && styles.buttonPressed]}>
              <MaterialCommunityIcons name="lock-reset" size={23} color="#F8FFF6" />
              <ThemedText type="smallBold" style={styles.actionText}>
                Reset Password
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function InputRow({
  icon,
  trailingIcon,
  trailingText,
  onTrailingPress,
  children,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  trailingIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  trailingText?: string;
  onTrailingPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.inputRow}>
      <MaterialCommunityIcons name={icon} size={21} color="#254C35" />
      {children}
      {trailingText && <ThemedText type="small" style={styles.timer}>{trailingText}</ThemedText>}
      {trailingIcon && (
        <Pressable accessibilityRole="button" onPress={onTrailingPress} hitSlop={8}>
          <MaterialCommunityIcons name={trailingIcon} size={20} color="#52645A" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(252, 255, 249, 0.72)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 34,
  },
  content: {
    paddingBottom: 26,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    marginBottom: 2,
  },
  securityIllustration: {
    height: 115,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    marginBottom: 2,
  },
  lockIcon: {
    position: 'absolute',
    top: 46,
  },
  title: {
    color: '#073F20',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#425A4B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 13,
  },
  form: {
    width: '100%',
    gap: 11,
  },
  inputRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD4CF',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#18271A',
    fontSize: 14,
  },
  timer: {
    color: '#74827A',
    fontSize: 12,
  },
  actionButton: {
    minHeight: 47,
    borderRadius: 12,
    backgroundColor: '#08702F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    shadowColor: '#174E27',
    shadowOpacity: 0.16,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  resetButton: {
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  actionText: {
    color: '#F8FFF6',
    fontSize: 16,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 1,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#8B9A90',
  },
  dividerText: {
    color: '#40584A',
    fontSize: 14,
  },
});
