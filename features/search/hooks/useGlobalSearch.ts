import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import apiClient from '@/services/api';

export type GlobalSearchItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  route: string;
};

const MAX_RESULTS = 20;

/** The backend wraps lists differently per endpoint; normalise them to an array. */
const toArray = (res: any): any[] => {
  const data = res?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.housings)) return data.housings;
  if (Array.isArray(data?.tutors)) return data.tutors;
  if (Array.isArray(data?.groups)) return data.groups;

  return [];
};

const settled = (result: PromiseSettledResult<any>): any[] =>
  result.status === 'fulfilled' ? toArray(result.value) : [];

const fetchSearchIndex = async (): Promise<GlobalSearchItem[]> => {
  const results = await Promise.allSettled([
    apiClient.get('/events'),
    apiClient.get('/api/marketplace'),
    apiClient.get('/lost'),
    apiClient.get('/housing'),
    apiClient.get('/tutors'),
    apiClient.get('/studyGroups'),
  ]);

  const [events, marketplace, lost, housing, tutors, studyGroups] = results.map(settled);
  const idOf = (item: any): string => item._id || item.id;

  const items: GlobalSearchItem[] = [
    ...events.map((item) => ({
      id: idOf(item),
      type: 'Event',
      title: item.title || 'Untitled Event',
      subtitle: item.location || '',
      route: `/events/${idOf(item)}`,
    })),
    ...marketplace.map((item) => ({
      id: idOf(item),
      type: 'Marketplace',
      title: item.title || 'Untitled Item',
      subtitle: item.location || item.condition || '',
      route: `/marketplace/${idOf(item)}`,
    })),
    ...lost.map((item) => ({
      id: idOf(item),
      type: 'Lost Item',
      title: item.title || 'Untitled Lost Item',
      subtitle: item.location || item.category || '',
      route: `/lost/${idOf(item)}`,
    })),
    ...housing.map((item) => ({
      id: idOf(item),
      type: 'Housing',
      title: item.title || 'Untitled Housing',
      subtitle: item.address || item.roomType || '',
      route: `/housing/${idOf(item)}`,
    })),
    ...tutors.map((item) => ({
      id: idOf(item),
      type: 'Tutor',
      title: item.name || 'Unnamed Tutor',
      subtitle: item.subject || '',
      route: `/tutors/${idOf(item)}`,
    })),
    ...studyGroups.map((item) => ({
      id: idOf(item),
      type: 'Study Group',
      title: item.subject || 'Untitled Study Group',
      subtitle: item.location || item.tag || '',
      route: `/studyGroup/${idOf(item)}`,
    })),
  ];

  return items.filter((item) => item.id);
};

/**
 * Search across every section of the app. The index is only downloaded once
 * the user starts typing, then cached for a few minutes.
 */
export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const searchText = query.trim().toLowerCase();
  const isActive = searchText.length > 0;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['globalSearch'],
    queryFn: fetchSearchIndex,
    enabled: isActive,
    staleTime: 5 * 60 * 1000,
  });

  const results = useMemo(() => {
    if (!isActive) return [];

    return items
      .filter((item) => `${item.type} ${item.title} ${item.subtitle || ''}`.toLowerCase().includes(searchText))
      .slice(0, MAX_RESULTS);
  }, [items, isActive, searchText]);

  return { query, setQuery, isActive, loading: isLoading, results };
};
