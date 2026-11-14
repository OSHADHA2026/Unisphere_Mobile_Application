import React from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

type ModalShellProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/** Dimmed, tap-to-dismiss backdrop with a centered card. */
export default function ModalShell({ visible, onClose, children }: ModalShellProps) {
  const { colors } = useTheme();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: '100%',
            maxWidth: 380,
            backgroundColor: colors.white,
            borderRadius: 28,
            padding: 24,
            alignItems: 'center',
          }}
        >
          <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
