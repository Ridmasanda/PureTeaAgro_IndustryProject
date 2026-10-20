import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const TEA_INSPECTOR_STORAGE_KEY = '@pureteaagro/tea-inspector-accounts';
const FACTORY_OFFICER_STORAGE_KEY = '@pureteaagro/factory-officer-accounts';

export type TeaInspectorDetails = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  address: string;
  organization: string;
  district: string;
  designation: string;
};

export type TeaInspectorAccount = TeaInspectorDetails & {
  inspectorId: string;
  passwordSalt: string;
  passwordHash: string;
};

export type FactoryOfficerDetails = {
  fullName: string;
  nic: string;
  mobile: string;
  email: string;
  address: string;
  employeeId: string;
  organization: string;
  factory: string;
  designation: string;
};

export type FactoryOfficerAccount = FactoryOfficerDetails & {
  passwordSalt: string;
  passwordHash: string;
};

export type AuthenticatedAccount =
  | { role: 'tea-inspector'; account: TeaInspectorAccount }
  | { role: 'factory-officer'; account: FactoryOfficerAccount };

export type RegistrationResult<T> = {
  account: T;
  generatedPassword?: string;
};

function isAccount(value: unknown, requiredFields: string[]): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const account = value as Record<string, unknown>;
  return requiredFields.every((field) => typeof account[field] === 'string');
}

const inspectorFields = [
  'fullName',
  'nic',
  'mobile',
  'email',
  'address',
  'organization',
  'district',
  'designation',
  'inspectorId',
  'passwordSalt',
  'passwordHash',
];
const factoryOfficerFields = [
  'fullName',
  'nic',
  'mobile',
  'email',
  'address',
  'employeeId',
  'organization',
  'factory',
  'designation',
  'passwordSalt',
  'passwordHash',
];

async function readAccounts<T>(
  storageKey: string,
  isStoredAccount: (value: unknown) => value is T,
): Promise<T[]> {
  const storedAccounts = await AsyncStorage.getItem(storageKey);
  if (storedAccounts === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(storedAccounts);
  if (!Array.isArray(parsed) || !parsed.every(isStoredAccount)) {
    throw new Error('Saved account data could not be read.');
  }

  return parsed;
}

async function readTeaInspectors(): Promise<TeaInspectorAccount[]> {
  return readAccounts(
    TEA_INSPECTOR_STORAGE_KEY,
    (value): value is TeaInspectorAccount => isAccount(value, inspectorFields),
  );
}

async function readFactoryOfficers(): Promise<FactoryOfficerAccount[]> {
  return readAccounts(
    FACTORY_OFFICER_STORAGE_KEY,
    (value): value is FactoryOfficerAccount => isAccount(value, factoryOfficerFields),
  );
}

async function hashPassword(salt: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

export async function registerTeaInspector(
  details: TeaInspectorDetails,
  password: string,
): Promise<RegistrationResult<TeaInspectorAccount>> {
  const accounts = await readTeaInspectors();
  const nic = details.nic.trim().toUpperCase();

  if (nic && accounts.some((account) => account.nic === nic)) {
    throw new Error('An account with this NIC number is already registered.');
  }

  const lastInspectorNumber = accounts.reduce((highest, account) => {
    const match = /^TI-(\d+)$/.exec(account.inspectorId);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 20);
  const inspectorId = `TI-${String(lastInspectorNumber + 1).padStart(4, '0')}`;
  const accountPassword = password || Crypto.randomUUID();
  const generatedPassword = password ? undefined : accountPassword;
  const passwordSalt = Crypto.randomUUID();
  const account: TeaInspectorAccount = {
    ...details,
    nic,
    inspectorId,
    passwordSalt,
    passwordHash: await hashPassword(passwordSalt, accountPassword),
  };

  await AsyncStorage.setItem(TEA_INSPECTOR_STORAGE_KEY, JSON.stringify([...accounts, account]));
  return { account, generatedPassword };
}

export async function registerFactoryOfficer(
  details: FactoryOfficerDetails,
  password: string,
): Promise<RegistrationResult<FactoryOfficerAccount>> {
  const accounts = await readFactoryOfficers();
  const enteredEmployeeId = details.employeeId.trim().toUpperCase();

  if (enteredEmployeeId && accounts.some((account) => account.employeeId.toUpperCase() === enteredEmployeeId)) {
    throw new Error('An account with this Employee ID is already registered.');
  }

  const lastFactoryNumber = accounts.reduce((highest, account) => {
    const match = /^FO-(\d+)$/.exec(account.employeeId.toUpperCase());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const employeeId = enteredEmployeeId || `FO-${String(lastFactoryNumber + 1).padStart(5, '0')}`;
  const accountPassword = password || Crypto.randomUUID();
  const generatedPassword = password ? undefined : accountPassword;
  const passwordSalt = Crypto.randomUUID();
  const account: FactoryOfficerAccount = {
    ...details,
    employeeId,
    passwordSalt,
    passwordHash: await hashPassword(passwordSalt, accountPassword),
  };

  await AsyncStorage.setItem(FACTORY_OFFICER_STORAGE_KEY, JSON.stringify([...accounts, account]));
  return { account, generatedPassword };
}

export async function authenticateAccount(
  registeredId: string,
  password: string,
  role: AuthenticatedAccount['role'],
): Promise<AuthenticatedAccount | null> {
  const normalizedId = registeredId.trim().toUpperCase();
  const [inspectors, factoryOfficers] = await Promise.all([
    readTeaInspectors(),
    readFactoryOfficers(),
  ]);
  const matches: AuthenticatedAccount[] = [];

  if (role === 'tea-inspector') {
    for (const account of inspectors) {
      if (
        (account.inspectorId.toUpperCase() === normalizedId || account.nic === normalizedId) &&
        (await hashPassword(account.passwordSalt, password)) === account.passwordHash
      ) {
        matches.push({ role: 'tea-inspector', account });
      }
    }
  } else {
    for (const account of factoryOfficers) {
      if (
        account.employeeId.toUpperCase() === normalizedId &&
        (await hashPassword(account.passwordSalt, password)) === account.passwordHash
      ) {
        matches.push({ role: 'factory-officer', account });
      }
    }
  }

  if (matches.length > 1) {
    throw new Error('These credentials match more than one account. Contact support.');
  }

  return matches[0] ?? null;
}
