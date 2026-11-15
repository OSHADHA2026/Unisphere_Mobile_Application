import React, { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageContentFit } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

type RemoteImageProps = {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  fallbackIcon?: LucideIcon;
};

/**
 * Image with a graceful fallback: when there is no URL, or the image fails
 * to load (offline, expired link...), a neutral placeholder is shown instead
 * of an empty gap.
 *
 * Uses expo-image, which decodes pictures at the size they are displayed
 * (instead of full resolution) and caches them, keeping memory use low in
 * long image lists.
 */
export default function RemoteImage({
  uri,
  style,
  contentFit = 'cover',
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
      contentFit={contentFit}
      cachePolicy="memory-disk"
      recyclingKey={uri.length > 200 ? uri.slice(-64) : uri}
      onError={() => setFailedUri(uri)}
      style={[{ backgroundColor: colors.bgInput }, style as any]}
    />
  );
}
