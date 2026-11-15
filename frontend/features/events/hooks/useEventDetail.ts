import { useState } from 'react';
import { Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCachedListItem } from '@/lib/cache';
import { queryKeys } from '@/lib/queryKeys';
import { useUser } from '@/hooks/useUser';
import apiClient from '@/services/api';

/**
 * Event detail. Opens instantly with the record the list already downloaded
 * (when available) and refreshes it in the background.
 */
export const useEventDetail = (id: string | string[]) => {
  const eventId = Array.isArray(id) ? id[0] : id;
  const queryClient = useQueryClient();
  const { userId } = useUser();

  const [registeredLocally, setRegisteredLocally] = useState(false);
  const [registering, setRegistering] = useState(false);

  const { data: event, isLoading, refetch } = useQuery({
    queryKey: queryKeys.event(eventId),
    enabled: !!eventId,
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${eventId}`);
      return data.success ? data.event : null;
    },
    initialData: () => {
      const match = (e: any) => e.id === eventId;
      return (
        getCachedListItem(queryClient, queryKeys.events('all'), match)?.raw ??
        getCachedListItem(queryClient, queryKeys.events('registrations'), match)?.raw
      );
    },
    // The list copy is shown immediately but treated as stale, so a fresh one is fetched.
    initialDataUpdatedAt: 0,
    staleTime: 30 * 1000,
  });

  const isRegistered = registeredLocally || (!!userId && (event?.registrants || []).includes(userId));

  const register = async () => {
    try {
      setRegistering(true);
      const res = await apiClient.post(`/events/${eventId}/register`);
      if (res.data.success) {
        setRegisteredLocally(true);
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
        return true;
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Could not register for event');
      return false;
    } finally {
      setRegistering(false);
    }
    return false;
  };

  return {
    event: event ?? null,
    loading: isLoading,
    isRegistered,
    registering,
    register,
    refreshDetail: refetch,
  };
};
