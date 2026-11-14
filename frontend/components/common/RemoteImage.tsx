import React, { useState } from 'react';
import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { ImageOff } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

type RemoteImageProps = {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageStyle['resizeMode'];
  fallbackIcon?: LucideIcon;
};

/**
 * Image with a graceful fallback: when there is no URL, or the image fails
 * to load (offline, expired link...), a neutral placeholder is shown instead
 * of an empty gap.
 */
export default function RemoteImage({
  uri,
  style,
  resizeMode = 'cover',
  fallbackIcon: FallbackIcon = ImageOff,
}: RemoteImageProps) {
  const { colors } = useTheme();
  // Remember which URL failed, so a new URL gets a fresh attempt.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  if (!uri || failedUri === uri) {
    return (
      <View style={[{ backgroundColor: colors.bgInput, alignItems: 'center', justifyContent: 'center' }, style]}>
        <FallbackIcon size={28} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      resizeMode={resizeMode}
      onError={() => setFailedUri(uri)}
      style={[{ backgroundColor: colors.bgInput }, style as StyleProp<ImageStyle>]}
    />
  );
}
