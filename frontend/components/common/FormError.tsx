import React from 'react';
import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type FormErrorProps = {
  message?: string | null;
  tone?: 'error' | 'success';
};

/** Banner for form-level errors / success messages. */
export default function FormError({ message, tone = 'error' }: FormErrorProps) {
  const { colors } = useTheme();
  if (!message) return null;

  const fg = tone === 'error' ? colors.danger : colors.success;
  const bg = tone === 'error' ? colors.dangerLight : colors.successLight;

  return (
    <View
      accessibilityRole="alert"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, backgroundColor: bg }}
    >
      <AlertCircle size={18} color={fg} />
      <AppText variant="bodyStrong" style={{ color: fg, flex: 1, fontSize: 14 }}>
        {message}
      </AppText>
    </View>
  );
}
