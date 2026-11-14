import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/common/AppText';
import { useTheme } from '@/context/ThemeContext';

export type ActionSheetAction = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  destructive?: boolean;
};

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
};

/** Bottom sheet listing a few actions (Edit, Delete...). Replaces ad-hoc popup menus. */
export default function ActionSheet({ visible, onClose, title, actions }: ActionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          }}
        >
          <View
            style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderLight, marginBottom: 16 }}
          />
          {title ? (
            <AppText variant="heading" style={{ marginBottom: 8 }}>
              {title}
            </AppText>
          ) : null}

          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={() => {
                onClose();
                action.onPress();
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingVertical: 14,
                paddingHorizontal: 4,
                borderRadius: 12,
                backgroundColor: pressed ? colors.bgInput : 'transparent',
              })}
            >
              <action.icon size={20} color={action.destructive ? colors.danger : colors.primary} />
              <AppText variant="subheading" tone={action.destructive ? 'danger' : 'default'}>
                {action.label}
              </AppText>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
