import { Alert } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';

import { STORAGE_KEYS } from '@/constants/config';

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const currentVersion = Constants.expoConfig?.version;

const isMoreThan24HoursAgo = (timestamp: string): boolean =>
  Date.now() - Number(timestamp) > CHECK_INTERVAL_MS;

/**
 * Checks for an over-the-air update (at most once per 24h unless
 * `showNoUpdateMessage` is true, i.e. the user asked explicitly).
 */
export async function checkForAppUpdates(showNoUpdateMessage = false): Promise<void> {
  try {
    const lastCheck = await SecureStore.getItemAsync(STORAGE_KEYS.lastUpdateCheck);

    if (!showNoUpdateMessage && lastCheck && !isMoreThan24HoursAgo(lastCheck)) {
      return;
    }

    await SecureStore.setItemAsync(STORAGE_KEYS.lastUpdateCheck, Date.now().toString());

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert('Update Available', `Current Version: ${currentVersion}`, [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Download Now',
          onPress: async () => {
            await Updates.fetchUpdateAsync();

            Alert.alert('Update Ready', 'Restart app to apply update.', [
              { text: 'Restart Now', onPress: () => Updates.reloadAsync() },
            ]);
          },
        },
      ]);
    } else if (showNoUpdateMessage) {
      Alert.alert('No Updates Available', `You are using the latest version (${currentVersion}).`);
    }
  } catch (e) {
    console.log('Update check failed:', e);
  }
}
