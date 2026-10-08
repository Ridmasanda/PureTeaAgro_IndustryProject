import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function EditTeaLandScreen() {
  const [landName, setLandName] = useState('Green Valley Tea Land');
  const [address, setAddress] = useState('No. 12, Green Lane, Thalawakale');
  const [size, setSize] = useState('6.5');
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" /></Pressable><ThemedText type="smallBold" style={styles.title}>Edit Tea Land</ThemedText><MaterialCommunityIcons name="leaf" size={24} color="#168B3E" /></View>
          <View style={styles.landHeader}><Image source={require('@/assets/images/background.png')} style={styles.landImage} /><View style={styles.landHeaderCopy}><ThemedText type="smallBold" style={styles.landTitle}>Green Valley Tea Land</ThemedText><View style={styles.activeBadge}><ThemedText type="smallBold" style={styles.activeText}>Active</ThemedText></View></View></View>
          <Field label="Land Name *" value={landName} onChangeText={setLandName} />
          <Field label="Address *" value={address} onChangeText={setAddress} />
          <ThemedText type="smallBold" style={styles.sectionTitle}>GPS Location</ThemedText>
          <View style={styles.locationBar}><Pressable style={styles.locationAction}><MaterialCommunityIcons name="map-marker-plus-outline" size={17} color="#168B3E" /><ThemedText type="smallBold" style={styles.actionText}>Update Location</ThemedText></Pressable><Pressable style={styles.locationAction}><MaterialCommunityIcons name="map-search-outline" size={17} color="#39785B" /><ThemedText type="smallBold" style={styles.mapText}>View on Map</ThemedText></Pressable></View>
          <View style={styles.mapPreview}><MaterialCommunityIcons name="map-outline" size={42} color="#7EBC80" /><ThemedText type="small" style={styles.mapPlaceholder}>6.0535, 80.2210</ThemedText></View>
          <ThemedText type="smallBold" style={styles.sectionTitle}>Land Size</ThemedText>
          <View style={styles.sizeRow}><View style={styles.sizeField}><ThemedText type="small" style={styles.fieldLabel}>Land Area *</ThemedText><TextInput value={size} onChangeText={setSize} keyboardType="decimal-pad" style={styles.input} /></View><View style={styles.sizeField}><ThemedText type="small" style={styles.fieldLabel}>Unit</ThemedText><View style={styles.input}><ThemedText type="small" style={styles.inputText}>Hectares (ha)</ThemedText><MaterialCommunityIcons name="chevron-down" size={18} color="#39785B" /></View></View></View>
          <ThemedText type="smallBold" style={styles.sectionTitle}>Supporting Documents</ThemedText>
          <Pressable style={styles.upload}><View style={styles.uploadIcon}><MaterialCommunityIcons name="upload" size={18} color="#168B3E" /></View><View><ThemedText type="smallBold" style={styles.uploadTitle}>Upload Documents</ThemedText><ThemedText type="small" style={styles.hint}>Land deed / Ownership proof, etc.</ThemedText></View></Pressable>
          <View style={styles.buttons}><Pressable style={styles.cancelButton} onPress={() => router.back()}><ThemedText type="smallBold" style={styles.cancelText}>Cancel</ThemedText></Pressable><Pressable style={styles.updateButton} onPress={() => router.back()}><ThemedText type="smallBold" style={styles.updateText}>Update Land</ThemedText></Pressable></View>
          <View style={styles.notice}><MaterialCommunityIcons name="information-outline" size={18} color="#168B3E" /><ThemedText type="small" style={styles.noticeText}>If land size changes, total registered land and sector category will be recalculated automatically.</ThemedText></View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View style={styles.field}><ThemedText type="small" style={styles.fieldLabel}>{label}</ThemedText><TextInput value={value} onChangeText={onChangeText} style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.62 }, safeArea: { flex: 1 }, content: { paddingHorizontal: 14, paddingBottom: 24 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9F7EC', alignItems: 'center', justifyContent: 'center' }, title: { color: '#173F25', fontSize: 17 }, landHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }, landImage: { width: 74, height: 44, borderRadius: 7 }, landHeaderCopy: { flex: 1 }, landTitle: { color: '#244D3A', fontSize: 13 }, activeBadge: { alignSelf: 'flex-start', backgroundColor: '#C9F0CF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }, activeText: { color: '#168B3E', fontSize: 9 }, field: { marginBottom: 8 }, fieldLabel: { color: '#527565', fontSize: 10, marginBottom: 3 }, input: { minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, color: '#315945', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { color: '#195436', fontSize: 12, marginTop: 8, marginBottom: 5 }, locationBar: { minHeight: 35, borderRadius: 8, borderWidth: 1, borderColor: '#CDE5D1', backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 9 }, locationAction: { flexDirection: 'row', alignItems: 'center', gap: 5 }, actionText: { color: '#28733A', fontSize: 10 }, mapText: { color: '#527565', fontSize: 10 }, mapPreview: { height: 67, marginTop: 3, borderRadius: 9, backgroundColor: '#BCE3C2', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, mapPlaceholder: { color: '#39785B', fontSize: 10 }, sizeRow: { flexDirection: 'row', gap: 9 }, sizeField: { flex: 1 }, inputText: { color: '#315945', flex: 1 }, upload: { minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: '#D1E6D5', backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 8 }, uploadIcon: { width: 28, height: 28, borderRadius: 15, backgroundColor: '#E5F7E8', alignItems: 'center', justifyContent: 'center' }, uploadTitle: { color: '#315945', fontSize: 10 }, hint: { color: '#789080', fontSize: 8 }, buttons: { flexDirection: 'row', gap: 9, marginTop: 11 }, cancelButton: { flex: 1, minHeight: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }, cancelText: { color: '#315945', fontSize: 10 }, updateButton: { flex: 1, minHeight: 40, borderRadius: 8, backgroundColor: '#07863C', alignItems: 'center', justifyContent: 'center' }, updateText: { color: '#FFF', fontSize: 10 }, notice: { marginTop: 9, borderRadius: 9, borderWidth: 1, borderColor: '#8DD39A', backgroundColor: '#E1F8E4', padding: 8, flexDirection: 'row', alignItems: 'center', gap: 7 }, noticeText: { color: '#28733A', fontSize: 9, flex: 1 }, pressed: { opacity: 0.8 },
});
