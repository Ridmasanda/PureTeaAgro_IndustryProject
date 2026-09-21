import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ComponentProps } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function HomeActionButton({
  label,
  icon,
  variant = 'soft',
  onPress,
}: {
  label: string;
  icon: IconName;
  variant?: 'primary' | 'soft';
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' ? styles.actionPrimary : styles.actionSoft,
        pressed && styles.buttonPressed,
      ]}>
      <View style={[styles.actionIcon, variant === 'primary' ? styles.actionIconPrimary : styles.actionIconSoft]}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={variant === 'primary' ? '#F8FFF6' : '#1E5C2B'}
        />
      </View>

      <ThemedText
        type="smallBold"
        style={[styles.actionLabel, variant === 'primary' ? styles.actionLabelPrimary : styles.actionLabelSoft]}>
        {label}
      </ThemedText>

      <MaterialCommunityIcons
        name="arrow-right"
        size={20}
        color={variant === 'primary' ? '#F8FFF6' : '#1E5C2B'}
      />
    </Pressable>
  );
}

export default function HomeScreen() {
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
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Image
                source={require('@/assets/images/logo.png')}
                resizeMode="contain"
                style={styles.logoImage}
              />
            </View>

            <ThemedText type="small" style={styles.welcomeText}>
              Welcome to
            </ThemedText>
            <ThemedText type="subtitle" style={styles.brandText}>
              PureTeaAgro
            </ThemedText>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <MaterialCommunityIcons name="leaf" size={12} color="#2E7A33" />
              <View style={styles.divider} />
            </View>

            <ThemedText type="small" style={styles.description}>
              A smarter way to manage tea farming, track agrochemicals, and ensure a sustainable future.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <HomeActionButton label="Login" icon="leaf" variant="primary" onPress={() => router.push('/login')} />
            <HomeActionButton label="Register" icon="account-plus-outline" />
            <HomeActionButton label="Learn About System" icon="information-outline" />
          </View>

          <View style={styles.footerBadge}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color="#274916" />
            <ThemedText type="small" style={styles.footerText}>
              Built for transparency, traceability, and better tea farming.
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 248, 234, 0.18)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
  },
  hero: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: 250,
    height: 250,
  },
  welcomeText: {
    color: '#1C6A2F',
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 12,
  },
  brandText: {
    color: '#1C6A2F',
    fontSize: 40,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
  },
  divider: {
    width: 36,
    height: 1,
    backgroundColor: 'rgba(46,122,51,0.38)',
  },
  description: {
    color: '#4E6250',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    maxWidth: 270,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  actionPrimary: {
    backgroundColor: '#1E5C2B',
  },
  actionSoft: {
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionIconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  actionIconSoft: {
    backgroundColor: 'rgba(30,92,43,0.08)',
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  actionLabelPrimary: {
    color: '#F8FFF6',
  },
  actionLabelSoft: {
    color: '#1E5C2B',
  },
  footerBadge: {
    marginTop: 50,
    marginBottom: 50,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(246, 241, 241, 0.61)',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  footerText: {
    color: '#3a4b27',
    fontSize: 13,
    lineHeight: 15,
    textAlign: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
});
