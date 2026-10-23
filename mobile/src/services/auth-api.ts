import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000/api';
const AUTH_TOKEN_KEY = '@pureteaagro/auth-token';
const AUTH_USER_KEY = '@pureteaagro/auth-user';

export type AuthRole =
  | 'administrator'
  | 'farmer'
  | 'tea-inspector'
  | 'factory-officer'
  | 'leaf-collector';

export type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  role: AuthRole;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role: AuthRole;
  nic?: string;
  mobile?: string;
  address?: string;
  organization?: string;
  district?: string;
  designation?: string;
  inspectorId?: string;
  employeeId?: string;
  factory?: string;
};

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

function getApiErrorMessage(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return new Error(error.response.data.message);
  }

  return new Error(fallback);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, response.data.token],
      [AUTH_USER_KEY, JSON.stringify(response.data.user)],
    ]);

    return response.data;
  } catch (error) {
    throw getApiErrorMessage(
      error,
      'Unable to connect to the backend. Check that the API server is running.',
    );
  }
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  try {
    const response = await client.post<AuthResponse>('/auth/register', input);

    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, response.data.token],
      [AUTH_USER_KEY, JSON.stringify(response.data.user)],
    ]);

    return response.data;
  } catch (error) {
    throw getApiErrorMessage(
      error,
      'Unable to connect to the backend. Check that the API server is running.',
    );
  }
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const user = await AsyncStorage.getItem(AUTH_USER_KEY);
  return user ? (JSON.parse(user) as AuthUser) : null;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
}

export { client as authClient };