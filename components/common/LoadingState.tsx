import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

/** Centered spinner that fills its parent. */
export default function LoadingState() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
