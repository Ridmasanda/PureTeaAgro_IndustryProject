import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Step = 0 | 1 | 2 | 3 | 4 | 5;

const green = '#087A38';
const paleGreen = '#E9F8EC';

export default function FarmerAgrochemicalsScreen() {
  const [step, setStep] = useState<Step | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [land, setLand] = useState('Green Valley Tea Land');
  const [chemicalType, setChemicalType] = useState<'Fertilizer' | 'Pesticide'>('Fertilizer');
  const [product, setProduct] = useState('GreenGrow Fertilizer');
  const [quantity, setQuantity] = useState('5');
  const [unit, setUnit] = useState('kg');
  const [date, setDate] = useState('19 Sep 2026');
  const [time, setTime] = useState('Morning');
  const [reason, setReason] = useState('Pest or Insects');
  const [submitted, setSubmitted] = useState(false);

  if (showHistory) {
    return <ApplicationHistory onBack={() => setShowHistory(false)} />;
  }

  if (showApproved) {
    return <ApprovedChemicals onBack={() => setShowApproved(false)} />;
  }

  if (step !== null) {
    return (
      <RecordFlow
        step={step}
        land={land}
        setLand={setLand}
        chemicalType={chemicalType}
        setChemicalType={setChemicalType}
        product={product}
        setProduct={setProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        unit={unit}
        setUnit={setUnit}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        reason={reason}
        setReason={setReason}
        onBack={() => setStep(step === 0 ? null : ((step - 1) as Step))}
        onNext={() => step === 5 ? setSubmitted(true) : setStep((step + 1) as Step)}
        submitted={submitted}
        onClose={() => { setSubmitted(false); setStep(null); }}
      />
    );
  }

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header title="Agrochemical Overview" />
          <View style={styles.statsGrid}>
            <Stat icon="flask-outline" label="Total Applications" value="5" />
            <Stat icon="calendar-month-outline" label="This Month's Applications" value="2" />
            <Stat icon="clock-outline" label="Pending Verification" value="1" />
            <Stat icon="alert-circle" label="Compliance Alerts" value="0" alert />
          </View>
          <ActionButton icon="plus-circle" label="Record Agrochemical Usage" primary onPress={() => setStep(0)} />
          <ActionButton icon="file-document-outline" label="View Application History" onPress={() => setShowHistory(true)} />
          <ActionButton icon="sprout-outline" label="View Approved Agrochemicals" onPress={() => setShowApproved(true)} />
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={green} />
            <View style={styles.tipCopy}>
              <ThemedText type="smallBold" style={styles.tipTitle}>Keep your records up to date</ThemedText>
              <ThemedText type="small" style={styles.tipText}>Record every application to maintain compliance and traceability.</ThemedText>
            </View>
          </View>
        </ScrollView>
        <BottomNav active="Agrochemicals" />
      </SafeAreaView>
    </ImageBackground>
  );
}

