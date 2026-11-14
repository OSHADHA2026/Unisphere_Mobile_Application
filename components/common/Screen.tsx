import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

type ScreenProps = {
  children: React.ReactNode;
  /** Rendered above the content (AppHeader or ScreenHeader). */
  header?: React.ReactNode;
  /** Show the bottom tab bar. */
  tabBar?: boolean;
  /** Floating action button, placed inside the content area. */
  fab?: React.ReactNode;
  /** Sticky bottom action bar, placed below the content area. */
  bottomBar?: React.ReactNode;
};

/**
 * Standard page shell. Layout is a simple column:
 *   header → content (flex) → bottom bar → tab bar
 * Because nothing is absolutely positioned over the content, pages cannot
 * overlap the header, the tab bar or the device safe areas.
 */
export default function Screen({ children, header, tabBar = false, fab, bottomBar }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={tabBar ? ['top'] : ['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      {header}
      <View style={{ flex: 1 }}>
        {children}
        {fab}
      </View>
      {bottomBar}
      {tabBar ? <Footer /> : null}
    </SafeAreaView>
  );
}
