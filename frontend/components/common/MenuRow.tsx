import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type MenuRowProps = {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Custom control on the right (e.g. a Switch). Replaces the chevron. */
  right?: React.ReactNode;
  destructive?: boolean;
};

/** Settings-style row: icon tile, label, optional value, chevron. */
export default function MenuRow({ icon: IconComponent, label, value, onPress, right, destructive }: MenuRowProps) {
  const { colors } = useTheme();
  const tint = destructive ? colors.danger : colors.primary;

  return (
    <TouchableOpacity
      accessibilityRole={onPress ? 'button' : undefined}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: destructive ? colors.dangerLight : colors.primaryLight,
        }}
      >
        <IconComponent size={20} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" tone={destructive ? 'danger' : 'default'}>
          {label}
        </AppText>
        {value ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {value}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress && !destructive ? <ChevronRight size={20} color={colors.textMuted} /> : null)}
    </TouchableOpacity>
  );
}
