import React from 'react';
import { View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import RemoteImage from '@/components/common/RemoteImage';

type ProductCardProps = {
  item: { _id: string; title: string; price: number; image?: string; condition?: string };
  onPress: () => void;
};

/** Compact card designed for a two-column grid. */
export default function ProductCard({ item, onPress }: ProductCardProps) {
  return (
    <Card padded={false} onPress={onPress} style={{ flex: 1 }}>
      <View>
        <RemoteImage uri={item.image} fallbackIcon={ShoppingBag} style={{ width: '100%', aspectRatio: 1 }} />
        {item.condition ? (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge label={item.condition} tone={item.condition.toUpperCase() === 'NEW' ? 'success' : 'neutral'} />
          </View>
        ) : null}
      </View>

      <View style={{ padding: 12, gap: 4 }}>
        <AppText variant="bodyStrong" numberOfLines={2} style={{ minHeight: 44 }}>
          {item.title}
        </AppText>
        <AppText variant="heading" tone="primary">
          ${item.price}
        </AppText>
      </View>
    </Card>
  );
}
