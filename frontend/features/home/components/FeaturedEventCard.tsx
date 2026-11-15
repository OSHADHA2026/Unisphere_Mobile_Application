import React from 'react';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import RemoteImage from '@/components/common/RemoteImage';
import { useTheme } from '@/context/ThemeContext';
import type { Event } from '@/features/events/hooks/useEvents';

import { FALLBACK_EVENT_IMAGE } from '../constants';

type FeaturedEventCardProps = {
  event: Event;
  onPress: () => void;
};

export default function FeaturedEventCard({ event, onPress }: FeaturedEventCardProps) {
  const { colors } = useTheme();

  return (
    <Card padded={false} onPress={onPress} style={{ width: 272 }}>
      <View>
        <RemoteImage
          uri={event.image || FALLBACK_EVENT_IMAGE}
          style={{ width: '100%', height: 140 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: colors.white,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 4,
            alignItems: 'center',
          }}
        >
          <AppText variant="overline" tone="primary" style={{ fontSize: 10, lineHeight: 12 }}>
            {event.month}
          </AppText>
          <AppText variant="heading" style={{ lineHeight: 20 }}>
            {event.day}
          </AppText>
        </View>
      </View>

      <View style={{ padding: 14, gap: 6 }}>
        <AppText variant="subheading" numberOfLines={1}>
          {event.title}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} color={colors.textMuted} />
          <AppText variant="caption" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
            {event.location}
          </AppText>
        </View>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          Hosted by {event.organizer}
        </AppText>
      </View>
    </Card>
  );
}
