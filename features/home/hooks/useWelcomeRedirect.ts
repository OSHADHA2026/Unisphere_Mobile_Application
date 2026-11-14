import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { STORAGE_KEYS } from '@/constants/config';
import { AppStorage } from '@/services/storage';

import { WELCOME_DURATION_MS } from '../constants';

/**
 * First-launch flow for signed-out visitors: show the welcome screen once,
 * then send them to the login screen.
 */
export const useWelcomeRedirect = () => {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const checkUser = async () => {
      const token = await AppStorage.getItem(STORAGE_KEYS.userToken);
      const hasSeenWelcome = await AppStorage.getItem(STORAGE_KEYS.hasSeenWelcome);

      if (!token && !hasSeenWelcome) {
        setShowWelcome(true);
        await AppStorage.setItem(STORAGE_KEYS.hasSeenWelcome, 'true');

        timer = setTimeout(() => {
          setShowWelcome(false);
          router.replace('/login');
        }, WELCOME_DURATION_MS);
      }
    };

    checkUser();

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showWelcome;
};
