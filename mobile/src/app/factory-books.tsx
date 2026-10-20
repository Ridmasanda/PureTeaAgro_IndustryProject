import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ComponentProps } from 'react';
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

const books: {
  title: string;
  description: string;
  icon: IconName;
  tint: string;
  iconTint: string;
}[] = [
  {
    title: 'Chemical Order Book',
    description: 'Manage chemical orders, suppliers and stock records.',
    icon: 'flask',
    tint: '#F7F1FF',
    iconTint: '#7540B6',
  },
  {
    title: 'Green Leaf Book',
    description: 'Record green leaf arrivals and quality information.',
    icon: 'leaf',
    tint: '#EFF9F2',
    iconTint: '#188653',
  },
  {
    title: 'Tea Production / Shifting Book',
    description: 'Track processing, production and shift records.',
    icon: 'timer-outline',
    tint: '#EFF6FC',
    iconTint: '#1684D8',
  },
  {
    title: 'Tea Dispatch Book',
    description: 'Manage finished tea dispatches and stock movement.',
    icon: 'truck',
    tint: '#FFF6EB',
    iconTint: '#E87819',
  },
];

const navigation: [string, IconName][] = [
  ['Home', 'home-outline'],
  ['Books', 'book-open-variant'],
  ['Alerts', 'bell-outline'],
  ['Reports', 'chart-bar'],
  ['Profile', 'account-outline'],
];

export default function FactoryBooksScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to dashboard"
            onPress={() => router.back()}
            style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#274434" />
          </Pressable>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            Factory Books
          </ThemedText>
          <Pressable accessibilityRole="button" accessibilityLabel="Factory books menu" style={styles.menuButton}>
            <MaterialCommunityIcons name="view-dashboard" size={19} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.booksList}>
            {books.map((book) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${book.title}`}
                key={book.title}
                onPress={() => {
                  if (book.title === 'Green Leaf Book') {
                    router.push('/green-leaf-book');
                  } else if (book.title === 'Chemical Order Book') {
                    router.push('/chemical-order');
                  } else if (book.title === 'Tea Production / Shifting Book') {
                    router.push('/tea-production');
                  } else if (book.title === 'Tea Dispatch Book') {
                    router.push('/tea-dispatch');
                  }
                }}
                style={({ pressed }) => [
                  styles.bookCard,
                  { backgroundColor: book.tint },
                  pressed && styles.bookCardPressed,
                ]}>
                <View style={[styles.bookIcon, { backgroundColor: `${book.iconTint}1A` }]}>
                  <MaterialCommunityIcons name={book.icon} size={22} color={book.iconTint} />
                </View>
                <View style={styles.bookInfo}>
                  <ThemedText type="smallBold" style={styles.bookTitle}>
                    {book.title}
                  </ThemedText>
                  <ThemedText type="small" style={styles.bookDescription}>
                    {book.description}
                  </ThemedText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={21} color="#8A9B91" />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {navigation.map(([label, icon]) => {
            const selected = label === 'Books';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                key={label}
                onPress={() => {
                  if (label === 'Home') {
                    router.replace('/factory-officer-dashboard');
                  } else if (label === 'Alerts') {
                    router.replace('/factory-officer-notifications');
                  } else if (label === 'Reports') {
                    router.replace('/factory-reports');
                  } else if (label === 'Profile') {
                    router.replace('/factory-officer-profile');
                  } else if (label !== 'Books') {
                    router.replace('/factory-officer-dashboard');
                  }
                }}
                style={styles.navItem}>
                <MaterialCommunityIcons name={icon} size={19} color={selected ? '#087B4A' : '#78837B'} />
                <ThemedText type="small" style={[styles.navLabel, selected && styles.navLabelSelected]}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
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
    backgroundColor: 'rgba(249, 253, 247, 0.78)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 76, 53, 0.08)',
  },
  backButton: {
    width: 27,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#1B432E',
    fontSize: 17,
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#075D3B',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 6,
    paddingBottom: 16,
  },
  booksList: {
    gap: 8,
  },
  bookCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(78, 101, 83, 0.08)',
  },
  bookCardPressed: {
    opacity: 0.82,
  },
  bookIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    color: '#20372A',
    fontSize: 12,
    lineHeight: 16,
  },
  bookDescription: {
    color: '#627269',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },
  bottomNav: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E7ECE6',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  navItem: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  navLabel: {
    color: '#78837B',
    fontSize: 8,
    lineHeight: 12,
  },
  navLabelSelected: {
    color: '#087B4A',
    fontWeight: '700',
  },
});
