import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { UserCheck, type LucideIcon } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import { useTheme } from '@/context/ThemeContext';

import ModalShell from './ModalShell';

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Explains why signing in is needed for the action the user attempted. */
  message: string;
  icon?: LucideIcon;
};

export default function LoginRequiredModal({
  visible,
  onClose,
  message,
  icon: IconComponent = UserCheck,
}: LoginRequiredModalProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <IconComponent size={34} color={colors.primary} />
      </View>

      <AppText variant="title" center style={{ marginBottom: 8 }}>
        Login Required
      </AppText>
      <AppText variant="body" tone="secondary" center style={{ marginBottom: 24 }}>
        {message}
      </AppText>

      <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
        <Button title="Cancel" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
        <Button
          title="Sign In"
          onPress={() => {
            onClose();
            router.push('/login');
          }}
          style={{ flex: 1 }}
        />
      </View>
    </ModalShell>
  );
}
