import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Plus, type LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { elevation, layout } from '@/constants/theme';

type FABProps = {
  onPress: () => void;
  label: string;
  icon?: LucideIcon;
};

/**
 * Floating action button. Render it as the `fab` prop of <Screen>, which
 * places it inside the content area (above the tab bar), so it can never
 * overlap the navigation.
 */
export default function FAB({ onPress, label, icon: IconComponent = Plus }: FABProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.88}
      onPress={onPress}
      style={{
        position: 'absolute',
        right: layout.screenPadding,
        bottom: layout.screenPadding,
        width: layout.fabSize,
        height: layout.fabSize,
        borderRadius: layout.fabSize / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...elevation(3, isDark),
      }}
    >
      <IconComponent size={26} color={colors.onPrimary} />
    </TouchableOpacity>
  );
}
