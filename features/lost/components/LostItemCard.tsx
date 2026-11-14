import React from 'react';
import { View } from 'react-native';
import { Clock, MapPin, Search } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import RemoteImage from '@/components/common/RemoteImage';
import { useTheme } from '@/context/ThemeContext';

import { LostItem } from '../types/lostItem.types';

type LostItemCardProps = {
  item: LostItem;
  onPress: (itemId: string) => void;
};

const LostItemCard = ({ item, onPress }: LostItemCardProps) => {
  const { colors } = useTheme();

  return (
    <Card padded={false} onPress={() => onPress(item.id)}>
      <View>
        <RemoteImage uri={item.image} fallbackIcon={Search} style={{ width: '100%', height: 200 }} />
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {item.isMine ? <Badge label="Your post" tone="primary" /> : <View />}
          <Badge label={item.status} tone={item.status === 'lost' ? 'danger' : 'success'} />
        </View>
      </View>

      <View style={{ padding: 16, gap: 8 }}>
        <AppText variant="heading" numberOfLines={1}>
          {item.title}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
            <MapPin size={14} color={colors.textMuted} />
            <AppText variant="caption" tone="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>
              {item.location}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Clock size={14} color={colors.textMuted} />
            <AppText variant="caption" tone="muted">
              {item.timeAgo}
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default LostItemCard;
