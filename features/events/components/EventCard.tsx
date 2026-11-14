import React, { useState } from 'react';
import { View } from 'react-native';
import { Edit2, MapPin, MoreVertical, Trash2 } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import IconButton from '@/components/common/IconButton';
import ActionSheet, { type ActionSheetAction } from '@/components/feedback/ActionSheet';
import { useTheme } from '@/context/ThemeContext';

interface EventCardProps {
  item: {
    id: string;
    title: string;
    month: string;
    day: string;
    location: string;
    organizer: string;
    isMine?: boolean;
  };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ item, onPress, onEdit, onDelete }: EventCardProps) {
  const { colors } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const actions: ActionSheetAction[] = [];
  if (onEdit) actions.push({ label: 'Edit event', icon: Edit2, onPress: onEdit });
  if (onDelete) actions.push({ label: 'Delete event', icon: Trash2, onPress: onDelete, destructive: true });

  return (
    <Card onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View
        style={{
          width: 60,
          height: 68,
          borderRadius: 14,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="overline" tone="primary">
          {item.month}
        </AppText>
        <AppText variant="title">{item.day}</AppText>
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {item.isMine ? <Badge label="Yours" tone="success" /> : null}
          <AppText variant="overline" tone="muted" numberOfLines={1} style={{ flexShrink: 1 }}>
            {item.organizer}
          </AppText>
        </View>
        <AppText variant="subheading" numberOfLines={2}>
          {item.title}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin size={13} color={colors.textMuted} />
          <AppText variant="caption" tone="secondary" numberOfLines={1} style={{ flex: 1 }}>
            {item.location}
          </AppText>
        </View>
      </View>

      {actions.length > 0 ? (
        <>
          <IconButton icon={MoreVertical} label="More actions" size={20} onPress={() => setMenuOpen(true)} />
          <ActionSheet visible={menuOpen} onClose={() => setMenuOpen(false)} title={item.title} actions={actions} />
        </>
      ) : null}
    </Card>
  );
}
