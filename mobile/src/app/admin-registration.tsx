import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Form = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  employeeId: string;
  organization: string;
  designation: string;
  password: string;
  confirmPassword: string;
  authorization: string;
};

const initialForm: Form = {
  fullName: '',
  nic: '',
  mobile: '',
  email: '',
  employeeId: '',
  organization: '',
  designation: '',
  password: '',
  confirmPassword: '',
  authorization: '',
};

export default function AdminRegistrationScreen() {
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const required: (keyof Form)[] = ['fullName', 'nic', 'mobile', 'email', 'employeeId', 'organization', 'designation', 'password', 'confirmPassword', 'authorization'];
    if (required.some((key) => !form[key].trim())) {
      setError('Please complete all administrator registration fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the PureTeaAgro terms and conditions.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen />;

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" />
          </Pressable>
          <Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
          <View style={styles.headerSpace} />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={styles.title}>Administrator Registration</ThemedText>
          <ThemedText type="small" style={styles.subtitle}>Request administrator access to PureTeaAgro</ThemedText>
          <Progress />
          <ThemedText type="smallBold" style={styles.sectionTitle}>1. Personal Information</ThemedText>
          <Field label="Full Name" icon="account-outline" value={form.fullName} onChangeText={(value) => update('fullName', value)} placeholder="Enter your full name" />
          <Field label="NIC Number" icon="card-account-details-outline" value={form.nic} onChangeText={(value) => update('nic', value)} placeholder="Enter your NIC number" autoCapitalize="characters" />
          <Field label="Mobile Number" icon="cellphone" value={form.mobile} onChangeText={(value) => update('mobile', value)} placeholder="Enter your mobile number" keyboardType="phone-pad" />
          <Field label="Email Address" icon="email-outline" value={form.email} onChangeText={(value) => update('email', value)} placeholder="Enter your email address" keyboardType="email-address" />

          <ThemedText type="smallBold" style={styles.sectionTitle}>2. Professional Information</ThemedText>
          <Field label="Employee / Staff ID" icon="badge-account-outline" value={form.employeeId} onChangeText={(value) => update('employeeId', value)} placeholder="Enter employee or staff ID" />
          <Field label="Organization" icon="domain" value={form.organization} onChangeText={(value) => update('organization', value)} placeholder="Enter organization name" />
          <Field label="Designation" icon="briefcase-outline" value={form.designation} onChangeText={(value) => update('designation', value)} placeholder="Enter your designation" />

          <ThemedText type="smallBold" style={styles.sectionTitle}>3. Account Security</ThemedText>
          <PasswordField label="Password" value={form.password} onChangeText={(value) => update('password', value)} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} />
          <PasswordField label="Confirm Password" value={form.confirmPassword} onChangeText={(value) => update('confirmPassword', value)} visible={showConfirm} onToggle={() => setShowConfirm((value) => !value)} />

          <ThemedText type="smallBold" style={styles.sectionTitle}>4. Administrator Verification</ThemedText>
          <Field label="Authorization Code / Reference" icon="key-outline" value={form.authorization} onChangeText={(value) => update('authorization', value)} placeholder="Enter authorization code or reference" />

          <ThemedText type="smallBold" style={styles.sectionTitle}>5. Terms</ThemedText>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} onPress={() => setAgreed((value) => !value)} style={styles.terms}>
            <MaterialCommunityIcons name={agreed ? 'checkbox-marked' : 'checkbox-blank-outline'} size={20} color={agreed ? '#168B3E' : '#6C8C78'} />
            <ThemedText type="small" style={styles.termsText}>I agree to the PureTeaAgro terms and conditions.</ThemedText>
          </Pressable>
          {!!error && <ThemedText type="small" style={styles.error}>{error}</ThemedText>}
          <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.submitText}>Submit Administrator Request</ThemedText>
            <MaterialCommunityIcons name="arrow-right" size={19} color="#FFF" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Progress() {
  return <View style={styles.progress}>{[1, 2, 3].map((number, index) => <View key={number} style={styles.progressItem}><View style={[styles.progressDot, index === 0 && styles.progressDotActive]}><ThemedText type="smallBold" style={[styles.progressNumber, index === 0 && styles.progressNumberActive]}>{number}</ThemedText></View>{index < 2 && <View style={styles.progressLine} />}</View>)}</View>;
}

function Field({ label, icon, value, onChangeText, placeholder, ...inputProps }: { label: string; icon: IconName; value: string; onChangeText: (value: string) => void; placeholder: string } & Pick<React.ComponentProps<typeof TextInput>, 'autoCapitalize' | 'keyboardType'>) {
  return <View style={styles.field}><ThemedText type="smallBold" style={styles.fieldLabel}>{label}</ThemedText><View style={styles.inputWrap}><MaterialCommunityIcons name={icon} size={17} color="#527568" /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9AB4A6" style={styles.input} {...inputProps} /></View></View>;
}

