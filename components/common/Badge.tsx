import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type BadgeProps = {
  label: string;
  tone?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
};

export default function Badge({ label, tone = 'primary' }: BadgeProps) {
  const { colors } = useTheme();

  const palette = {
    primary: { bg: colors.primaryLight, fg: colors.primary },
    success: { bg: colors.successLight, fg: colors.success },
    danger: { bg: colors.dangerLight, fg: colors.danger },
    warning: { bg: colors.warningLight, fg: colors.warning },
    neutral: { bg: colors.bgInput, fg: colors.textSecondary },
  }[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: palette.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
      }}
    >
      <AppText variant="overline" style={{ color: palette.fg }}>
        {label}
      </AppText>
    </View>
  );
}
