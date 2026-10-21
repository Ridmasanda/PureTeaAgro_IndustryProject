import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AdministratorBottomTabs,
  type AdministratorTab,
} from '@/app/administrator-home';
import { ThemedText } from '@/components/themed-text';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Recipient = 'All Farmers' | 'All Inspectors' | 'All Leaf Collectors' | 'Specific User' | 'Specific District';
type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
type Notification = {
  title: string;
  message: string;
  recipient: Recipient;
  priority: Priority;
  status: 'Draft' | 'Sent' | 'Scheduled';
  date: string;
};

const recipients: { label: Recipient; icon: IconName }[] = [
  { label: 'All Farmers', icon: 'account-group' },
  { label: 'All Inspectors', icon: 'account-search' },
  { label: 'All Leaf Collectors', icon: 'leaf' },
  { label: 'Specific User', icon: 'account-outline' },
  { label: 'Specific District', icon: 'map-marker' },
];
const priorities: { label: Priority; color: string; background: string }[] = [
  { label: 'Low', color: '#36824E', background: '#E7F7EB' },
  { label: 'Medium', color: '#FFFFFF', background: '#118343' },
  { label: 'High', color: '#C28212', background: '#FFF7E5' },
  { label: 'Urgent', color: '#D34B4B', background: '#FFF0EF' },
];
const initialSentNotifications: Notification[] = [
  {
    title: 'Collection schedule update',
    message: 'Please check the updated collection schedule for this week.',
    recipient: 'All Leaf Collectors',
    priority: 'Medium',
    status: 'Sent',
    date: '2025-09-08',
  },
  {
    title: 'Monthly tea quality review',
    message: 'Submit your monthly tea quality review by Friday.',
    recipient: 'All Inspectors',
    priority: 'High',
    status: 'Sent',
    date: '2025-09-07',
  },
];

