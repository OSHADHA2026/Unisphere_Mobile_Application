import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import RemoteImage from '@/components/common/RemoteImage';
import { useTheme } from '@/context/ThemeContext';

type TutorCardProps = {
  tutor: { name: string; subject?: string; price?: number | string; image?: string; isOnline?: boolean };
  onPress: () => void;
};

export default function TutorCard({ tutor, onPress }: TutorCardProps) {
  const { colors } = useTheme();
  const online = tutor.isOnline !== false;

  return (
    <Card onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View>
        <RemoteImage
          uri={tutor.image}
          fallbackIcon={User}
          style={{ width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: colors.white,
            backgroundColor: online ? colors.success : colors.borderLight,
          }}
        />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="subheading" numberOfLines={1}>
          {tutor.name}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {tutor.subject}
        </AppText>
        <AppText variant="bodyStrong" tone="primary">
          {tutor.price}
          <AppText variant="caption" tone="muted">
            /hr
          </AppText>
        </AppText>
      </View>
    </Card>
  );
}
