import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { AlertCircle, Camera } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/constants/theme';

import AppText from './AppText';

type PhotoPickerProps = {
  label?: string;
  uri?: string | null;
  onPress: () => void;
  error?: string | null;
  height?: number;
  hint?: string;
};

/** Tap-to-add photo box with preview and a "Change" hint once filled. */
export default function PhotoPicker({ label, uri, onPress, error, height = 200, hint = 'Add a photo' }: PhotoPickerProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <AppText variant="bodyStrong" style={{ fontSize: 14 }}>
          {label}
        </AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={uri ? 'Change photo' : hint}
        onPress={onPress}
        style={{
          height,
          borderRadius: radius.lg,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: error ? colors.danger : colors.borderLight,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            >
              <Camera size={14} color="#fff" />
              <AppText variant="caption" tone="inverse" style={{ fontWeight: '700' }}>
                Change
              </AppText>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={26} color={colors.primary} />
            </View>
            <AppText variant="bodyStrong" tone="secondary">
              {hint}
            </AppText>
          </View>
        )}
      </Pressable>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={14} color={colors.danger} />
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
