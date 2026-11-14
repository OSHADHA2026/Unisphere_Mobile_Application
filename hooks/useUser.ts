import { queryOptions, useQuery } from '@tanstack/react-query';

import { STORAGE_KEYS } from '@/constants/config';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/services/api';
import { AppStorage } from '@/services/storage';

/**
 * Single source of truth for the "current user" query. Both `useUser` and
 * `useProfile` use it, so they always share the same cache entry and fetch
 * logic (previously each hook registered its own function under one key).
 */
export const currentUserQueryOptions = queryOptions({
  queryKey: queryKeys.currentUser,
  queryFn: async () => {
    const token = await AppStorage.getItem(STORAGE_KEYS.userToken);
    if (!token) return null;

    const res = await apiClient.get('/users/me');
    if (res.data.success) return res.data.user;

    await AppStorage.removeItem(STORAGE_KEYS.userToken);
    return null;
  },
  staleTime: 5 * 60 * 1000,
});

export const useUser = () => {
  const { data: user, isLoading, error, refetch } = useQuery(currentUserQueryOptions);

  const getuserById = async (id: string) => {
    try {
      const res = await apiClient.get(`/users/${id}`);
      return res.data.user;
    } catch {
      return null;
    }
  };

  return {
    user: user ?? null,
    userId: user?._id as string | undefined,
    loading: isLoading,
    error: error ? error.message : null,
    refreshUser: refetch,
    getuserById,
  };
};
