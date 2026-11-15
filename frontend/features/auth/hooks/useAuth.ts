import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import apiClient from '@/services/api';
import { AppStorage } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants/config';
import { queryKeys } from '@/lib/queryKeys';

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage;
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The server took too long to respond. Please try again.';
    }

    if (error.code === 'ERR_NETWORK') {
      return 'This APK could not reach the API. Check its EAS Preview API URL and HTTPS connection.';
    }
  }

  if (
    error instanceof Error &&
    error.message === 'EXPO_PUBLIC_API_URL is not configured for this build.'
  ) {
    return 'This APK was built without EXPO_PUBLIC_API_URL. Set it in the EAS Preview environment and rebuild.';
  }

  if (error instanceof Error && /secure.?store/i.test(error.message)) {
    return 'The app could not access secure storage before contacting the API.';
  }

  return fallback;
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    if (!email.includes('@')) {
      setErrorMessage("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return false;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        await AppStorage.setItem(STORAGE_KEYS.userToken, response.data.token);
        // The cached "no user" result must not survive a successful login.
        await queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
        router.replace('/');
        return true;
      }
    } catch (error: unknown) {
      setErrorMessage(getRequestErrorMessage(error, 'Sign-in failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const signup = async (formData: any) => {
    if (!formData.email.includes('@') || formData.password.length < 6 || formData.password !== formData.confirmPassword) {
      setErrorMessage("Invalid registration details. Please check your inputs.");
      return false;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/signup', formData);
      if (response.status === 201) {
        router.replace('/login');
        return true;
      }
    } catch (error: unknown) {
      setErrorMessage(getRequestErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return { login, signup, isLoading, errorMessage, setErrorMessage };
};
