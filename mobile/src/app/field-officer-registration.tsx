import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { saveFieldOfficerDraft } from '@/services/field-officer-registration';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type FormFieldProps = {
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FormFieldProps) {
  return (
    <View style={styles.inputWrap}>
      <MaterialCommunityIcons name={icon} size={18} color="#18753D" />
      <TextInput
        accessibilityLabel={placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8DA2B9"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

export default function FieldOfficerRegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const continueToProfessionalDetails = async () => {
    const values = [fullName, nicNumber, mobileNumber, emailAddress, address];
    if (values.some((value) => !value.trim())) {
      setError('Please complete all personal information fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await saveFieldOfficerDraft({
        fullName: fullName.trim(),
        nic: nicNumber.trim().toUpperCase(),
        mobile: mobileNumber.trim(),
        email: emailAddress.trim().toLowerCase(),
        address: address.trim(),
        employeeId: '',
        organization: '',
        district: '',
        designation: '',
        password: '',
      });
      router.push('/field-officer-professional-registration');
    } catch {
      setError('Unable to save your details. Please try again.');
    } finally {
      setSaving(false);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
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
              <MaterialCommunityIcons name="chevron-left" size={27} color="#34485B" />
            </Pressable>

            <View style={styles.brand}>
              <Image
                accessibilityLabel="PureTeaAgro"
                source={require('@/assets/images/logo.png')}
                resizeMode="contain"
                style={styles.logo}
              />
              <ThemedText type="subtitle" style={styles.title}>
                Field Officer Registration
              </ThemedText>
            </View>

            <View accessibilityLabel="Registration progress" style={styles.steps}>
              {[1, 2, 3, 4].map((step) => (
                <View key={step} style={styles.stepItem}>
                  <View style={[styles.stepCircle, step === 1 && styles.activeStepCircle]}>
                    <ThemedText style={[styles.stepText, step === 1 && styles.activeStepText]}>{step}</ThemedText>
                  </View>
                  {step < 4 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>

            <View style={styles.form}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                1. Personal Information
              </ThemedText>

              <FormField
                icon="account-outline"
                onChangeText={setFullName}
                placeholder="Full Name"
                value={fullName}
              />
              <FormField
                autoCapitalize="characters"
                icon="card-account-details-outline"
                onChangeText={setNicNumber}
                placeholder="NIC Number"
                value={nicNumber}
              />
              <FormField
                icon="phone-outline"
                keyboardType="phone-pad"
                onChangeText={setMobileNumber}
                placeholder="Mobile Number"
                value={mobileNumber}
              />
              <FormField
                autoCapitalize="none"
                icon="email-outline"
                keyboardType="email-address"
                onChangeText={setEmailAddress}
                placeholder="Email Address"
                value={emailAddress}
              />
              <FormField
                icon="map-marker-outline"
                onChangeText={setAddress}
                placeholder="Address"
                value={address}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue to the next registration step"
              disabled={saving}
              onPress={continueToProfessionalDetails}
              style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}>
              <ThemedText type="smallBold" style={styles.nextButtonText}>
                Next
              </ThemedText>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#F8FFF6" />
            </Pressable>
            {error ? (
              <ThemedText accessibilityRole="alert" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 7,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 18,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  brand: {
    alignItems: 'center',
    marginTop: 1,
  },
  logo: {
    width: 127,
    height: 31,
  },
  title: {
    color: '#1D2A3E',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    marginTop: 6,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 18,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#C7D6E5',
    backgroundColor: 'rgba(255,255,255,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepCircle: {
    borderColor: '#075A2E',
    backgroundColor: '#075A2E',
  },
  stepText: {
    color: '#A9B9CB',
    fontSize: 11,
    lineHeight: 14,
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 10,
    height: 1,
    backgroundColor: '#D2DCE7',
    marginHorizontal: 5,
  },
  form: {
    paddingHorizontal: 21,
  },
  sectionTitle: {
    color: '#1D2A3E',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 11,
  },
  inputWrap: {
    height: 35,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#B8F0D3',
    backgroundColor: 'rgba(255,255,255,0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: '#26384D',
    fontSize: 11,
    lineHeight: 15,
    marginLeft: 10,
    paddingVertical: 0,
  },
  errorText: {
    color: '#B42318',
    fontSize: 10,
    lineHeight: 14,
    marginHorizontal: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  nextButton: {
    height: 36,
    borderRadius: 20,
    backgroundColor: '#075A2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 21,
    marginTop: 'auto',
  },
  nextButtonText: {
    color: '#F8FFF6',
    fontSize: 11,
    lineHeight: 15,
  },
  nextButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
