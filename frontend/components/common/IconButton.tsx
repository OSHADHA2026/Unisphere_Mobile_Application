import React from 'react';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/constants/theme';

type IconButtonProps = {
  icon: LucideIcon;
  onPress?: () => void;
  label: string;
  size?: number;
  filled?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** Round, 44pt touch target icon button (back, menu, close...). */
export default function IconButton({
  icon: IconComponent,
  onPress,
  label,
  size = 22,
  filled = true,
  color,
  style,
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.7}
      onPress={onPress}
      hitSlop={6}
      style={[
        {
          width: layout.minTouch,
          height: layout.minTouch,
          borderRadius: layout.minTouch / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: filled ? colors.bgInput : 'transparent',
        },
        style,
      ]}
    >
      <IconComponent size={size} color={color ?? colors.text} />
    </TouchableOpacity>
  );
}
