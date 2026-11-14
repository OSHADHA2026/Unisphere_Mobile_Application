/**
 * Central registry of React Query keys so that queries and invalidations
 * can never drift apart because of a typo in a string literal.
 */
export const queryKeys = {
  currentUser: ['currentUser'] as const,
  events: (type: 'all' | 'mine' | 'registrations' = 'all') => ['events', type] as const,
  housings: ['housings'] as const,
  marketplace: ['marketplace'] as const,
  studyGroups: ['studyGroups'] as const,
  tutors: ['tutors'] as const,
  lostItems: ['lostItems'] as const,
  lostItem: (id: string) => ['lostItem', id] as const,
};
