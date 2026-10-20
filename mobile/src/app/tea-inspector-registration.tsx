import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
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
import { registerTeaInspector, type TeaInspectorAccount, type TeaInspectorDetails } from '@/services/account-auth';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type FormData = TeaInspectorDetails & {
  password: string;
  confirmPassword: string;
};
type FormField = keyof FormData;
type FormErrors = Partial<Record<FormField | 'terms' | 'registration', string>>;

const colors = {
  green: '#08704A',
  darkGreen: '#064A26',
  paleGreen: '#E8F3E5',
  text: '#193323',
  muted: '#607064',
  icon: '#527A5A',
};

const steps = ['Personal Information', 'Professional Information', 'Account Security', 'Terms'];
const features: { icon: IconName; label: string }[] = [
  { icon: 'map-marker-check-outline', label: 'Field Visits' },
  { icon: 'clipboard-check-outline', label: 'Inspections' },
  { icon: 'file-chart-outline', label: 'Reports' },
  { icon: 'leaf', label: 'Better Tea' },
];

const initialForm: FormData = {
  fullName: '',
  nic: '',
  mobile: '',
  email: '',
  address: '',
  organization: '',
  district: '',
  designation: '',
  password: '',
  confirmPassword: '',
};

function FormInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  multiline = false,
  error,
  rightElement,
}: {
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  rightElement?: ReactNode;
}) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="smallBold" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <View style={[styles.inputWrap, error && styles.inputError, multiline && styles.multilineWrap]}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.icon} />
        <TextInput
          accessibilityLabel={label}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#839087"
          secureTextEntry={secureTextEntry}
          style={[styles.input, multiline && styles.multilineInput]}
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
        />
        {rightElement}
      </View>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
  disabled = false,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        (pressed || disabled) && styles.buttonPressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={18} color="#FFFFFF" />
      <ThemedText type="smallBold" style={styles.primaryButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionNumber}>
        <ThemedText type="smallBold" style={styles.sectionNumberText}>
          {number}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
    </View>
  );
}

export default function TeaInspectorRegistrationScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredAccount, setRegisteredAccount] = useState<TeaInspectorAccount | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const updateField = (field: FormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, registration: undefined }));
  };

  const continueToNextStep = () => {
    setErrors({});
    setStep((current) => Math.min(current + 1, 4));
  };

  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setErrors({});
    setStep((current) => current - 1);
  };

  const createAccount = async () => {
    const nextErrors: FormErrors = {};
    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters.';
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptedTerms) {
      nextErrors.terms = 'Accept the terms and conditions to continue.';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStep(nextErrors.terms ? 4 : 3);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const result = await registerTeaInspector(
        {
          fullName: form.fullName.trim(),
          nic: form.nic.trim().toUpperCase(),
          mobile: form.mobile.trim(),
          email: form.email.trim().toLowerCase(),
          address: form.address.trim(),
          organization: form.organization.trim(),
          district: form.district.trim(),
          designation: form.designation.trim(),
        },
        form.password,
      );
      setRegisteredAccount(result.account);
      setGeneratedPassword(result.generatedPassword ?? '');
      setStep(5);
    } catch (error) {
      setErrors({
        registration:
          error instanceof Error ? error.message : 'Registration could not be completed. Please try again.',
      });
    } finally {
      setSubmitting(false);
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
          style={styles.keyboardView}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel={step === 0 ? 'Go back' : 'Previous step'}
              accessibilityRole="button"
              onPress={goBack}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
            </Pressable>
            <ThemedText type="smallBold" style={styles.brand}>
              PureTeaAgro
            </ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          {step > 0 && step < 5 ? (
            <View style={styles.progressSection}>
              <ThemedText type="smallBold" style={styles.pageTitle}>
                Tea Inspector Registration
              </ThemedText>
              <View style={styles.progressRow}>
                {steps.map((label, index) => (
                  <View
                    accessibilityLabel={`Step ${index + 1}: ${label}`}
                    key={label}
                    style={[styles.progressDot, step >= index + 1 && styles.progressDotActive]}>
                    {step > index + 1 ? (
                      <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
                    ) : (
                      <ThemedText
                        type="smallBold"
                        style={[styles.progressNumber, step >= index + 1 && styles.progressNumberActive]}>
                        {index + 1}
                      </ThemedText>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {step === 0 ? (
              <View style={styles.introContent}>
                <ThemedText type="smallBold" style={styles.introTitle}>
                  Tea Inspector Registration
                </ThemedText>
                <ThemedText type="small" style={styles.introSubtitle}>
                  Join the PureTeaAgro network and help improve tea field inspections.
                </ThemedText>
                <View style={styles.inspectorIllustration}>
                  <MaterialCommunityIcons name="account-search-outline" size={68} color={colors.green} />
                  <View style={styles.illustrationCheck}>
                    <MaterialCommunityIcons name="check" size={17} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.featureGrid}>
                  {features.map(({ icon, label }) => (
                    <View key={label} style={styles.featureTile}>
                      <MaterialCommunityIcons name={icon} size={22} color={colors.green} />
                      <ThemedText type="smallBold" style={styles.featureLabel}>
                        {label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <PrimaryButton label="Get Started" icon="arrow-right" onPress={() => setStep(1)} />
              </View>
            ) : null}

            {step === 1 ? (
              <View style={styles.formContent}>
                <SectionHeading number="1" title="Personal Information" />
                <FormInput
                  label="Full Name"
                  icon="account-outline"
                  value={form.fullName}
                  onChangeText={(value) => updateField('fullName', value)}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                />
                <FormInput
                  label="NIC Number"
                  icon="card-account-details-outline"
                  value={form.nic}
                  onChangeText={(value) => updateField('nic', value.toUpperCase())}
                  placeholder="Enter your NIC number"
                  autoCapitalize="characters"
                  error={errors.nic}
                />
                <FormInput
                  label="Mobile Number"
                  icon="phone-outline"
                  value={form.mobile}
                  onChangeText={(value) => updateField('mobile', value)}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  error={errors.mobile}
                />
                <FormInput
                  label="Email Address"
                  icon="email-outline"
                  value={form.email}
                  onChangeText={(value) => updateField('email', value)}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
                <FormInput
                  label="Address"
                  icon="map-marker-outline"
                  value={form.address}
                  onChangeText={(value) => updateField('address', value)}
                  placeholder="Enter your residential address"
                  multiline
                  error={errors.address}
                />
                <PrimaryButton label="Next" icon="arrow-right" onPress={continueToNextStep} />
              </View>
            ) : null}

            {step === 2 ? (
              <View style={styles.formContent}>
                <SectionHeading number="2" title="Professional Information" />
                <FormInput
                  label="Organization"
                  icon="domain"
                  value={form.organization}
                  onChangeText={(value) => updateField('organization', value)}
                  placeholder="Enter your organization"
                  error={errors.organization}
                />
                <FormInput
                  label="Assigned District"
                  icon="map-marker-radius-outline"
                  value={form.district}
                  onChangeText={(value) => updateField('district', value)}
                  placeholder="Enter your assigned district"
                  error={errors.district}
                />
                <FormInput
                  label="Designation"
                  icon="briefcase-outline"
                  value={form.designation}
                  onChangeText={(value) => updateField('designation', value)}
                  placeholder="Enter your designation"
                  error={errors.designation}
                />
                <PrimaryButton label="Next" icon="arrow-right" onPress={continueToNextStep} />
              </View>
            ) : null}

            {step === 3 ? (
              <View style={styles.formContent}>
                <SectionHeading number="3" title="Account Security" />
                <FormInput
                  label="Password"
                  icon="lock-outline"
                  value={form.password}
                  onChangeText={(value) => updateField('password', value)}
                  placeholder="Create a password (8+ characters)"
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                  error={errors.password}
                  rightElement={
                    <Pressable
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      accessibilityRole="button"
                      onPress={() => setShowPassword((current) => !current)}
                      hitSlop={8}>
                      <MaterialCommunityIcons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={19}
                        color={colors.icon}
                      />
                    </Pressable>
                  }
                />
                <FormInput
                  label="Confirm Password"
                  icon="lock-check-outline"
                  value={form.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  placeholder="Re-enter your password"
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                  error={errors.confirmPassword}
                />
                <PrimaryButton label="Next" icon="arrow-right" onPress={continueToNextStep} />
              </View>
            ) : null}

            {step === 4 ? (
              <View style={styles.formContent}>
                <SectionHeading number="4" title="Terms" />
                <View style={styles.termsCard}>
                  <MaterialCommunityIcons name="file-document-check-outline" size={28} color={colors.green} />
                  <ThemedText type="small" style={styles.termsText}>
                    I agree to the PureTeaAgro terms and conditions and confirm that the information provided is
                    accurate.
                  </ThemedText>
                </View>
                <Pressable
                  accessibilityLabel="Accept terms and conditions"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: acceptedTerms }}
                  onPress={() => {
                    setAcceptedTerms((current) => !current);
                    setErrors((current) => ({ ...current, terms: undefined }));
                  }}
                  style={styles.checkboxRow}>
                  <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                    {acceptedTerms ? <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" /> : null}
                  </View>
                  <ThemedText type="small" style={styles.termsText}>
                    I have read and accept the terms and conditions.
                  </ThemedText>
                </Pressable>
                {errors.terms ? <ThemedText style={styles.errorText}>{errors.terms}</ThemedText> : null}
                {errors.registration ? (
                  <ThemedText style={styles.registrationError}>{errors.registration}</ThemedText>
                ) : null}
                <PrimaryButton
                  label={submitting ? 'Creating Account...' : 'Create Inspector Account'}
                  icon="account-check-outline"
                  onPress={createAccount}
                  disabled={submitting}
                />
              </View>
            ) : null}

            {step === 5 && registeredAccount ? (
              <View style={styles.successContent}>
                <View style={styles.successIcon}>
                  <MaterialCommunityIcons name="check" size={52} color="#FFFFFF" />
                </View>
                <ThemedText type="subtitle" style={styles.successTitle}>
                  Registration Successful!
                </ThemedText>
                <ThemedText type="small" style={styles.successMessage}>
                  Your Tea Inspector account has been created successfully.
                </ThemedText>
                <View style={styles.statusCard}>
                  <View style={styles.statusIcon}>
                    <MaterialCommunityIcons name="badge-account-outline" size={22} color={colors.green} />
                  </View>
                  <View style={styles.statusText}>
                    <ThemedText type="smallBold" style={styles.statusLabel}>
                      Inspector ID
                    </ThemedText>
                    <ThemedText type="small" style={styles.statusDetail}>
                      {registeredAccount.inspectorId}
                    </ThemedText>
                  </View>
                </View>
                {generatedPassword ? (
                  <View style={styles.statusCard}>
                    <View style={styles.statusIcon}>
                      <MaterialCommunityIcons name="lock-check-outline" size={22} color={colors.green} />
                    </View>
                    <View style={styles.statusText}>
                      <ThemedText type="smallBold" style={styles.statusLabel}>
                        Temporary Password
                      </ThemedText>
                      <ThemedText selectable type="small" style={styles.statusDetail}>
                        {generatedPassword}
                      </ThemedText>
                    </View>
                  </View>
                ) : null}
                <View style={styles.statusCard}>
                  <View style={styles.statusIcon}>
                    <MaterialCommunityIcons name="clock-check-outline" size={22} color={colors.green} />
                  </View>
                  <View style={styles.statusText}>
                    <ThemedText type="smallBold" style={styles.statusLabel}>
                      Account Status
                    </ThemedText>
                    <ThemedText type="small" style={styles.pendingText}>
                      Pending Approval
                    </ThemedText>
                  </View>
                </View>
                <PrimaryButton
                  label="Go to Login"
                  icon="login"
                  onPress={() =>
                    router.replace({
                      pathname: '/login',
                      params: { id: registeredAccount.inspectorId, role: 'tea-inspector' },
                    })
                  }
                />
              </View>
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
    backgroundColor: 'rgba(249, 253, 246, 0.73)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 19,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: colors.green,
    fontSize: 15,
  },
  headerSpacer: {
    width: 36,
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '74%',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D6C7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  progressNumber: {
    color: colors.muted,
    fontSize: 11,
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 5,
    paddingBottom: 25,
  },
  introContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  introTitle: {
    color: colors.text,
    fontSize: 20,
    textAlign: 'center',
  },
  introSubtitle: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 290,
  },
  inspectorIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#75CEA4',
    backgroundColor: '#E5F8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  illustrationCheck: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 22,
  },
  featureTile: {
    width: '48%',
    minHeight: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  featureLabel: {
    color: colors.text,
  },
  formContent: {
    paddingTop: 6,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 17,
  },
  sectionNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  fieldLabel: {
    color: colors.text,
    marginBottom: 6,
  },
  inputWrap: {
    minHeight: 49,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFE2CE',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 9,
  },
  inputError: {
    borderColor: '#C44040',
  },
  input: {
    flex: 1,
    minHeight: 47,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 7,
  },
  multilineWrap: {
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  multilineInput: {
    minHeight: 64,
  },
  errorText: {
    color: '#B12626',
    fontSize: 12,
    marginTop: 4,
  },
  registrationError: {
    color: '#B12626',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
  },
  primaryButton: {
    minHeight: 49,
    borderRadius: 11,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  termsCard: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    color: colors.text,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#79A483',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  successIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
  },
  successMessage: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 20,
  },
  statusCard: {
    minHeight: 66,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.93)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 11,
    marginBottom: 10,
  },
  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    color: colors.text,
  },
  statusDetail: {
    color: colors.muted,
    marginTop: 2,
  },
  pendingText: {
    color: '#C17A12',
    marginTop: 2,
  },
});
