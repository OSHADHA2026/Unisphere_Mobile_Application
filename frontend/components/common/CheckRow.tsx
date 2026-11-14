import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type CheckRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/** Large, easy-to-tap checkbox row. */
export default function CheckRow({ label, value, onChange }: CheckRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 52,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: value ? colors.primary : colors.border,
        backgroundColor: value ? colors.primaryLight : colors.white,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value ? colors.primary : colors.bgInput,
        }}
      >
        {value ? <Check size={16} color={colors.onPrimary} strokeWidth={3} /> : null}
      </View>
      <AppText variant="bodyStrong">{label}</AppText>
    </Pressable>
  );
}
