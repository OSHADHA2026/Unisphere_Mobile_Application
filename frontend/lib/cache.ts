import type { QueryClient } from '@tanstack/react-query';

/**
 * Finds an item inside a list that is already in the React Query cache.
 *
 * Detail pages use it to open instantly with the data the list already
 * downloaded, while the fresh copy loads in the background.
 */
export const getCachedListItem = <T = any>(
  queryClient: QueryClient,
  listKey: readonly unknown[],
  match: (item: any) => boolean,
): T | undefined => {
  const list = queryClient.getQueryData<any[]>(listKey);
  return Array.isArray(list) ? list.find(match) : undefined;
};
