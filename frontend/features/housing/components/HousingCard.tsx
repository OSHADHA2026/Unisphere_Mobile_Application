import React from 'react';
import { View } from 'react-native';
import { Home, MapPin } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import RemoteImage from '@/components/common/RemoteImage';
import { useTheme } from '@/context/ThemeContext';

interface HousingCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    rentPrice: number;
    roomType: string;
    images?: string[];
    isMine: boolean;
  };
  onPress: () => void;
}

export default function HousingCard({ item, onPress }: HousingCardProps) {
  const { colors } = useTheme();

  return (
    <Card padded={false} onPress={onPress}>
      <View>
        <RemoteImage uri={item.images?.[0]} fallbackIcon={Home} style={{ width: '100%', height: 176 }} />
        <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 }}>
          <View style={{ borderRadius: 9999, backgroundColor: colors.white }}>
            <Badge label={item.roomType} tone="primary" />
          </View>
          {item.isMine ? <Badge label="Yours" tone="success" /> : null}
        </View>
      </View>

      <View style={{ padding: 16, gap: 8 }}>
        <AppText variant="heading" numberOfLines={1}>
          {item.title}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} color={colors.primary} />
          <AppText variant="caption" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
            {item.location}
          </AppText>
        </View>
        <AppText variant="heading" tone="primary">
          LKR {item.rentPrice}
          <AppText variant="caption" tone="muted">
            {' '}
            /month
          </AppText>
        </AppText>
      </View>
    </Card>
  );
}
