import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/constants/theme';

type ActionBarProps = {
  children: React.ReactNode;
};

/**
 * Sticky bottom bar for primary actions (Save, Register, Contact...).
 * It sits in the layout flow below the scroll area, so it never covers content.
 */
export default function ActionBar({ children }: ActionBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.navBg,
        borderTopWidth: 1,
        borderTopColor: colors.navBorder,
        paddingHorizontal: layout.screenPadding,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 10,
      }}
    >
      {children}
    </View>
  );
}
