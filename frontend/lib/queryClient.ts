import { QueryClient } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type ListName = 'events' | 'housings' | 'marketplace' | 'studyGroups' | 'tutors' | 'lostItems';

const listKeys: Record<ListName, readonly unknown[]> = {
  events: ['events'],
  housings: queryKeys.housings,
  marketplace: queryKeys.marketplace,
  studyGroups: queryKeys.studyGroups,
  tutors: queryKeys.tutors,
  lostItems: queryKeys.lostItems,
};

/**
 * Call after creating, editing or deleting something so the list the user
 * returns to shows the change (lists are otherwise cached for 5 minutes).
 */
export const refreshList = (list: ListName) => {
  queryClient.invalidateQueries({ queryKey: listKeys[list] });
  // Also drop the global-search index, which includes every list.
  queryClient.invalidateQueries({ queryKey: ['globalSearch'] });
};