function PasswordField({ label, value, onChangeText, visible, onToggle }: { label: string; value: string; onChangeText: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return <View style={styles.field}><ThemedText type="smallBold" style={styles.fieldLabel}>{label}</ThemedText><View style={styles.inputWrap}><MaterialCommunityIcons name="lock-outline" size={17} color="#527568" /><TextInput value={value} onChangeText={onChangeText} placeholder={`Enter ${label.toLowerCase()}`} placeholderTextColor="#9AB4A6" style={styles.input} secureTextEntry={!visible} /><Pressable accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`} onPress={onToggle}><MaterialCommunityIcons name={visible ? 'eye-outline' : 'eye-off-outline'} size={18} color="#527568" /></Pressable></View></View>;
}

function SuccessScreen() {
  return <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}><StatusBar style="dark" /><View pointerEvents="none" style={styles.overlay} /><SafeAreaView style={styles.successSafeArea}><View style={styles.successHeader}><Image source={require('@/assets/images/logo.png')} resizeMode="contain" style={styles.logo} /></View><View style={styles.successCard}><View style={styles.successIcon}><MaterialCommunityIcons name="check" size={52} color="#FFF" /></View><ThemedText type="subtitle" style={styles.successTitle}>Administrator Access</ThemedText><ThemedText type="subtitle" style={styles.successTitle}>Request Submitted</ThemedText><View style={styles.statusCard}><ThemedText type="smallBold" style={styles.statusLabel}>Account Status</ThemedText><View style={styles.pending}><MaterialCommunityIcons name="clock-outline" size={18} color="#E7A400" /><ThemedText type="smallBold" style={styles.pendingText}>Pending Authorization</ThemedText></View></View><Pressable accessibilityRole="button" onPress={() => router.replace('/login')} style={styles.loginButton}><ThemedText type="smallBold" style={styles.loginText}>Go to Login</ThemedText><MaterialCommunityIcons name="login" size={19} color="#FFF" /></Pressable></View><View style={styles.leafDecoration}><MaterialCommunityIcons name="shield-lock-outline" size={65} color="#1C713B" /><MaterialCommunityIcons name="leaf" size={38} color="#64B84D" /></View></SafeAreaView></ImageBackground>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FFF5' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247, 255, 247, 0.72)' },
  safeArea: { flex: 1, paddingHorizontal: 18 },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 118, height: 38 },
  headerSpace: { width: 36 },
  content: { paddingBottom: 26 },
  title: { color: '#073F20', fontSize: 26, lineHeight: 31, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#4D6B57', marginTop: 2, marginBottom: 13 },
  progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  progressDot: { width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E1EFE2' },
  progressDotActive: { backgroundColor: '#168B3E' },
  progressNumber: { color: '#5E8068', fontSize: 11 },
  progressNumberActive: { color: '#FFF' },
  progressLine: { width: 70, height: 2, backgroundColor: '#D7E9D9' },
  sectionTitle: { color: '#173F25', fontSize: 13, marginTop: 10, marginBottom: 8 },
  field: { marginBottom: 8 },
  fieldLabel: { color: '#385B45', fontSize: 11, marginBottom: 4 },
  inputWrap: { minHeight: 43, borderWidth: 1, borderColor: '#CFE4D2', borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.92)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 },
  input: { flex: 1, color: '#173F25', fontSize: 13, paddingVertical: 7 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2, marginBottom: 7 },
  termsText: { color: '#52705A', fontSize: 11, flex: 1 },
  error: { color: '#B22E2E', marginBottom: 8, fontSize: 12 },
  submitButton: { minHeight: 48, borderRadius: 10, backgroundColor: '#08702F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  submitText: { color: '#FFF', fontSize: 13 },
  pressed: { opacity: 0.8 },
  successSafeArea: { flex: 1, alignItems: 'center', paddingHorizontal: 18 },
  successHeader: { height: 65, justifyContent: 'center' },
  successCard: { width: '100%', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 18, borderWidth: 1, borderColor: '#D8EBDD', padding: 22, marginTop: 38 },
  successIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#28A84B', alignItems: 'center', justifyContent: 'center', borderWidth: 7, borderColor: '#DDF5D8', marginBottom: 17 },
  successTitle: { color: '#174A2C', fontSize: 21, lineHeight: 25, textAlign: 'center', fontWeight: '800' },
  statusCard: { width: '100%', borderWidth: 1, borderColor: '#D5E9D9', borderRadius: 12, padding: 13, marginTop: 24, alignItems: 'center' },
  statusLabel: { color: '#52705A', fontSize: 12, marginBottom: 8 },
  pending: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF4D7', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8 },
  pendingText: { color: '#9A6D00', fontSize: 11 },
  loginButton: { width: '100%', minHeight: 46, borderRadius: 10, backgroundColor: '#08702F', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 17 },
  loginText: { color: '#FFF' },
  leafDecoration: { marginTop: 45, alignItems: 'center', opacity: 0.9 },
});
