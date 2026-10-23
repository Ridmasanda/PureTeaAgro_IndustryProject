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
type AdministratorDetails = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  staffId: string;
  organization: string;
  designation: string;
  password: string;
  confirmPassword: string;
  authorizationReference: string;
};

const initialDetails: AdministratorDetails = {
  fullName: '',
  nic: '',
  mobile: '',
  email: '',
  staffId: '',
  organization: '',
  designation: '',
  password: '',
  confirmPassword: '',
  authorizationReference: '',
};

const designations = ['System Administrator', 'IT Administrator', 'Operations Administrator'];

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  trailing,
}: {
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  trailing?: React.ReactNode;
}) {
  return (
    <View style={styles.inputWrap}>
      <MaterialCommunityIcons name={icon} size={17} color="#4D7D4F" />
      <TextInput
        accessibilityLabel={placeholder}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#839087"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
      {trailing}
    </View>
  );
}

export default function AdministratorRegistrationScreen() {
  const [details, setDetails] = useState(initialDetails);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [designationOpen, setDesignationOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: keyof AdministratorDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  async function submitRequest() {
    if (Object.values(details).some((value) => !value.trim())) {
      setError('Please complete all fields before submitting your request.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (details.password.length < 8) {
      setError('Password must contain at least 8 characters.');
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
        role: 'administrator',
        nic: details.nic.trim().toUpperCase(),
        mobile: details.mobile.trim(),
        organization: details.organization.trim(),
        designation: details.designation.trim(),
        employeeId: details.staffId.trim().toUpperCase(),
      });
      router.push('/administrator-registration-success');
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
              <ThemedText type="smallBold" style={styles.brandText}>PureTeaAgro</ThemedText>
            </View>

            <ThemedText type="smallBold" style={styles.title}>Administrator Registration</ThemedText>
            <ThemedText type="small" style={styles.subtitle}>Request administrator access</ThemedText>

            <View style={styles.progressRow}>
              <View style={styles.progressActive}><ThemedText type="smallBold" style={styles.progressActiveText}>1</ThemedText></View>
              <View style={styles.progressLine} />
              <View style={styles.progress}><ThemedText type="smallBold" style={styles.progressText}>2</ThemedText></View>
              <View style={styles.progressLine} />
              <View style={styles.progress}><ThemedText type="smallBold" style={styles.progressText}>3</ThemedText></View>
            </View>

            <View style={styles.formCard}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>1. Personal Information</ThemedText>
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
                onChangeText={(value) => updateField('nic', value.toUpperCase())}
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

              <ThemedText type="smallBold" style={styles.sectionTitle}>2. Professional Information</ThemedText>
              <FormField
                icon="badge-account-outline"
                placeholder="Employee / Staff ID"
                value={details.staffId}
                onChangeText={(value) => updateField('staffId', value)}
                autoCapitalize="characters"
              />
              <FormField
                icon="domain"
                placeholder="Organization"
                value={details.organization}
                onChangeText={(value) => updateField('organization', value)}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: designationOpen }}
                onPress={() => setDesignationOpen((open) => !open)}
                style={styles.inputWrap}>
                <MaterialCommunityIcons name="account-tie-outline" size={17} color="#4D7D4F" />
                <ThemedText
                  type="small"
                  style={[styles.selectText, !details.designation && styles.placeholder]}>
                  {details.designation || 'Designation'}
                </ThemedText>
                <MaterialCommunityIcons
                  name={designationOpen ? 'chevron-up' : 'chevron-down'}
                  size={19}
                  color="#4D7D4F"
                />
              </Pressable>
              {designationOpen && (
                <View style={styles.designationOptions}>
                  {designations.map((designation) => (
                    <Pressable
                      key={designation}
                      onPress={() => {
                        updateField('designation', designation);
                        setDesignationOpen(false);
                      }}
                      style={styles.designationOption}>
                      <ThemedText type="small" style={styles.designationText}>{designation}</ThemedText>
                      {details.designation === designation && (
                        <MaterialCommunityIcons name="check" size={17} color="#287B40" />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}

              <ThemedText type="smallBold" style={styles.sectionTitle}>3. Account Security</ThemedText>
              <FormField
                icon="lock-outline"
                placeholder="Password"
                value={details.password}
                onChangeText={(value) => updateField('password', value)}
                autoCapitalize="none"
                secureTextEntry={!passwordVisible}
                trailing={(
                  <Pressable
                    accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                    accessibilityRole="button"
                    onPress={() => setPasswordVisible((visible) => !visible)}>
                    <MaterialCommunityIcons
                      name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={17}
                      color="#4D7D4F"
                    />
                  </Pressable>
                )}
              />
              <FormField
                icon="lock-outline"
                placeholder="Confirm Password"
                value={details.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                autoCapitalize="none"
                secureTextEntry={!confirmPasswordVisible}
                trailing={(
                  <Pressable
                    accessibilityLabel={confirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
                    accessibilityRole="button"
                    onPress={() => setConfirmPasswordVisible((visible) => !visible)}>
                    <MaterialCommunityIcons
                      name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={17}
                      color="#4D7D4F"
                    />
                  </Pressable>
                )}
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>4. Administrator Verification</ThemedText>
              <FormField
                icon="shield-key-outline"
                placeholder="Authorization Code / Reference"
                value={details.authorizationReference}
                onChangeText={(value) => updateField('authorizationReference', value)}
                autoCapitalize="characters"
              />

              <ThemedText type="smallBold" style={styles.sectionTitle}>5. Terms</ThemedText>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
                onPress={() => {
                  setAcceptedTerms((accepted) => !accepted);
                  if (error) setError('');
                }}
                style={styles.termsRow}>
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />}
                </View>
                <ThemedText type="small" style={styles.termsText}>
                  I agree to the PureTeaAgro{' '}
                  <ThemedText type="smallBold" style={styles.termsLink}>terms and conditions</ThemedText>
                </ThemedText>
              </Pressable>

              {error ? (
                <ThemedText accessibilityRole="alert" type="small" style={styles.errorText}>{error}</ThemedText>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={submitRequest}
                style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]}>
                <ThemedText type="smallBold" style={styles.submitText}>Submit Administrator Request</ThemedText>
              </Pressable>
              <ThemedText type="small" style={styles.demoNote}>
                Demo only: this request is not sent to a server.
              </ThemedText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(250,255,248,0.72)' },
  safeArea: { flex: 1, paddingHorizontal: 18 },
  keyboardArea: { flex: 1 },
  content: { paddingTop: 0, paddingBottom: 14 },
  backButton: { width: 36, height: 34, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 2 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { width: 43, height: 34 },
  brandText: { color: '#24633A', fontSize: 12, marginLeft: 4 },
  title: { color: '#143F25', fontSize: 20, lineHeight: 26 },
  subtitle: { color: '#5A6E5D', fontSize: 12, lineHeight: 17, marginTop: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 9, paddingHorizontal: 10 },
  progressActive: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#176B32', alignItems: 'center', justifyContent: 'center' },
  progress: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#E3ECE4', alignItems: 'center', justifyContent: 'center' },
  progressActiveText: { color: '#FFFFFF', fontSize: 11 },
  progressText: { color: '#6F8173', fontSize: 11 },
  progressLine: { flex: 1, height: 1, backgroundColor: '#BFCFC1', marginHorizontal: 7 },
  formCard: { borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.91)', borderWidth: 1, borderColor: 'rgba(42,103,52,0.12)', paddingHorizontal: 11, paddingTop: 10, paddingBottom: 11 },
  sectionTitle: { color: '#1B5130', fontSize: 11, lineHeight: 15, marginTop: 4, marginBottom: 4 },
  inputWrap: { minHeight: 36, borderRadius: 9, borderWidth: 1, borderColor: '#D5E3D7', paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.94)', marginBottom: 5 },
  input: { flex: 1, minWidth: 0, height: 36, color: '#1D3222', fontSize: 11, paddingHorizontal: 9, paddingVertical: 0 },
  selectText: { flex: 1, fontSize: 11, color: '#1D3222', paddingHorizontal: 9 },
  placeholder: { color: '#839087' },
  designationOptions: { borderWidth: 1, borderColor: '#D5E3D7', borderRadius: 9, backgroundColor: '#FFFFFF', marginTop: -1, marginBottom: 5, overflow: 'hidden' },
  designationOption: { minHeight: 37, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#EDF2ED' },
  designationText: { color: '#36543D', fontSize: 11 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, marginBottom: 7 },
  checkbox: { width: 16, height: 16, borderRadius: 3, borderWidth: 1, borderColor: '#6F9275', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  checkboxChecked: { backgroundColor: '#176B32', borderColor: '#176B32' },
  termsText: { color: '#405C46', fontSize: 10, lineHeight: 15 },
  termsLink: { color: '#176B32', textDecorationLine: 'underline', fontSize: 10 },
  errorText: { color: '#B42318', fontSize: 11, marginBottom: 7 },
  submitButton: { minHeight: 42, borderRadius: 10, backgroundColor: '#176B32', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  submitText: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  demoNote: { color: '#8A7650', fontSize: 9, textAlign: 'center', marginTop: 7 },
  buttonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
