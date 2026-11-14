import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { elevation, radius } from '@/constants/theme';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Standard surface: white card, hairline border, soft shadow. */
export default function Card({ children, onPress, padded = true, style }: CardProps) {
  const { colors, isDark } = useTheme();

  const base: ViewStyle = {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: padded ? 16 : 0,
    overflow: 'hidden',
    ...elevation(1, isDark),
  };

  if (!onPress) return <View style={[base, style]}>{children}</View>;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.92 }, style]}>
      {children}
    </Pressable>
  );
}
