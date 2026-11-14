import React from 'react';
import { View } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import { useTheme } from '@/context/ThemeContext';

import ModalShell from './ModalShell';

type ConfirmDeleteModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ visible, title, message, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  const { colors } = useTheme();

  return (
    <ModalShell visible={visible} onClose={onCancel}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.dangerLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Trash2 size={32} color={colors.danger} />
      </View>

      <AppText variant="title" center style={{ marginBottom: 8 }}>
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" center style={{ marginBottom: 24 }}>
        {message}
      </AppText>

      <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Delete" variant="danger" onPress={onConfirm} style={{ flex: 1 }} />
      </View>
    </ModalShell>
  );
}
