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
import { register } from '@/services/auth-api';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type CollectorDetails = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  address: string;
  collectorId: string;
  district: string;
  collectionArea: string;
  factory: string;
  vehicleNumber: string;
  password: string;
  confirmPassword: string;
};

const initialDetails: CollectorDetails = {
  fullName: '',
  nic: '',
  mobile: '',
  email: '',
  address: '',
  collectorId: '',
  district: '',
  collectionArea: '',
  factory: '',
  vehicleNumber: '',
  password: '',
  confirmPassword: '',
};

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  trailingIcon,
}: {
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  trailingIcon?: IconName;
}) {
  return (
    <View style={styles.inputWrap}>
      <MaterialCommunityIcons name={icon} size={17} color="#4D7D4F" />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#839087"
        style={styles.input}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
      {trailingIcon && <MaterialCommunityIcons name={trailingIcon} size={17} color="#4D7D4F" />}
    </View>
  );
}

export default function CollectorRegistrationScreen() {
  const [details, setDetails] = useState(initialDetails);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: keyof CollectorDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  async function submitRegistration() {
    if (Object.values(details).some((value) => !value.trim())) {
      setError('Please complete all fields before creating your account.');
      return;
    }

    if (details.password !== details.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please agree to the terms and conditions to continue.');
      return;
    }

    try {
      await register({
        fullName: details.fullName.trim(),
        email: details.email.trim().toLowerCase(),
        password: details.password,
        role: 'leaf-collector',
        nic: details.nic.trim().toUpperCase(),
        mobile: details.mobile.trim(),
        address: details.address.trim(),
        district: details.district.trim(),
        factory: details.factory.trim(),
        employeeId: details.collectorId.trim().toUpperCase(),
      });
      router.push('/collector-registration-success');
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Registration failed.');
    }
  }

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
          style={styles.keyboardArea}>
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
              <MaterialCommunityIcons name="arrow-left" size={22} color="#163E25" />
            </Pressable>

            <View style={styles.brandRow}>
              <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
              <ThemedText type="smallBold" style={styles.brandText}>
                PureTeaAgro
              </ThemedText>
            </View>

            <ThemedText type="smallBold" style={styles.title}>
              Leaf Collector Registration
            </ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              Create your Leaf Collector account
            </ThemedText>

            <View style={styles.progressRow}>
              <View style={styles.progressStepActive}>
                <ThemedText type="smallBold" style={styles.progressTextActive}>1</ThemedText>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <ThemedText type="smallBold" style={styles.progressText}>2</ThemedText>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <ThemedText type="smallBold" style={styles.progressText}>3</ThemedText>
              </View>
              <View style={styles.progressLine} />
              <View style={styles.progressStep}>
                <ThemedText type="smallBold" style={styles.progressText}>4</ThemedText>
              </View>
            </View>

            <View style={styles.formCard}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                1. Personal Information
              </ThemedText>
              <FormField
                icon="account-outline"
                placeholder="Full Name"
                value={details.fullName}
                onChangeText={(value) => updateField('fullName', value)}
              />
              <FormField
                icon="card-account-details-outline"
                placeholder="NIC Number"
                value={details.nic}
                onChangeText={(value) => updateField('nic', value)}
                autoCapitalize="characters"
              />
              <FormField
                icon="cellphone"
                placeholder="Mobile Number"
                value={details.mobile}
                onChangeText={(value) => updateField('mobile', value)}
                keyboardType="phone-pad"
              />
              <FormField
                icon="email-outline"
                placeholder="Email Address"
                value={details.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                icon="map-marker-outline"
                placeholder="Address"
                value={details.address}
                onChangeText={(value) => updateField('address', value)}
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                2. Collection Information
              </ThemedText>
              <FormField
                icon="badge-account-outline"
                placeholder="Collector ID"
                value={details.collectorId}
                onChangeText={(value) => updateField('collectorId', value)}
                autoCapitalize="characters"
              />
              <FormField
                icon="map-outline"
                placeholder="Assigned District"
                value={details.district}
                onChangeText={(value) => updateField('district', value)}
                trailingIcon="chevron-down"
              />
              <FormField
                icon="briefcase-outline"
                placeholder="Collection Area"
                value={details.collectionArea}
                onChangeText={(value) => updateField('collectionArea', value)}
              />
              <FormField
                icon="factory"
                placeholder="Assigned Factory"
                value={details.factory}
                onChangeText={(value) => updateField('factory', value)}
                trailingIcon="chevron-down"
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                3. Vehicle Information
              </ThemedText>
              <FormField
                icon="truck-outline"
                placeholder="Vehicle Number"
                value={details.vehicleNumber}
                onChangeText={(value) => updateField('vehicleNumber', value)}
                autoCapitalize="characters"
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                4. Account Security
              </ThemedText>
              <FormField
                icon="lock-outline"
                placeholder="Password"
                value={details.password}
                onChangeText={(value) => updateField('password', value)}
                autoCapitalize="none"
                secureTextEntry
                trailingIcon="eye-off-outline"
              />
              <FormField
                icon="lock-outline"
                placeholder="Confirm Password"
                value={details.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                autoCapitalize="none"
                secureTextEntry
                trailingIcon="eye-off-outline"
              />

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
                onPress={() => {
                  setAcceptedTerms((current) => !current);
                  if (error) setError('');
                }}
                style={styles.termsRow}>
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />}
                </View>
                <ThemedText type="small" style={styles.termsText}>
                  I agree to the PureTeaAgro{' '}
                  <ThemedText type="smallBold" style={styles.termsLink}>
                    terms and conditions
                  </ThemedText>
                </ThemedText>
              </Pressable>

              {error ? (
                <ThemedText accessibilityRole="alert" type="small" style={styles.errorText}>
                  {error}
                </ThemedText>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={submitRegistration}
                style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]}>
                <ThemedText type="smallBold" style={styles.submitText}>
                  Create Collector Account
                </ThemedText>
              </Pressable>
            </View>
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
    backgroundColor: 'rgba(250, 255, 248, 0.72)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 30,
    justifyContent: 'center',
    marginBottom: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  brandText: {
    color: '#176B32',
    fontSize: 13,
  },
  title: {
    color: '#143F25',
    fontSize: 20,
    lineHeight: 26,
  },
  subtitle: {
    color: '#5A6E5D',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 9,
    paddingHorizontal: 10,
  },
  progressStepActive: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#176B32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#E3ECE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextActive: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  progressText: {
    color: '#6F8173',
    fontSize: 11,
  },
  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#BFCFC1',
    marginHorizontal: 7,
  },
  formCard: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.91)',
    borderWidth: 1,
    borderColor: 'rgba(42,103,52,0.12)',
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 11,
  },
  sectionTitle: {
    color: '#1B5130',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
    marginBottom: 4,
  },
  inputWrap: {
    minHeight: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D5E3D7',
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 34,
    color: '#1D3222',
    fontSize: 12,
    paddingHorizontal: 9,
    paddingVertical: 0,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#6F9275',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  checkboxChecked: {
    backgroundColor: '#176B32',
    borderColor: '#176B32',
  },
  termsText: {
    color: '#405C46',
    fontSize: 10,
    lineHeight: 15,
  },
  termsLink: {
    color: '#176B32',
    textDecorationLine: 'underline',
    fontSize: 10,
  },
  errorText: {
    color: '#B42318',
    fontSize: 11,
    marginBottom: 8,
  },
  submitButton: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: '#176B32',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
