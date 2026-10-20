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
import { registerFactoryOfficer, type FactoryOfficerAccount } from '@/services/account-auth';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type FormData = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  address: string;
  employeeId: string;
  organization: string;
  factory: string;
  designation: string;
  password: string;
  confirmPassword: string;
};
type FormField = keyof FormData;
type FormErrors = Partial<Record<FormField | 'terms' | 'registration', string>>;

const initialForm: FormData = {
  fullName: '',
  nic: '',
  mobile: '',
  email: '',
  address: '',
  employeeId: '',
  organization: '',
  factory: '',
  designation: '',
  password: '',
  confirmPassword: '',
};

const steps = ['Personal Information', 'Professional Information', 'Password & Security', 'Review'];

function FeatureTile({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.featureTile}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.green} />
      <ThemedText type="smallBold" style={styles.featureLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

function FormInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
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
  rightElement?: React.ReactNode;
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

const colors = {
  green: '#08632D',
  darkGreen: '#064A26',
  paleGreen: '#E8F3E5',
  text: '#193323',
  muted: '#607064',
  icon: '#527A5A',
};

export default function FactoryOfficerRegistrationScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredAccount, setRegisteredAccount] = useState<FactoryOfficerAccount | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const updateField = (field: FormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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

  const submitRegistration = async () => {
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
      setStep(3);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const result = await registerFactoryOfficer(
        {
          fullName: form.fullName.trim(),
          nic: form.nic.trim().toUpperCase(),
          mobile: form.mobile.trim(),
          email: form.email.trim().toLowerCase(),
          address: form.address.trim(),
          employeeId: form.employeeId.trim().toUpperCase(),
          organization: form.organization.trim(),
          factory: form.factory.trim(),
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
            <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
            <View style={styles.headerSpacer} />
          </View>

          {step > 0 && step < 5 ? (
            <View style={styles.progressSection}>
              <ThemedText type="smallBold" style={styles.pageTitle}>
                Factory Officer Registration
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
                      <ThemedText type="smallBold" style={[styles.progressNumber, step >= index + 1 && styles.progressNumberActive]}>
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
                  Factory Officer Registration
                </ThemedText>
                <ThemedText type="small" style={styles.introSubtitle}>
                  Join the PureTeaAgro network and help make tea operations more transparent.
                </ThemedText>
                <View style={styles.factoryIllustration}>
                  <View style={styles.illustrationCircle}>
                    <MaterialCommunityIcons name="factory" size={66} color={colors.green} />
                    <View style={styles.illustrationCheck}>
                      <MaterialCommunityIcons name="check" size={17} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
                <View style={styles.featureGrid}>
                  <FeatureTile icon="factory" label="Factory Info" />
                  <FeatureTile icon="file-chart-outline" label="Reports" />
                  <FeatureTile icon="map-marker-path" label="Traceability" />
                  <FeatureTile icon="leaf" label="Better Tea" />
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
                  label="Employee ID"
                  icon="badge-account-outline"
                  value={form.employeeId}
                  onChangeText={(value) => updateField('employeeId', value)}
                  placeholder="Enter your employee ID"
                  autoCapitalize="characters"
                  error={errors.employeeId}
                />
                <FormInput
                  label="Organization"
                  icon="domain"
                  value={form.organization}
                  onChangeText={(value) => updateField('organization', value)}
                  placeholder="Enter your organization"
                  error={errors.organization}
                />
                <FormInput
                  label="Assigned Factory"
                  icon="factory"
                  value={form.factory}
                  onChangeText={(value) => updateField('factory', value)}
                  placeholder="Enter your assigned factory"
                  error={errors.factory}
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
                <SectionHeading number="3" title="Password & Security" />
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
                <View style={styles.termsContainer}>
                  <Pressable
                    accessibilityLabel="Accept terms and conditions"
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: acceptedTerms }}
                    onPress={() => {
                      setAcceptedTerms((current) => !current);
                      setErrors((current) => ({ ...current, terms: undefined }));
                    }}
                    style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                    {acceptedTerms ? <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" /> : null}
                  </Pressable>
                  <ThemedText type="small" style={styles.termsText}>
                    I agree to the{' '}
                    <ThemedText type="smallBold" style={styles.termsEmphasis}>
                      Terms and Conditions
                    </ThemedText>{' '}
                    and confirm that the information provided is accurate.
                  </ThemedText>
                </View>
                {errors.terms ? <ThemedText style={styles.errorText}>{errors.terms}</ThemedText> : null}
                <PrimaryButton label="Next" icon="arrow-right" onPress={continueToNextStep} />
              </View>
            ) : null}

            {step === 4 ? (
              <View style={styles.formContent}>
                <SectionHeading number="4" title="Review & Submit" />
                <ThemedText type="small" style={styles.reviewIntro}>
                  Please check your details before submitting your registration.
                </ThemedText>
                <ReviewSection
                  title="Personal Information"
                  onEdit={() => setStep(1)}
                  items={[
                    ['Full Name', form.fullName],
                    ['NIC Number', form.nic],
                    ['Mobile Number', form.mobile],
                    ['Email Address', form.email],
                    ['Address', form.address],
                  ]}
                />
                <ReviewSection
                  title="Professional Information"
                  onEdit={() => setStep(2)}
                  items={[
                    ['Employee ID', form.employeeId],
                    ['Organization', form.organization],
                    ['Assigned Factory', form.factory],
                    ['Designation', form.designation],
                  ]}
                />
                <View style={styles.privacyNote}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.green} />
                  <ThemedText type="small" style={styles.privacyText}>
                    Your information will be reviewed by an administrator before your account is activated.
                  </ThemedText>
                </View>
                {errors.registration ? (
                  <ThemedText style={styles.registrationError}>{errors.registration}</ThemedText>
                ) : null}
                <PrimaryButton
                  label={submitting ? 'Submitting...' : 'Submit Registration'}
                  icon="account-check-outline"
                  onPress={submitRegistration}
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
                  Registration Submitted!
                </ThemedText>
                <ThemedText type="small" style={styles.successMessage}>
                  Your Factory Officer application has been received and is pending administrator approval.
                </ThemedText>
                <View style={styles.statusCard}>
                  <View style={styles.statusIcon}>
                    <MaterialCommunityIcons name="badge-account-outline" size={22} color={colors.green} />
                  </View>
                  <View style={styles.statusText}>
                    <ThemedText type="smallBold" style={styles.statusLabel}>
                      Employee ID
                    </ThemedText>
                    <ThemedText type="small" style={styles.statusDetail}>
                      {registeredAccount.employeeId}
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
                    <MaterialCommunityIcons name="account-tie-outline" size={22} color={colors.green} />
                  </View>
                  <View style={styles.statusText}>
                    <ThemedText type="smallBold" style={styles.statusLabel}>
                      Factory Officer
                    </ThemedText>
                    <ThemedText type="small" style={styles.statusDetail}>
                      {form.fullName}
                    </ThemedText>
                  </View>
                </View>
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
                      params: { id: registeredAccount.employeeId, role: 'factory-officer' },
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
      style={({ pressed }) => [styles.primaryButton, (pressed || disabled) && styles.buttonPressed]}>
      <MaterialCommunityIcons name={icon} size={18} color="#FFFFFF" />
      <ThemedText type="smallBold" style={styles.primaryButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ReviewSection({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: [string, string][];
  onEdit: () => void;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <ThemedText type="smallBold" style={styles.reviewTitle}>
          {title}
        </ThemedText>
        <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${title}`} onPress={onEdit}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.green} />
        </Pressable>
      </View>
      {items.map(([label, value]) => (
        <View key={label} style={styles.reviewRow}>
          <MaterialCommunityIcons name="check-circle-outline" size={14} color={colors.green} />
          <ThemedText type="small" style={styles.reviewValue}>
            <ThemedText type="smallBold" style={styles.reviewLabel}>
              {label}:{' '}
            </ThemedText>
            {value}
          </ThemedText>
        </View>
      ))}
    </View>
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
  logo: {
    width: 110,
    height: 33,
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
    fontSize: 19,
    textAlign: 'center',
  },
  introSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 300,
  },
  factoryIllustration: {
    height: 139,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: 'rgba(215, 241, 219, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCheck: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  featureGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 9,
    marginBottom: 18,
  },
  featureTile: {
    width: '48.5%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8E8D5',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  featureLabel: {
    color: colors.text,
    fontSize: 12,
  },
  formContent: {
    paddingBottom: 8,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 16,
  },
  sectionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    fontSize: 15,
  },
  fieldGroup: {
    marginBottom: 11,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 5,
  },
  inputWrap: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(67, 111, 73, 0.2)',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  inputError: {
    borderColor: '#B83333',
  },
  input: {
    flex: 1,
    minHeight: 41,
    color: colors.text,
    fontSize: 13,
    paddingVertical: 0,
  },
  multilineWrap: {
    minHeight: 67,
    alignItems: 'flex-start',
    paddingTop: 11,
  },
  multilineInput: {
    minHeight: 52,
  },
  errorText: {
    color: '#A52B2B',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  registrationError: {
    color: '#A52B2B',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 8,
  },
  primaryButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: colors.green,
    shadowColor: '#194A27',
    shadowOpacity: 0.14,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 5,
    marginBottom: 5,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9AB49B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  termsText: {
    flex: 1,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  termsEmphasis: {
    color: colors.green,
    fontSize: 11,
  },
  reviewIntro: {
    color: colors.muted,
    fontSize: 12,
    marginTop: -7,
    marginBottom: 12,
  },
  reviewCard: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E1EAE0',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  reviewTitle: {
    color: colors.text,
    fontSize: 13,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 3,
  },
  reviewValue: {
    flex: 1,
    color: '#48584B',
    fontSize: 11,
  },
  reviewLabel: {
    color: colors.text,
    fontSize: 11,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 11,
    marginBottom: 8,
    borderRadius: 9,
    backgroundColor: 'rgba(228, 241, 224, 0.9)',
  },
  privacyText: {
    flex: 1,
    color: '#49604C',
    fontSize: 11,
    lineHeight: 15,
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 28,
  },
  successIcon: {
    width: 94,
    height: 94,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 47,
    backgroundColor: '#068448',
    borderWidth: 8,
    borderColor: '#D9F0DD',
    marginBottom: 19,
  },
  successTitle: {
    color: colors.darkGreen,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '800',
    textAlign: 'center',
  },
  successMessage: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1EAE0',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  statusIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: colors.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    color: colors.text,
    fontSize: 12,
  },
  statusDetail: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  pendingText: {
    color: '#C26A05',
    fontSize: 11,
    marginTop: 2,
  },
});
