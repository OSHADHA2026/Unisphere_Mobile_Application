import React from 'react';
import { View } from 'react-native';
import { CheckCircle2, type LucideIcon } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import { useTheme } from '@/context/ThemeContext';

import ModalShell from './ModalShell';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  icon?: LucideIcon;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Neutral (non-destructive) confirmation dialog. */
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  icon: IconComponent = CheckCircle2,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const { colors } = useTheme();

  return (
    <ModalShell visible={visible} onClose={onCancel}>
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
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" center style={{ marginBottom: 24 }}>
        {message}
      </AppText>
      <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
        <Button title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
      </View>
    </ModalShell>
  );
}
