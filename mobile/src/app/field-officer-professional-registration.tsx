import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
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
import { getFieldOfficerDraft, saveFieldOfficerDraft } from '@/services/field-officer-registration';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type SelectionKey = 'organization' | 'district' | 'designation';

const selectionOptions: Record<SelectionKey, string[]> = {
  organization: ['PureTeaAgro', 'Tea Research Institute', 'Tea Small Holdings Authority'],
  district: ['Kandy', 'Nuwara Eliya', 'Ratnapura', 'Badulla'],
  designation: ['Field Officer', 'Senior Field Officer', 'Regional Field Officer'],
};

const selectionLabels: Record<SelectionKey, string> = {
  organization: 'Organization',
  district: 'Assigned District',
  designation: 'Designation',
};

type FormFieldProps = {
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  trailingIcon?: IconName;
  onTrailingPress?: () => void;
};

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  trailingIcon,
  onTrailingPress,
}: FormFieldProps) {
  return (
    <View style={styles.inputWrap}>
      <MaterialCommunityIcons name={icon} size={17} color="#6B788B" />
      <TextInput
        accessibilityLabel={placeholder}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#929EAF"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
      {trailingIcon && (
        <Pressable
          accessibilityLabel={`${secureTextEntry ? 'Show' : 'Hide'} ${placeholder.toLowerCase()}`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onTrailingPress}
          style={styles.trailingButton}>
          <MaterialCommunityIcons name={trailingIcon} size={17} color="#8390A0" />
        </Pressable>
      )}
    </View>
  );
}

function SelectField({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={value || label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.inputWrap}>
      <MaterialCommunityIcons name={icon} size={17} color="#6B788B" />
      <ThemedText style={[styles.selectText, !value && styles.placeholderText]}>
        {value || label}
      </ThemedText>
      <MaterialCommunityIcons name="chevron-down" size={19} color="#6B788B" />
    </Pressable>
  );
}

export default function FieldOfficerProfessionalRegistrationScreen() {
  const [employeeId, setEmployeeId] = useState('');
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [openSelection, setOpenSelection] = useState<SelectionKey | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedValues: Record<SelectionKey, string> = {
    organization,
    district,
    designation,
  };

  const setSelection = (key: SelectionKey, value: string) => {
    if (key === 'organization') setOrganization(value);
    if (key === 'district') setDistrict(value);
    if (key === 'designation') setDesignation(value);
    setOpenSelection(null);
  };

  const continueToOptionalDetails = async () => {
    if (!employeeId.trim() || !organization || !district || !designation) {
      setError('Please complete all professional information fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const personalDetails = await getFieldOfficerDraft();
      if (!personalDetails) {
        setError('Your personal details were not found. Please start again.');
        return;
      }

      await saveFieldOfficerDraft({
        ...personalDetails,
        employeeId: employeeId.trim().toUpperCase(),
        organization,
        district,
        designation,
        password,
      });
      router.push('/field-officer-optional-registration');
    } catch {
      setError('Unable to save your professional details. Please try again.');
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
              accessibilityLabel="Go back to personal information"
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
                  <View style={[styles.stepCircle, step === 2 && styles.activeStepCircle]}>
                    <ThemedText style={[styles.stepText, step === 2 && styles.activeStepText]}>{step}</ThemedText>
                  </View>
                  {step < 4 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>

            <View style={styles.form}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                2. Professional Information
              </ThemedText>

              <FormField
                icon="card-account-details-outline"
                onChangeText={setEmployeeId}
                placeholder="Employee / Staff ID"
                value={employeeId}
              />
              <SelectField
                icon="office-building-outline"
                label="Organization"
                onPress={() => setOpenSelection('organization')}
                value={organization}
              />
              <SelectField
                icon="map-marker-outline"
                label="Assigned District"
                onPress={() => setOpenSelection('district')}
                value={district}
              />
              <SelectField
                icon="briefcase-outline"
                label="Designation"
                onPress={() => setOpenSelection('designation')}
                value={designation}
              />

              <ThemedText type="smallBold" style={[styles.sectionTitle, styles.securityTitle]}>
                3. Account Security
              </ThemedText>

              <FormField
                icon="lock-outline"
                onChangeText={setPassword}
                onTrailingPress={() => setPasswordVisible((visible) => !visible)}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                trailingIcon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                value={password}
              />
              <FormField
                icon="lock-outline"
                onChangeText={setConfirmPassword}
                onTrailingPress={() => setConfirmPasswordVisible((visible) => !visible)}
                placeholder="Confirm Password"
                secureTextEntry={!confirmPasswordVisible}
                trailingIcon={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                value={confirmPassword}
              />
            </View>

            <Pressable
              accessibilityLabel="Continue to the next registration step"
              accessibilityRole="button"
              disabled={saving}
              onPress={continueToOptionalDetails}
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

      <Modal
        animationType="fade"
        onRequestClose={() => setOpenSelection(null)}
        transparent
        visible={openSelection !== null}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpenSelection(null)}>
          <View style={styles.modalCard}>
            <ThemedText type="smallBold" style={styles.modalTitle}>
              {openSelection ? selectionLabels[openSelection] : ''}
            </ThemedText>
            {openSelection &&
              selectionOptions[openSelection].map((option) => (
                <Pressable
                  accessibilityRole="button"
                  key={option}
                  onPress={() => setSelection(openSelection, option)}
                  style={styles.optionButton}>
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                </Pressable>
              ))}
          </View>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  safeArea: { flex: 1, paddingHorizontal: 7 },
  keyboardAvoidingView: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 18 },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  brand: { alignItems: 'center', marginTop: 1 },
  logo: { width: 127, height: 31 },
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
  stepItem: { flexDirection: 'row', alignItems: 'center' },
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
  activeStepCircle: { borderColor: '#075A2E', backgroundColor: '#075A2E' },
  stepText: { color: '#A9B9CB', fontSize: 11, lineHeight: 14 },
  activeStepText: { color: '#FFFFFF' },
  stepConnector: {
    width: 10,
    height: 1,
    backgroundColor: '#D2DCE7',
    marginHorizontal: 5,
  },
  form: { paddingHorizontal: 21 },
  sectionTitle: {
    color: '#16452A',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 11,
  },
  securityTitle: { marginTop: 5 },
  inputWrap: {
    height: 35,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#D6E0E8',
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
  selectText: {
    flex: 1,
    color: '#5E6C7D',
    fontSize: 11,
    lineHeight: 15,
    marginLeft: 10,
  },
  placeholderText: { color: '#929EAF' },
  trailingButton: { paddingLeft: 8 },
  nextButton: {
    height: 38,
    borderRadius: 7,
    backgroundColor: '#075A2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 21,
    marginTop: 'auto',
  },
  nextButtonText: { color: '#F8FFF6', fontSize: 12, lineHeight: 16 },
  nextButtonPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 31, 22, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  modalTitle: { color: '#16452A', fontSize: 15, marginBottom: 8 },
  optionButton: {
    borderTopWidth: 1,
    borderTopColor: '#E8EEF2',
    paddingVertical: 13,
  },
  optionText: { color: '#26384D', fontSize: 13 },
});
