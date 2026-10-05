import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps } from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Role = {
  title: string;
  description: string;
  icon: IconName;
  approvalRequired?: boolean;
};

const roles: Role[] = [
  {
    title: 'Farmer',
    description: 'Tea land owner / cultivator',
    icon: 'account-tie-hat-outline',
  },
  {
    title: 'Tea Inspector',
    description: 'Field verification',
    icon: 'account-search-outline',
  },
  {
    title: 'Leaf Collector',
    description: 'Green leaf collection',
    icon: 'leaf',
  },
  {
    title: 'System Administrator',
    description: 'Manage the platform',
    icon: 'account-cog-outline',
    approvalRequired: true,
  },
  {
    title: 'Field Officer',
    description: 'Support field operations',
    icon: 'clipboard-account-outline',
  },
  {
    title: 'Factory Manager',
    description: 'Manage factory operations',
    icon: 'factory',
  },
];

export default function RegisterScreen() {
  const [selectedRole, setSelectedRole] = useState('Farmer');

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
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={25} color="#163E25" />
          </Pressable>

          <View style={styles.heading}>
            <ThemedText type="subtitle" style={styles.title}>
              Create your account
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Select your role
            </ThemedText>
          </View>

          <View style={styles.roleGrid}>
            {roles.map((role) => {
              const isSelected = selectedRole === role.title;

              return (
                <Pressable
                  accessibilityLabel={`Select ${role.title}`}
                  accessibilityRole="button"
                  key={role.title}
                  onPress={() => {
                    setSelectedRole(role.title);
                    if (role.title === 'Farmer') {
                      router.push('/farmer-registration');
                    }
                  }}
                  style={({ pressed }) => [
                    styles.roleCard,
                    isSelected && styles.roleCardSelected,
                    pressed && styles.roleCardPressed,
                  ]}>
                  <MaterialCommunityIcons
                    name={role.icon}
                    size={43}
                    color="#08702F"
                    style={styles.roleIcon}
                  />
                  <View style={styles.roleDetails}>
                    <ThemedText type="smallBold" style={styles.roleTitle}>
                      {role.title}
                    </ThemedText>
                    <ThemedText type="small" style={styles.roleDescription}>
                      {role.description}
                    </ThemedText>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#1F5E32" />
                  {role.approvalRequired && (
                    <View style={styles.approvalBadge}>
                      <ThemedText type="smallBold" style={styles.approvalText}>
                        Approval required
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              );
            })}
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
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(252, 255, 249, 0.65)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 26,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heading: {
    marginBottom: 26,
  },
  title: {
    color: '#073F20',
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
  },
  subtitle: {
    color: '#334F3A',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 2,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  roleCard: {
    width: '47.8%',
    minHeight: 154,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#D4E8CB',
    backgroundColor: 'rgba(255,255,255,0.93)',
    padding: 13,
    justifyContent: 'flex-start',
    shadowColor: '#174E27',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: '#08702F',
    borderWidth: 2.5,
  },
  roleCardPressed: {
    opacity: 0.82,
  },
  roleIcon: {
    marginBottom: 10,
  },
  roleDetails: {
    flex: 1,
    paddingRight: 4,
  },
  roleTitle: {
    color: '#102B19',
    fontSize: 16,
    lineHeight: 20,
  },
  roleDescription: {
    color: '#5B6B5D',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  approvalBadge: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: '#DFF2D7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  approvalText: {
    color: '#33733F',
    fontSize: 10,
    lineHeight: 14,
  },
});
