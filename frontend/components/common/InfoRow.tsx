import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type InfoRowProps = {
  icon: LucideIcon;
  label?: string;
  value: string;
};

/** Icon + (optional label) + value, for facts like date, place, price. */
export default function InfoRow({ icon: IconComponent, label, value }: InfoRowProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        {label ? (
          <AppText variant="caption" tone="muted">
            {label}
          </AppText>
        ) : null}
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
    </View>
  );
}
