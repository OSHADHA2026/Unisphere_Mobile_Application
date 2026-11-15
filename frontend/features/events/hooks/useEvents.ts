import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { currentUserQueryOptions } from '@/hooks/useUser';
import { queryKeys } from '@/lib/queryKeys';

export interface Event {
  id: string;
  title: string;
  month: string;
  day: string;
  location: string;
  organizer: string;
  isMine: boolean;
  image?: string;
  /** Full record from the API, used to open the detail page instantly. */
  raw?: any;
}

const formatEvent = (ev: any, currentUserId?: string): Event => ({
  id: ev._id,
  title: ev.title,
  month: new Date(ev.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  day: new Date(ev.startDate).getDate().toString(),
  location: ev.location,
  organizer: ev.organizerName || 'Campus Event',
  isMine: currentUserId ? ev.organizer === currentUserId : false,
  image: ev.image,
  raw: ev,
});

const fetchEvents = async (type: 'all' | 'mine' | 'registrations', queryClient: QueryClient) => {
  // The signed-in user is cached, so this does not add a request every time.
  const [user, eventsRes] = await Promise.all([
    queryClient.fetchQuery(currentUserQueryOptions).catch(() => null),
    apiClient.get(type === 'registrations' ? '/events/me/registrations' : '/events'),
  ]);

  const currentUserId = user?._id;
  const fetchedEvents = eventsRes.data.events || [];

  let processed: Event[] = fetchedEvents.map((ev: any) =>
    formatEvent(ev, currentUserId)
  );

  if (type === 'mine') {
    processed = processed.filter((ev) => ev.isMine);
  }

  return processed;
};

export const useEvents = (type: 'all' | 'mine' | 'registrations' = 'all') => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.events(type),
    queryFn: () => fetchEvents(type, queryClient),
  });

  return {
    events: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshEvents: refetch,
  };
};
