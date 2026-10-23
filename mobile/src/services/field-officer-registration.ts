import AsyncStorage from '@react-native-async-storage/async-storage';

const FIELD_OFFICER_DRAFT_KEY = '@pureteaagro/field-officer-registration-draft';

export type FieldOfficerRegistrationDraft = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  address: string;
  employeeId: string;
  organization: string;
  district: string;
  designation: string;
  password: string;
};

export async function saveFieldOfficerDraft(
  draft: FieldOfficerRegistrationDraft,
): Promise<void> {
  await AsyncStorage.setItem(FIELD_OFFICER_DRAFT_KEY, JSON.stringify(draft));
}

export async function getFieldOfficerDraft(): Promise<FieldOfficerRegistrationDraft | null> {
  const value = await AsyncStorage.getItem(FIELD_OFFICER_DRAFT_KEY);
  return value ? (JSON.parse(value) as FieldOfficerRegistrationDraft) : null;
}

export async function clearFieldOfficerDraft(): Promise<void> {
  await AsyncStorage.removeItem(FIELD_OFFICER_DRAFT_KEY);
}
