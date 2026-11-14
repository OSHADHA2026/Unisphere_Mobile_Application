import React from 'react';
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/constants/theme';

import AppText from './AppText';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'dangerSoft' | 'ghost';
  size?: 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: IconComponent,
  loading,
  disabled,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const inactive = disabled || loading;

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.bgInput, fg: colors.text, border: colors.bgInput },
    danger: { bg: colors.danger, fg: '#FFFFFF', border: colors.danger },
    dangerSoft: { bg: colors.dangerLight, fg: colors.danger, border: colors.dangerLight },
    ghost: { bg: 'transparent', fg: colors.primary, border: colors.borderLight },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={inactive ? undefined : onPress}
      style={({ pressed }) => [
        {
          height: size === 'lg' ? 54 : 48,
          borderRadius: radius.md,
          paddingHorizontal: 20,
          backgroundColor: palette.bg,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: palette.border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: inactive ? 0.55 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {IconComponent ? <IconComponent size={18} color={palette.fg} /> : null}
          <AppText variant="bodyStrong" style={{ color: palette.fg }}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}
