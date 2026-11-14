import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import apiClient from '@/services/api';
import { AppStorage } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants/config';
import { queryKeys } from '@/lib/queryKeys';
import { currentUserQueryOptions } from '@/hooks/useUser';

export const useProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isUpdating, setIsUpdating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const { data: user, isLoading, refetch } = useQuery(currentUserQueryOptions);

  const logout = async () => {
    await AppStorage.removeItem(STORAGE_KEYS.userToken);
    await AppStorage.removeItem(STORAGE_KEYS.hasSeenWelcome);
    queryClient.removeQueries({ queryKey: queryKeys.currentUser });
    router.replace('/login');
  };

  const updateProfile = async (formData: any, imageAsset?: any, shouldNavigateBack: boolean = true) => {
    if (formData.password && ((formData.password.length > 0 && formData.password.length < 6) || formData.password !== formData.confirmPassword)) {
      setErrorMessage("Passwords do not match or are too short.");
      return false;
    }

    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('year', formData.year);
      data.append('major', formData.major);
      if (formData.password) data.append('password', formData.password);

      if (imageAsset) {
        data.append('image', {
          uri: imageAsset.uri,
          name: imageAsset.fileName || `profile-${Date.now()}.jpg`,
          type: imageAsset.mimeType || 'image/jpeg'
        } as any);
      }

      const response = await apiClient.put('/users/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        // Update the shared cache immediately with the new user data
        queryClient.setQueryData(queryKeys.currentUser, response.data.user);

        if (shouldNavigateBack) {
          if (Platform.OS !== 'web') {
            Alert.alert("Success", "Profile updated successfully!", [{ text: "OK", onPress: () => router.back() }]);
          } else {
            setTimeout(() => router.back(), 1500);
          }
        }
        return true;
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Update failed. Check your network.");
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  const deleteProfileImage = async () => {
    setIsUpdating(true);
    try {
      const response = await apiClient.delete('/users/profile-image');
      if (response.data.success) {
        queryClient.setQueryData(queryKeys.currentUser, response.data.user);
        setSuccessMessage("Profile image removed.");
        return true;
      }
    } catch (error: any) {
      setErrorMessage("Failed to remove image.");
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  const deleteAccount = async () => {
    try {
      const res = await apiClient.delete('/users');
      if (res.data.success) {
        await AppStorage.removeItem(STORAGE_KEYS.userToken);
        queryClient.removeQueries({ queryKey: queryKeys.currentUser });
        router.replace('/login');
        return true;
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Could not delete account.");
    }
    return false;
  };

  return {
    user: user ?? null,
    loading: isLoading,
    isUpdating,
    errorMessage,
    successMessage,
    logout,
    updateProfile,
    deleteProfileImage,
    deleteAccount,
    refreshProfile: refetch,
  };
};
