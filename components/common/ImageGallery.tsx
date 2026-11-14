import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';

import { radius } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

import RemoteImage from './RemoteImage';

type ImageGalleryProps = {
  images: (string | undefined | null)[];
  fallbackIcon?: LucideIcon;
  height?: number;
  /** Overlay shown on the top-left corner (a Badge, usually). */
  badge?: React.ReactNode;
};

/** Hero image for detail pages, with next/previous controls when there are several photos. */
export default function ImageGallery({ images, fallbackIcon, height = 240, badge }: ImageGalleryProps) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  const photos = images.filter(Boolean) as string[];
  const count = photos.length;
  const go = (step: number) => setIndex((prev) => (prev + step + count) % count);

  const arrow = (side: 'left' | 'right') => ({
    position: 'absolute' as const,
    top: height / 2 - 20,
    [side]: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  });

  return (
    <View style={{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.bgInput }}>
      <RemoteImage uri={photos[index]} fallbackIcon={fallbackIcon} style={{ width: '100%', height }} />

      {badge ? <View style={{ position: 'absolute', top: 12, left: 12 }}>{badge}</View> : null}

      {count > 1 ? (
        <>
          <Pressable accessibilityLabel="Previous photo" onPress={() => go(-1)} style={arrow('left')}>
            <ChevronLeft size={22} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="Next photo" onPress={() => go(1)} style={arrow('right')}>
            <ChevronRight size={22} color="#fff" />
          </Pressable>
          <View
            style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}
          >
            {photos.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === index ? 18 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === index ? colors.primary : 'rgba(255,255,255,0.7)',
                }}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
