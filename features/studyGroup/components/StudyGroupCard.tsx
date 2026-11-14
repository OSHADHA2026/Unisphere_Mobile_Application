import React from 'react';
import { View } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { useTheme } from '@/context/ThemeContext';

type StudyGroupCardProps = {
  group: { subject: string; tag?: string; time?: string; location?: string };
  onPress: () => void;
};

export default function StudyGroupCard({ group, onPress }: StudyGroupCardProps) {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} style={{ gap: 12 }}>
      <Badge label={group.tag || 'GENERAL'} />
      <AppText variant="title" numberOfLines={2}>
        {group.subject}
      </AppText>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Clock size={16} color={colors.primary} />
          <AppText variant="body" tone="secondary" style={{ flex: 1 }}>
            {group.time}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color={colors.primary} />
          <AppText variant="body" tone="secondary" style={{ flex: 1 }}>
            {group.location}
          </AppText>
        </View>
      </View>
    </Card>
  );
}
