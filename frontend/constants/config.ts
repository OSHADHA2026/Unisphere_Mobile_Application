/**
 * Central place for runtime configuration read from environment variables.
 * Only `EXPO_PUBLIC_*` variables are inlined into the client bundle by Expo.
 */
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL: string = apiUrl?.trim() ?? '';
export const API_TIMEOUT_MS = 10_000;

export const STORAGE_KEYS = {
  userToken: 'userToken',
  hasSeenWelcome: 'hasSeenWelcome',
  lastUpdateCheck: 'lastUpdateCheck',
  theme: 'unisphere_theme',
} as const;
