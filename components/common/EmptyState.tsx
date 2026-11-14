import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';
import Button from './Button';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon: IconComponent, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <IconComponent size={40} color={colors.primary} />
      </View>
      <AppText variant="heading" center style={{ marginBottom: 6 }}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" tone="secondary" center>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: 20, alignSelf: 'stretch', paddingHorizontal: 24 }}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