function ApplicationHistory({ onBack }: { onBack: () => void }) {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.historyContent} showsVerticalScrollIndicator={false}>
          <Header title="Application History" onBack={onBack} />
          <View style={styles.filterGrid}>
            <HistoryFilter label="Select Land" value="All Lands" />
            <HistoryFilter label="Date Range" value="Last 3 Months" icon="calendar-month-outline" />
            <HistoryFilter label="Chemical Type" value="All Types" />
            <HistoryFilter label="Status" value="All Status" />
          </View>
          <ApplicationCard
            title="Pesticide Application"
            land="Green Valley Tea Land"
            product="Product A"
            quantity="2 L"
            date="12 Sep 2026"
            status="Verified"
            statusStyle={styles.verifiedBadge}
          />
          <ApplicationCard
            title="Fertilizer Application"
            land="Hilltop Tea Land"
            product="Product B"
            quantity="5 kg"
            date="05 Sep 2026"
            status="Pending"
            statusStyle={styles.pendingBadge}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function ApprovedChemicals({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pesticide' | 'Fertilizer'>('All');
  const chemicals = [
    { name: 'Product A', type: 'Pesticide', ingredient: 'Ingredient A', waiting: '15 days', icon: 'flask-round-bottom' as IconName },
    { name: 'Fertilizer B', type: 'Fertilizer', ingredient: 'Ingredient B', waiting: '7 days', icon: 'flask' as IconName },
    { name: 'Product C', type: 'Pesticide', ingredient: 'Ingredient C', waiting: '10 days', icon: 'flask-round-bottom' as IconName },
  ];
  const visibleChemicals = chemicals.filter((chemical) => {
    const matchesFilter = filter === 'All' || chemical.type === filter;
    const matchesSearch = `${chemical.name} ${chemical.ingredient}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.historyContent} showsVerticalScrollIndicator={false}>
          <Header title="Approved Chemicals" onBack={onBack} />
          <View style={styles.searchWrap}>
            <MaterialCommunityIcons name="magnify" size={21} color="#527568" />
            <TextInput value={search} onChangeText={setSearch} placeholder="Search chemical..." placeholderTextColor="#9AB4A6" style={styles.searchInput} />
          </View>
          <View style={styles.chemicalTabs}>
            {(['All', 'Pesticide', 'Fertilizer'] as const).map((tab) => (
              <Pressable key={tab} onPress={() => setFilter(tab)} style={[styles.chemicalTab, filter === tab && styles.chemicalTabActive]}>
                <ThemedText type="smallBold" style={filter === tab ? styles.chemicalTabActiveText : styles.chemicalTabText}>{tab}</ThemedText>
              </Pressable>
            ))}
          </View>
          {visibleChemicals.map((chemical) => <ApprovedChemicalCard key={chemical.name} {...chemical} />)}
          <View style={styles.restrictedNotice}>
            <MaterialCommunityIcons name="alert" size={20} color="#E0443E" />
            <ThemedText type="small" style={styles.restrictedNoticeText}>Restricted chemical not available</ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function ApprovedChemicalCard({ name, type, ingredient, waiting, icon }: { name: string; type: string; ingredient: string; waiting: string; icon: IconName }) {
  return (
    <View style={styles.chemicalCard}>
      <View style={styles.chemicalCardTop}>
        <View style={styles.chemicalIcon}><MaterialCommunityIcons name={icon} size={27} color={green} /></View>
        <View style={styles.chemicalCopy}>
          <ThemedText type="smallBold" style={styles.chemicalName}>{name}</ThemedText>
          <ThemedText type="smallBold" style={styles.chemicalType}>{type}</ThemedText>
          <ThemedText type="small" style={styles.chemicalMeta}>Active Ingredient: {ingredient}</ThemedText>
          <ThemedText type="small" style={styles.chemicalMeta}>Waiting Period: {waiting}</ThemedText>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#2E7950" />
      </View>
      <Pressable style={styles.chemicalDetails}><ThemedText type="smallBold" style={styles.chemicalDetailsText}>View Details</ThemedText></Pressable>
    </View>
  );
}

function HistoryFilter({ label, value, icon }: { label: string; value: string; icon?: IconName }) {
  return (
    <View style={styles.historyFilter}>
      <ThemedText type="small" style={styles.historyFilterLabel}>{label}</ThemedText>
      <View style={styles.historyFilterValue}>
        {icon && <MaterialCommunityIcons name={icon} size={18} color="#527568" />}
        <ThemedText type="small" style={styles.historyFilterText}>{value}</ThemedText>
        <MaterialCommunityIcons name="chevron-down" size={18} color="#47745C" />
      </View>
    </View>
  );
}

function ApplicationCard({
  title, land, product, quantity, date, status, statusStyle,
}: {
  title: string; land: string; product: string; quantity: string; date: string; status: string; statusStyle: object;
}) {
  return (
    <View style={styles.applicationCard}>
      <View style={styles.applicationTop}>
        <View style={styles.applicationIcon}><MaterialCommunityIcons name="flask-outline" size={23} color="#FFF" /></View>
        <View style={styles.applicationCopy}>
          <ThemedText type="smallBold" style={styles.applicationTitle}>{title}</ThemedText>
          <ThemedText type="small" style={styles.applicationLand}>{land}</ThemedText>
          <View style={styles.applicationInfo}><MaterialCommunityIcons name="flask-outline" size={14} color="#4B7962" /><ThemedText type="small" style={styles.applicationMeta}>{product}</ThemedText></View>
          <View style={styles.applicationInfo}><MaterialCommunityIcons name="weight-kilogram" size={14} color="#4B7962" /><ThemedText type="small" style={styles.applicationMeta}>{quantity}</ThemedText><MaterialCommunityIcons name="calendar-month-outline" size={14} color="#4B7962" /><ThemedText type="small" style={styles.applicationMeta}>{date}</ThemedText></View>
        </View>
        <ThemedText type="smallBold" style={[styles.applicationStatus, statusStyle]}>{status}</ThemedText>
      </View>
      <View style={styles.applicationActions}>
        <Pressable style={styles.historyAction}><ThemedText type="smallBold" style={styles.historyActionText}>View Details</ThemedText></Pressable>
        <Pressable style={styles.historyAction}><ThemedText type="smallBold" style={styles.historyActionText}>Inspector Findings</ThemedText></Pressable>
      </View>
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" onPress={onBack ?? (() => router.back())} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={23} color="#173F25" />
      </Pressable>
      <ThemedText type="smallBold" style={styles.headerTitle}>{title}</ThemedText>
      <Image source={require('@/assets/images/icon.png')} style={styles.headerLogo} resizeMode="contain" />
    </View>
  );
}

function Stat({ icon, label, value, alert }: { icon: IconName; label: string; value: string; alert?: boolean }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, alert && styles.alertIcon]}>
        <MaterialCommunityIcons name={icon} size={23} color={alert ? '#F04438' : green} />
      </View>
      <View style={styles.statCopy}>
        <ThemedText type="small" style={styles.statLabel}>{label}</ThemedText>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

function ActionButton({ icon, label, primary, onPress }: { icon: IconName; label: string; primary?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.primaryAction, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={22} color={primary ? '#FFF' : green} />
      <ThemedText type="smallBold" style={[styles.actionText, primary && styles.primaryActionText]}>{label}</ThemedText>
      <MaterialCommunityIcons name="chevron-right" size={21} color={primary ? '#FFF' : '#47745C'} />
    </Pressable>
  );
}

function RecordFlow({
  step, land, setLand, chemicalType, setChemicalType, product, setProduct, quantity, setQuantity, unit, setUnit, date, setDate, time, setTime, reason, setReason, onBack, onNext, submitted, onClose,
}: {
  step: Step; land: string; setLand: (value: string) => void; chemicalType: 'Fertilizer' | 'Pesticide'; setChemicalType: (value: 'Fertilizer' | 'Pesticide') => void;
  product: string; setProduct: (value: string) => void; quantity: string; setQuantity: (value: string) => void; unit: string; setUnit: (value: string) => void;
  date: string; setDate: (value: string) => void; time: string; setTime: (value: string) => void; reason: string; setReason: (value: string) => void;
  onBack: () => void; onNext: () => void; submitted: boolean; onClose: () => void;
}) {
  if (submitted) {
    return <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}><StatusBar style="dark" /><View pointerEvents="none" style={styles.backgroundOverlay} /><SafeAreaView style={styles.success}><MaterialCommunityIcons name="check-circle" size={78} color={green} /><ThemedText type="subtitle" style={styles.successTitle}>Record Saved!</ThemedText><ThemedText type="small" style={styles.successText}>Your application has been saved successfully.</ThemedText><View style={styles.referenceCard}><ThemedText type="small" style={styles.muted}>Record Reference</ThemedText><ThemedText type="smallBold" style={styles.referenceText}>AGR-000124</ThemedText><MaterialCommunityIcons name="content-copy" size={18} color={green} /></View><View style={styles.waitingCard}><MaterialCommunityIcons name="clock-outline" size={20} color="#6D8C00" /><View><ThemedText type="smallBold" style={styles.waitingTitle}>Waiting for Review</ThemedText><ThemedText type="small" style={styles.muted}>Your record will be checked soon.</ThemedText></View></View><Pressable onPress={onClose} style={styles.primaryButton}><MaterialCommunityIcons name="home" size={18} color="#FFF" /><ThemedText type="smallBold" style={styles.primaryButtonText}>Back to Home</ThemedText></Pressable></SafeAreaView></ImageBackground>;
  }

  const titles: Record<Step, string> = { 0: 'Which land did you use it on?', 1: 'What did you use?', 2: 'How much did you use?', 3: 'When was it used?', 4: 'Why did you use it?', 5: 'Check your record' };
  return (
    <ImageBackground source={require('@/assets/images/background.png')} resizeMode="cover" style={styles.container}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header title={titles[step]} onBack={onBack} />
          <View style={styles.progress}><View style={[styles.progressFill, { width: `${((step + 1) / 6) * 100}%` }]} /></View>
          {step === 0 && <LandStep land={land} setLand={setLand} />}
          {step === 1 && <ChemicalStep chemicalType={chemicalType} setChemicalType={setChemicalType} product={product} setProduct={setProduct} />}
          {step === 2 && <QuantityStep quantity={quantity} setQuantity={setQuantity} unit={unit} setUnit={setUnit} />}
          {step === 3 && <DateStep date={date} setDate={setDate} time={time} setTime={setTime} />}
          {step === 4 && <DetailsStep reason={reason} setReason={setReason} />}
          {step === 5 && <ReviewStep land={land} chemicalType={chemicalType} product={product} quantity={quantity} unit={unit} date={date} time={time} reason={reason} />}
          <Pressable accessibilityRole="button" onPress={onNext} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.primaryButtonText}>{step === 5 ? 'Submit Record' : 'Next'}</ThemedText>
            <MaterialCommunityIcons name={step === 5 ? 'send' : 'arrow-right'} size={20} color="#FFF" />
          </Pressable>
          {step > 0 && <Pressable onPress={onBack} style={styles.backLink}><ThemedText type="small" style={styles.backLinkText}>Back</ThemedText></Pressable>}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function LandStep({ land, setLand }: { land: string; setLand: (value: string) => void }) {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Your tea lands</ThemedText>{['Green Valley Tea Land', 'Hilltop Tea Land'].map((name, index) => <Pressable key={name} onPress={() => setLand(name)} style={[styles.landCard, land === name && styles.selectedCard]}><View style={styles.landImage}><MaterialCommunityIcons name="image-outline" size={30} color="#6BA777" /></View><View style={styles.landCopy}><ThemedText type="smallBold">{name}</ThemedText><ThemedText type="small" style={styles.muted}>{index === 0 ? '6.5 hectares' : '12 hectares'}</ThemedText><View style={styles.sector}><ThemedText type="small" style={styles.sectorText}>{index === 0 ? 'Small Sector' : 'Medium Sector'}</ThemedText></View></View><MaterialCommunityIcons name={land === name ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={land === name ? green : '#B6D8C0'} /></Pressable>)}</View>;
}

function ChemicalStep({ chemicalType, setChemicalType, product, setProduct }: { chemicalType: 'Fertilizer' | 'Pesticide'; setChemicalType: (value: 'Fertilizer' | 'Pesticide') => void; product: string; setProduct: (value: string) => void }) {
  const products = chemicalType === 'Fertilizer' ? ['GreenGrow Fertilizer', 'RootBoost Fertilizer'] : ['LeafGuard Pest Control', 'BioShield Pest Control'];
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>What did you use?</ThemedText><View style={styles.segment}><Pressable onPress={() => setChemicalType('Fertilizer')} style={[styles.segmentItem, chemicalType === 'Fertilizer' && styles.segmentActive]}><MaterialCommunityIcons name="flask" size={20} color={chemicalType === 'Fertilizer' ? '#FFF' : green} /><ThemedText type="smallBold" style={chemicalType === 'Fertilizer' ? styles.segmentTextActive : styles.muted}>Fertilizer</ThemedText></Pressable><Pressable onPress={() => setChemicalType('Pesticide')} style={[styles.segmentItem, chemicalType === 'Pesticide' && styles.segmentActive]}><MaterialCommunityIcons name="bug-outline" size={20} color={chemicalType === 'Pesticide' ? '#FFF' : green} /><ThemedText type="smallBold" style={chemicalType === 'Pesticide' ? styles.segmentTextActive : styles.muted}>Pest Control</ThemedText></Pressable></View><ThemedText type="smallBold" style={styles.fieldLabel}>Select an approved product</ThemedText>{products.map((name) => <Pressable key={name} onPress={() => setProduct(name)} style={[styles.productCard, product === name && styles.selectedCard]}><View style={styles.productIcon}><MaterialCommunityIcons name="flask-outline" size={24} color={green} /></View><View style={styles.landCopy}><ThemedText type="smallBold">{name}</ThemedText><ThemedText type="small" style={styles.muted}>(Approved)</ThemedText></View><MaterialCommunityIcons name={product === name ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={product === name ? green : '#B6D8C0'} /></Pressable>)}</View>;
}

function QuantityStep({ quantity, setQuantity, unit, setUnit }: { quantity: string; setQuantity: (value: string) => void; unit: string; setUnit: (value: string) => void }) {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Enter quantity and unit</ThemedText><View style={styles.quantityControl}><Pressable onPress={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))} style={styles.quantityButton}><ThemedText style={styles.quantityButtonText}>−</ThemedText></Pressable><ThemedText style={styles.quantityValue}>{quantity}</ThemedText><Pressable onPress={() => setQuantity(String(Number(quantity) + 1))} style={styles.quantityButton}><ThemedText style={styles.quantityButtonText}>+</ThemedText></Pressable></View><View style={styles.unitRow}>{['kg', 'L', 'packs'].map((item) => <Pressable key={item} onPress={() => setUnit(item)} style={[styles.unitButton, unit === item && styles.unitButtonActive]}><ThemedText type="smallBold" style={unit === item ? styles.segmentTextActive : styles.muted}>{item}</ThemedText></Pressable>)}</View><Field label="Application area (optional)" value="" placeholder="Where did you apply it?" /></View>;
}

function DateStep({ date, setDate, time, setTime }: { date: string; setDate: (value: string) => void; time: string; setTime: (value: string) => void }) {
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Choose an application date</ThemedText>{['Today', 'Yesterday', 'Choose Date'].map((item) => <Pressable key={item} onPress={() => setDate(item === 'Today' ? 'Today' : item === 'Yesterday' ? '18 Sep 2026' : date)} style={[styles.choiceRow, (item === 'Today' && date === 'Today') && styles.choiceRowActive]}><MaterialCommunityIcons name="calendar-month-outline" size={19} color={date === 'Today' && item === 'Today' ? '#FFF' : green} /><ThemedText type="smallBold" style={date === 'Today' && item === 'Today' ? styles.segmentTextActive : styles.muted}>{item}</ThemedText></Pressable>)}<ThemedText type="smallBold" style={styles.fieldLabel}>Time of day (optional)</ThemedText><View style={styles.timeRow}>{['Morning', 'Afternoon', 'Evening'].map((item) => <Pressable key={item} onPress={() => setTime(item)} style={[styles.timeButton, time === item && styles.segmentActive]}><MaterialCommunityIcons name={item === 'Morning' ? 'weather-sunny' : item === 'Afternoon' ? 'white-balance-sunny' : 'weather-night'} size={17} color={time === item ? '#FFF' : green} /><ThemedText type="smallBold" style={time === item ? styles.segmentTextActive : styles.muted}>{item}</ThemedText></Pressable>)}</View></View>;
}

function DetailsStep({ reason, setReason }: { reason: string; setReason: (value: string) => void }) {
  const reasons = ['Pest or Insects', 'Plant Disease', 'Weeds', 'Help Plants Grow', 'Other'];
  return <View style={styles.stepBody}><ThemedText type="smallBold" style={styles.fieldLabel}>Choose one option</ThemedText><View style={styles.reasonGrid}>{reasons.map((item, index) => <Pressable key={item} onPress={() => setReason(item)} style={[styles.reasonCard, reason === item && styles.selectedCard]}><MaterialCommunityIcons name={index === 0 ? 'bug-outline' : index === 1 ? 'weather-lightning' : index === 2 ? 'grass' : index === 3 ? 'sprout-outline' : 'dots-horizontal'} size={24} color={reason === item ? green : '#4D8A63'} /><ThemedText type="smallBold" style={styles.reasonText}>{item}</ThemedText></Pressable>)}</View><Pressable style={styles.upload}><MaterialCommunityIcons name="camera-outline" size={23} color={green} /><View><ThemedText type="smallBold">Add photo (optional)</ThemedText><ThemedText type="small" style={styles.muted}>Take or choose a photo</ThemedText></View><MaterialCommunityIcons name="chevron-right" size={20} color={green} /></Pressable><Pressable style={styles.upload}><MaterialCommunityIcons name="microphone-outline" size={23} color={green} /><View><ThemedText type="smallBold">Add voice note (optional)</ThemedText><ThemedText type="small" style={styles.muted}>Tap to record</ThemedText></View><MaterialCommunityIcons name="chevron-right" size={20} color={green} /></Pressable></View>;
}

function ReviewStep({ land, chemicalType, product, quantity, unit, date, time, reason }: { land: string; chemicalType: string; product: string; quantity: string; unit: string; date: string; time: string; reason: string }) {
  return <View style={styles.reviewCard}><ReviewRow icon="map-marker-outline" label="Tea Land" value={`${land} • 6.5 hectares`} /><ReviewRow icon="flask-outline" label="Chemical" value={`${chemicalType} • ${product}`} /><ReviewRow icon="scale-balance" label="Amount" value={`${quantity} ${unit}`} /><ReviewRow icon="calendar-month-outline" label="Date" value={`${date} • ${time}`} /><ReviewRow icon="shield-check-outline" label="Reason" value={reason} /></View>;
}

function ReviewRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <View style={styles.reviewRow}><MaterialCommunityIcons name={icon} size={21} color={green} /><View><ThemedText type="small" style={styles.muted}>{label}</ThemedText><ThemedText type="smallBold">{value}</ThemedText></View></View>;
}

function Field({ label, value, onChangeText, placeholder, suffix, icon }: { label: string; value: string; onChangeText?: (value: string) => void; placeholder?: string; suffix?: string; icon?: IconName }) {
  return <View style={styles.field}><ThemedText type="smallBold" style={styles.fieldLabel}>{label}</ThemedText><View style={styles.inputWrap}>{icon && <MaterialCommunityIcons name={icon} size={20} color="#527568" />}<TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9AB4A6" style={styles.input} /><ThemedText type="small" style={styles.suffix}>{suffix}</ThemedText></View></View>;
}

function BottomNav({ active }: { active: string }) {
  const items: [IconName, string, () => void][] = [
    ['home', 'Home', () => router.replace('/farmer-dashboard')],
    ['map-outline', 'My Lands', () => router.push('/farmer-my-tea-lands')],
    ['flask-outline', 'Agrochemicals', () => router.push('/farmer-agrochemicals')],
    ['bell-outline', 'Notifications', () => router.push('/farmer-notification')],
    ['account-outline', 'Profile', () => router.push('/farmer-profile')],
  ];
  return <View style={styles.bottomNav}>{items.map(([icon, label, onPress]) => <Pressable key={label} onPress={onPress} style={styles.navItem}><MaterialCommunityIcons name={icon} size={21} color={label === active ? green : '#58776A'} /><ThemedText type="small" style={[styles.navLabel, label === active && styles.navLabelActive]}>{label}</ThemedText></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCF7' },
  backgroundOverlay: { ...StyleSheet.absoluteFill, backgroundColor: '#F7FFF8', opacity: 0.72 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 24 },
  historyContent: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 34, height: 34, justifyContent: 'center' },
  headerTitle: { color: '#173F25', fontSize: 17 },
  headerLogo: { width: 34, height: 34 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  stat: { width: '48%', minHeight: 76, borderWidth: 1, borderColor: '#CFE8D5', borderRadius: 14, backgroundColor: '#FBFFFC', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statIcon: { width: 32, height: 32, borderRadius: 17, backgroundColor: '#DDF6E2', justifyContent: 'center', alignItems: 'center' },
  alertIcon: { backgroundColor: '#FFE3DF' },
  statCopy: { flex: 1 },
  statLabel: { color: '#597467', fontSize: 10, lineHeight: 13 },
  statValue: { color: '#123F2C', fontWeight: '700', fontSize: 18, lineHeight: 23 },
  action: { minHeight: 46, borderWidth: 1, borderColor: '#B8DCC2', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, marginTop: 8, backgroundColor: '#FAFFFB' },
  primaryAction: { backgroundColor: green, borderColor: green },
  actionText: { color: '#2D5C49', flex: 1 },
  primaryActionText: { color: '#FFF' },
  tipCard: { flexDirection: 'row', gap: 10, padding: 13, borderRadius: 14, backgroundColor: paleGreen, marginTop: 18, alignItems: 'center' },
  tipCopy: { flex: 1 },
  tipTitle: { color: '#1C5635' },
  tipText: { color: '#5A7868', fontSize: 12, lineHeight: 17 },
  bottomNav: { height: 67, borderTopWidth: 1, borderTopColor: '#DCEDE0', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  navItem: { alignItems: 'center', gap: 2, minWidth: 58 },
  navLabel: { color: '#58776A', fontSize: 10 },
  navLabelActive: { color: green, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  progress: { height: 5, backgroundColor: '#DCEDE0', borderRadius: 3, marginBottom: 22 },
  progressFill: { height: 5, backgroundColor: green, borderRadius: 3 },
  stepBody: { gap: 12, minHeight: 280 },
  fieldLabel: { color: '#315D4A', fontSize: 12, marginBottom: -4 },
  landCard: { borderWidth: 1, borderColor: '#D4E9D9', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF' },
  selectedCard: { borderColor: green, backgroundColor: '#F3FFF5' },
  landImage: { width: 62, height: 62, borderRadius: 9, backgroundColor: '#DCEED7', alignItems: 'center', justifyContent: 'center' },
  landCopy: { flex: 1, gap: 2 },
  productCard: { borderWidth: 1, borderColor: '#D4E9D9', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF' },
  productIcon: { width: 43, height: 43, borderRadius: 9, backgroundColor: '#DCEED7', alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#6E8B7C', fontSize: 12 },
  sector: { backgroundColor: '#DDF5E1', borderRadius: 10, paddingHorizontal: 8, alignSelf: 'flex-start' },
  sectorText: { color: green, fontSize: 10 },
  segment: { flexDirection: 'row', gap: 6 },
  segmentItem: { flex: 1, height: 43, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: green, borderColor: green },
  segmentTextActive: { color: '#FFF' },
  quantityControl: { minHeight: 62, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 11, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  quantityButton: { width: 25, height: 25, borderRadius: 14, backgroundColor: green, alignItems: 'center', justifyContent: 'center' },
  quantityButtonText: { color: '#FFF', fontSize: 20, lineHeight: 22 },
  quantityValue: { color: '#244B39', fontSize: 25, fontWeight: '700' },
  unitRow: { flexDirection: 'row', gap: 8 },
  unitButton: { flex: 1, minHeight: 39, borderRadius: 9, backgroundColor: '#E8F8EA', alignItems: 'center', justifyContent: 'center' },
  unitButtonActive: { backgroundColor: green },
  choiceRow: { minHeight: 42, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12 },
  choiceRowActive: { backgroundColor: green, borderColor: green },
  timeRow: { flexDirection: 'row', gap: 7 },
  timeButton: { flex: 1, minHeight: 42, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, backgroundColor: '#E8F8EA', alignItems: 'center', justifyContent: 'center', gap: 2 },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonCard: { width: '48%', minHeight: 67, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', gap: 3, padding: 5 },
  reasonText: { color: '#315D4A', fontSize: 10, textAlign: 'center' },
  field: { gap: 5 },
  inputWrap: { minHeight: 45, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, color: '#244B39', fontSize: 13, paddingVertical: 10 },
  suffix: { color: '#527568' },
  notice: { backgroundColor: '#E5F9E4', borderRadius: 9, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  noticeText: { color: '#2E6842', fontSize: 12 },
  upload: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#B6DCC1', borderRadius: 9, minHeight: 57, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FAFFFB' },
  reviewCard: { borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 14, marginBottom: 20 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8F2EA' },
  primaryButton: { minHeight: 46, borderRadius: 24, backgroundColor: green, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginTop: 10 },
  primaryButtonText: { color: '#FFF' },
  backLink: { alignSelf: 'center', padding: 12 },
  backLinkText: { color: '#467260' },
  searchWrap: { minHeight: 40, borderWidth: 1, borderColor: '#CFE5D5', borderRadius: 10, backgroundColor: '#FAFFFB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 7, marginBottom: 10 },
  searchInput: { flex: 1, color: '#244B39', fontSize: 13, paddingVertical: 8 },
  chemicalTabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chemicalTab: { flex: 1, minHeight: 36, borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFFFB' },
  chemicalTabActive: { backgroundColor: green, borderColor: green },
  chemicalTabText: { color: '#527568', fontSize: 12 },
  chemicalTabActiveText: { color: '#FFF', fontSize: 12 },
  chemicalCard: { borderWidth: 1, borderColor: '#CFE8D5', borderRadius: 14, backgroundColor: '#F8FFF9', marginBottom: 9, overflow: 'hidden' },
  chemicalCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12 },
  chemicalIcon: { width: 42, height: 42, borderRadius: 22, backgroundColor: '#DDF6E2', alignItems: 'center', justifyContent: 'center' },
  chemicalCopy: { flex: 1, gap: 3 },
  chemicalName: { color: '#164B32' },
  chemicalType: { alignSelf: 'flex-start', color: '#147A2D', backgroundColor: '#BDF4B8', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
  chemicalMeta: { color: '#4B7962', fontSize: 11 },
  chemicalDetails: { minHeight: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4F9E5' },
  chemicalDetailsText: { color: '#2E7950', fontSize: 11 },
  restrictedNotice: { minHeight: 38, borderWidth: 1, borderColor: '#F1A8A3', borderRadius: 9, backgroundColor: '#FFF8F7', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8, marginTop: 0 },
  restrictedNoticeText: { color: '#B34B45', fontSize: 12 },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  historyFilter: { width: '48%', gap: 5 },
  historyFilterLabel: { color: '#527568', fontSize: 12 },
  historyFilterValue: { minHeight: 40, borderWidth: 1, borderColor: '#CFE5D5', borderRadius: 9, backgroundColor: '#FAFFFB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 6 },
  historyFilterText: { color: '#3A6652', flex: 1, fontSize: 12 },
  applicationCard: { borderWidth: 1, borderColor: '#CFE8D5', borderRadius: 14, backgroundColor: '#F8FFF9', padding: 12, marginBottom: 9 },
  applicationTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  applicationIcon: { width: 39, height: 39, borderRadius: 21, backgroundColor: green, alignItems: 'center', justifyContent: 'center' },
  applicationCopy: { flex: 1, gap: 3 },
  applicationTitle: { color: '#164B32' },
  applicationLand: { color: '#5C806E' },
  applicationInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  applicationMeta: { color: '#4B7962', fontSize: 11, marginRight: 7 },
  applicationStatus: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, overflow: 'hidden' },
  verifiedBadge: { color: '#147A2D', backgroundColor: '#BDF4B8' },
  pendingBadge: { color: '#8A6500', backgroundColor: '#FFE68A' },
  applicationActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  historyAction: { flex: 1, minHeight: 32, borderWidth: 1, borderColor: '#BCE6C5', borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4FFF5' },
  historyActionText: { color: '#2E7950', fontSize: 11 },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  successTitle: { color: '#173F25', textAlign: 'center', marginTop: 16 },
  successText: { color: '#597467', textAlign: 'center', marginTop: 8, marginBottom: 26 },
  referenceCard: { width: '100%', borderWidth: 1, borderColor: '#D1E6D7', borderRadius: 11, backgroundColor: '#FFF', padding: 12, marginBottom: 10 },
  referenceText: { color: '#174B32', marginTop: 3 },
  waitingCard: { width: '100%', borderRadius: 11, backgroundColor: '#F0FAD9', padding: 12, flexDirection: 'row', gap: 9, marginBottom: 20 },
  waitingTitle: { color: '#3E5B1B', marginBottom: 2 },
});
