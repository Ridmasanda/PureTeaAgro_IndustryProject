import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000/api';
const AUTH_TOKEN_KEY = '@pureteaagro/auth-token';
const AUTH_USER_KEY = '@pureteaagro/auth-user';

type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  role: 'administrator' | 'farmer' | 'tea-inspector' | 'factory-officer' | 'leaf-collector';
};

type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
};

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

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
    if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
      throw new Error(error.response.data.message);
    }

    throw new Error('Unable to connect to the backend. Check that the API server is running.');
  }
}