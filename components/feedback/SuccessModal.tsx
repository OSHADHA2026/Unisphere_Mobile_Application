import React from 'react';
import { View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import { useTheme } from '@/context/ThemeContext';

import ModalShell from './ModalShell';

type SuccessModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  actionLabel: string;
  onClose: () => void;
};

export default function SuccessModal({ visible, title = 'Success!', message, actionLabel, onClose }: SuccessModalProps) {
  const { colors } = useTheme();

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.successLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <CheckCircle2 size={42} color={colors.success} strokeWidth={2.4} />
      </View>
      <AppText variant="title" center style={{ marginBottom: 8 }}>
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" center style={{ marginBottom: 24 }}>
        {message}
      </AppText>
      <Button title={actionLabel} onPress={onClose} size="lg" />
    </ModalShell>
  );
}