export default function AdministratorNotificationsScreen() {
  const [activeTab, setActiveTab] = useState<'Create Notification' | 'Sent Notifications'>('Create Notification');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState<Recipient>('All Farmers');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [area, setArea] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notifications, setNotifications] = useState(initialSentNotifications);

  function selectTab(tab: AdministratorTab) {
    if (tab === 'Home') {
      router.replace('/administrator-home');
    } else if (tab === 'Users') {
      router.replace('/administrator-users');
    } else if (tab === 'Approvals') {
      router.replace('/administrator-approvals');
    } else if (tab === 'Activity') {
      router.replace('/administrator-activity');
    } else {
      router.replace({ pathname: '/administrator-home', params: { section: tab } });
    }
  }

  function saveNotification(status: Notification['status']) {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Missing information', 'Enter a notification title and message before continuing.');
      return;
    }
    if (recipient === 'Specific District' && !area.trim()) {
      Alert.alert('Recipient area required', 'Select or enter a district for this notification.');
      return;
    }
    if (scheduled && (!scheduleDate.trim() || !scheduleTime.trim())) {
      Alert.alert('Schedule required', 'Enter both a date and time for the scheduled notification.');
      return;
    }
    const notificationStatus = scheduled && status === 'Sent' ? 'Scheduled' : status;
    const notification: Notification = {
      title: title.trim(),
      message: message.trim(),
      recipient,
      priority,
      status: notificationStatus,
      date: scheduled ? `${scheduleDate} ${scheduleTime}` : 'Just now',
    };
    setNotifications((current) => [notification, ...current]);
    if (notificationStatus === 'Sent') {
      Alert.alert('Notification sent', 'This sample notification was added to Sent Notifications.');
      setTitle('');
      setMessage('');
    } else if (notificationStatus === 'Scheduled') {
      Alert.alert('Notification scheduled', 'This sample notification was added to Sent Notifications.');
      setTitle('');
      setMessage('');
    } else {
      Alert.alert('Draft saved', 'This sample draft was saved locally for this session.');
    }
    setActiveTab(notificationStatus === 'Draft' ? 'Create Notification' : 'Sent Notifications');
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Back to administrator dashboard"
              accessibilityRole="button"
              onPress={() => router.replace('/administrator-home')}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#155B35" />
            </Pressable>
            <ThemedText type="smallBold" style={styles.headerTitle}>Notifications</ThemedText>
            <MaterialCommunityIcons name="bell" size={20} color="#176B32" />
          </View>

          <View style={styles.screenTabs}>
            {(['Create Notification', 'Sent Notifications'] as const).map((tab) => {
              const selected = activeTab === tab;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.screenTab, selected && styles.screenTabSelected]}>
                  <MaterialCommunityIcons
                    name={tab === 'Create Notification' ? 'send' : 'clock-outline'}
                    size={13}
                    color={selected ? '#FFFFFF' : '#527765'}
                  />
                  <ThemedText type="smallBold" style={[styles.screenTabText, selected && styles.screenTabTextSelected]}>
                    {tab}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'Create Notification' ? (
            <>
              <View style={styles.formCard}>
                <FormLabel icon="format-title" label="Title" />
                <TextInput
                  accessibilityLabel="Notification title"
                  onChangeText={setTitle}
                  placeholder="Enter notification title..."
                  placeholderTextColor="#91A79A"
                  style={styles.titleInput}
                  value={title}
                />

                <FormLabel icon="message-text" label="Message" />
                <TextInput
                  accessibilityLabel="Notification message"
                  multiline
                  onChangeText={setMessage}
                  placeholder="Type your message here..."
                  placeholderTextColor="#91A79A"
                  style={styles.messageInput}
                  textAlignVertical="top"
                  value={message}
                />

                <FormLabel icon="account-group" label="Recipient Type" />
                <View style={styles.recipientGrid}>
                  {recipients.map((item) => {
                    const selected = recipient === item.label;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        key={item.label}
                        onPress={() => setRecipient(item.label)}
                        style={[
                          styles.recipientChip,
                          selected && styles.recipientChipSelected,
                          item.label === 'All Leaf Collectors' && styles.wideRecipientChip,
                        ]}>
                        {selected && <MaterialCommunityIcons name={item.icon} size={11} color="#FFFFFF" />}
                        <ThemedText type="smallBold" style={[styles.recipientText, selected && styles.recipientTextSelected]}>
                          {item.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                {(recipient === 'Specific User' || recipient === 'Specific District') && (
                  <>
                    <FormLabel icon="map-marker" label={recipient === 'Specific User' ? 'Recipient User' : 'Recipient Area'} />
                    <TextInput
                      accessibilityLabel={recipient === 'Specific User' ? 'Specific user' : 'Recipient area'}
                      onChangeText={setArea}
                      placeholder={recipient === 'Specific User' ? 'Enter user ID or name' : 'Select area (optional)'}
                      placeholderTextColor="#91A79A"
                      style={styles.titleInput}
                      value={area}
                    />
                  </>
                )}

                <FormLabel icon="alert" label="Notification Priority" />
                <View style={styles.priorityRow}>
                  {priorities.map((item) => {
                    const selected = priority === item.label;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        key={item.label}
                        onPress={() => setPriority(item.label)}
                        style={[
                          styles.priorityChip,
                          { backgroundColor: selected ? item.background : '#FFFFFF', borderColor: item.background },
                        ]}>
                        <ThemedText type="smallBold" style={[styles.priorityText, { color: item.color }]}>
                          {item.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.scheduleHeader}>
                  <FormLabel icon="calendar-clock" label="Schedule (Optional)" />
                  <Switch
                    accessibilityLabel="Schedule notification"
                    onValueChange={setScheduled}
                    thumbColor={scheduled ? '#FFFFFF' : '#FFFFFF'}
                    trackColor={{ false: '#C8D7CF', true: '#148443' }}
                    value={scheduled}
                  />
                </View>
                <View style={styles.scheduleRow}>
                  <View style={styles.scheduleInputWrap}>
                    <MaterialCommunityIcons name="calendar-month" size={13} color="#397750" />
                    <TextInput
                      accessibilityLabel="Schedule date"
                      editable={scheduled}
                      onChangeText={setScheduleDate}
                      placeholder="Select date"
                      placeholderTextColor="#789082"
                      style={styles.scheduleInput}
                      value={scheduleDate}
                    />
                  </View>
                  <View style={styles.scheduleInputWrap}>
                    <MaterialCommunityIcons name="clock-outline" size={13} color="#397750" />
                    <TextInput
                      accessibilityLabel="Schedule time"
                      editable={scheduled}
                      onChangeText={setScheduleTime}
                      placeholder="Select time"
                      placeholderTextColor="#789082"
                      style={styles.scheduleInput}
                      value={scheduleTime}
                    />
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => saveNotification('Draft')}
                    style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
                    <MaterialCommunityIcons name="content-save" size={14} color="#21834A" />
                    <ThemedText type="smallBold" style={styles.saveButtonText}>Save Draft</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => saveNotification('Sent')}
                    style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}>
                    <MaterialCommunityIcons name="send" size={14} color="#FFFFFF" />
                    <ThemedText type="smallBold" style={styles.sendButtonText}>
                      {scheduled ? 'Schedule' : 'Send Now'}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
              <View style={styles.recipientHint}>
                <MaterialCommunityIcons name="account-group" size={21} color="#237746" />
                <View style={styles.hintTextWrap}>
                  <ThemedText type="smallBold" style={styles.hintTitle}>Recipient Options</ThemedText>
                  <ThemedText type="small" style={styles.hintText}>
                    Send notifications to farmers, inspectors, collectors or specific users and areas.
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="small" style={styles.demoNote}>
                Notifications are sample data and are not delivered to users.
              </ThemedText>
            </>
          ) : (
            <View style={styles.sentList}>
              {notifications.filter((notification) => notification.status !== 'Draft').map((notification, index) => (
                <View key={`${notification.title}-${index}`} style={styles.sentCard}>
                  <View style={[styles.sentIcon, notification.priority === 'Urgent' && styles.urgentIcon]}>
                    <MaterialCommunityIcons name="bell-outline" size={17} color="#27804A" />
                  </View>
                  <View style={styles.sentCopy}>
                    <ThemedText type="smallBold" style={styles.sentTitle}>{notification.title}</ThemedText>
                    <ThemedText type="small" style={styles.sentMessage}>{notification.message}</ThemedText>
                    <ThemedText type="small" style={styles.sentMeta}>
                      {notification.recipient} · {notification.date}
                    </ThemedText>
                  </View>
                  <View style={styles.sentStatus}>
                    <ThemedText type="smallBold" style={styles.sentStatusText}>{notification.status}</ThemedText>
                    <ThemedText type="small" style={styles.priorityMeta}>{notification.priority}</ThemedText>
                  </View>
                </View>
              ))}
              {notifications.filter((notification) => notification.status !== 'Draft').length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="send-clock-outline" size={32} color="#70927A" />
                  <ThemedText type="smallBold" style={styles.emptyTitle}>No sent notifications yet</ThemedText>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        <AdministratorBottomTabs activeTab="Activity" onSelect={selectTab} onRoute={router.replace} />
      </SafeAreaView>
    </ImageBackground>
  );
}

function FormLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.formLabelRow}>
      <View style={styles.labelIcon}>
        <MaterialCommunityIcons name={icon} size={13} color="#25804A" />
      </View>
      <ThemedText type="smallBold" style={styles.formLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4FBF3' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(247,253,245,0.77)' },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 12, paddingTop: 3, paddingBottom: 8 },
  header: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  backButton: { width: 34, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#18543A', fontSize: 17 },
  screenTabs: { minHeight: 33, borderRadius: 9, borderWidth: 1, borderColor: '#D8EAE0', backgroundColor: 'rgba(255,255,255,0.92)', flexDirection: 'row', padding: 2, marginBottom: 7 },
  screenTab: { flex: 1, borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  screenTabSelected: { backgroundColor: '#118343' },
  screenTabText: { color: '#527765', fontSize: 8 },
  screenTabTextSelected: { color: '#FFFFFF' },
  formCard: { borderWidth: 1, borderColor: '#D7E9DF', borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.96)', padding: 8 },
  formLabelRow: { minHeight: 19, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  labelIcon: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#E6F6E8', alignItems: 'center', justifyContent: 'center' },
  formLabel: { color: '#456C54', fontSize: 8 },
  titleInput: { height: 24, borderWidth: 1, borderColor: '#DCEBE3', borderRadius: 6, color: '#456C54', fontSize: 8, paddingHorizontal: 8, marginLeft: 25, marginBottom: 3 },
  messageInput: { height: 43, borderWidth: 1, borderColor: '#DCEBE3', borderRadius: 6, color: '#456C54', fontSize: 8, paddingHorizontal: 8, paddingTop: 6, marginLeft: 25, marginBottom: 3 },
  recipientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingLeft: 25, marginTop: 2, marginBottom: 2 },
  recipientChip: { minWidth: '30%', minHeight: 23, borderRadius: 15, borderWidth: 1, borderColor: '#D9EAE2', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, paddingHorizontal: 7 },
  recipientChipSelected: { backgroundColor: '#148443', borderColor: '#148443' },
  wideRecipientChip: { minWidth: '34%' },
  recipientText: { color: '#527765', fontSize: 7 },
  recipientTextSelected: { color: '#FFFFFF' },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 5, paddingLeft: 25, marginTop: 3, marginBottom: 3 },
  priorityChip: { flex: 1, minHeight: 23, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  priorityText: { fontSize: 7 },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 2 },
  scheduleRow: { flexDirection: 'row', gap: 6, paddingLeft: 25, marginTop: 3 },
  scheduleInputWrap: { flex: 1, height: 25, borderWidth: 1, borderColor: '#DCEBE3', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 6 },
  scheduleInput: { flex: 1, height: 24, color: '#456C54', fontSize: 7, paddingVertical: 0 },
  actionRow: { flexDirection: 'row', gap: 6, marginTop: 7 },
  saveButton: { flex: 1, minHeight: 30, borderRadius: 16, borderWidth: 1, borderColor: '#38A367', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  saveButtonText: { color: '#24804A', fontSize: 8 },
  sendButton: { flex: 1, minHeight: 30, borderRadius: 16, backgroundColor: '#108541', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  sendButtonText: { color: '#FFFFFF', fontSize: 8 },
  recipientHint: { minHeight: 47, borderRadius: 10, backgroundColor: 'rgba(225,246,231,0.96)', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, marginTop: 7 },
  hintTextWrap: { flex: 1 },
  hintTitle: { color: '#38724A', fontSize: 8 },
  hintText: { color: '#688373', fontSize: 7, lineHeight: 10 },
  demoNote: { color: '#829184', fontSize: 7, textAlign: 'center', marginTop: 6 },
  sentList: { gap: 7 },
  sentCard: { minHeight: 75, borderWidth: 1, borderColor: '#D7E9DF', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.96)', flexDirection: 'row', alignItems: 'flex-start', gap: 7, padding: 9 },
  sentIcon: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#E5F5E7', alignItems: 'center', justifyContent: 'center' },
  urgentIcon: { backgroundColor: '#FFF0EF' },
  sentCopy: { flex: 1, gap: 3 },
  sentTitle: { color: '#315E42', fontSize: 9 },
  sentMessage: { color: '#6B8072', fontSize: 8 },
  sentMeta: { color: '#83958A', fontSize: 7 },
  sentStatus: { alignItems: 'flex-end', gap: 5 },
  sentStatusText: { color: '#27804A', fontSize: 7 },
  priorityMeta: { color: '#819186', fontSize: 7 },
  emptyState: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.92)' },
  emptyTitle: { color: '#315E42', fontSize: 10 },
  pressed: { opacity: 0.83 },
});
