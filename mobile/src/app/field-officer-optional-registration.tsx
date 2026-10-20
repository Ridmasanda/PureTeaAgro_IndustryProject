import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function FieldOfficerOptionalRegistrationScreen() {
  const [documentSelected, setDocumentSelected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
              accessibilityLabel="Go back to professional information"
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
                  <View style={[styles.stepCircle, step === 4 && styles.activeStepCircle]}>
                    <ThemedText style={[styles.stepText, step === 4 && styles.activeStepText]}>{step}</ThemedText>
                  </View>
                  {step < 4 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>

            <View style={styles.form}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                4. Optional
              </ThemedText>
              <ThemedText style={styles.helperText}>Professional ID / Supporting Document</ThemedText>

              <Pressable
                accessibilityLabel={documentSelected ? 'Supporting document selected' : 'Tap to upload a supporting document'}
                accessibilityRole="button"
                onPress={() => setDocumentSelected((selected) => !selected)}
                style={[styles.uploadBox, documentSelected && styles.uploadBoxSelected]}>
                <MaterialCommunityIcons
                  name={documentSelected ? 'file-check-outline' : 'cloud-upload-outline'}
                  size={27}
                  color="#00A66F"
                />
                <ThemedText type="smallBold" style={styles.uploadTitle}>
                  {documentSelected ? 'Document selected' : 'Tap to upload'}
                </ThemedText>
                <ThemedText style={styles.uploadHint}>PDF, JPG, PNG (Max 5MB)</ThemedText>
              </Pressable>

              <ThemedText type="smallBold" style={[styles.sectionTitle, styles.termsTitle]}>
                5. Terms
              </ThemedText>

              <Pressable
                accessibilityLabel="I agree to the PureTeaAgro terms and conditions"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: termsAccepted }}
                onPress={() => setTermsAccepted((accepted) => !accepted)}
                style={styles.termsRow}>
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" />}
                </View>
                <ThemedText style={styles.termsText}>
                  I agree to the PureTeaAgro <ThemedText style={styles.termsLink}>terms and conditions</ThemedText>
                </ThemedText>
              </Pressable>
            </View>

            <Pressable
              accessibilityLabel="Create Field Officer Account"
              accessibilityRole="button"
              disabled={!termsAccepted}
              onPress={() => router.push('/field-officer-registration-success')}
              style={({ pressed }) => [
                styles.createButton,
                !termsAccepted && styles.createButtonDisabled,
                pressed && termsAccepted && styles.buttonPressed,
              ]}>
              <ThemedText type="smallBold" style={styles.createButtonText}>
                Create Field Officer Account
              </ThemedText>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    marginBottom: 7,
  },
  helperText: {
    color: '#6B788B',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 8,
  },
  uploadBox: {
    height: 109,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#98EAC5',
    backgroundColor: 'rgba(248, 255, 250, 0.66)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxSelected: {
    backgroundColor: 'rgba(230, 255, 242, 0.85)',
    borderColor: '#00A66F',
  },
  uploadTitle: {
    color: '#26384D',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 5,
  },
  uploadHint: {
    color: '#9AA8B5',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 2,
  },
  termsTitle: { marginTop: 17 },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#AFC0C0',
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  checkboxChecked: {
    borderColor: '#075A2E',
    backgroundColor: '#075A2E',
  },
  termsText: {
    flex: 1,
    color: '#536372',
    fontSize: 10,
    lineHeight: 15,
  },
  termsLink: {
    color: '#166A3A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  createButton: {
    height: 38,
    borderRadius: 20,
    backgroundColor: '#075A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 21,
    marginTop: 'auto',
  },
  createButtonDisabled: {
    backgroundColor: '#6D9A7D',
  },
  createButtonText: {
    color: '#F8FFF6',
    fontSize: 11,
    lineHeight: 15,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
