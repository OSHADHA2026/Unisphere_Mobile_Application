import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function CancelSession() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen header={<ScreenHeader title="Cancel session" />}>
      <View style={{ flex: 1, justifyContent: 'center', padding: layout.screenPadding }}>
        <Card style={{ alignItems: 'center', gap: 16, padding: 28 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.dangerLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={32} color={colors.danger} strokeWidth={3} />
          </View>

          <AppText variant="title" center>
            Cancel this session?
          </AppText>
          <AppText variant="body" tone="secondary" center>
            This action cannot be undone. All 12 members currently enrolled will be notified via email immediately.
          </AppText>

          <View style={{ alignSelf: 'stretch', gap: 4, padding: 14, borderRadius: 16, backgroundColor: colors.bgInput }}>
            <Badge label="Upcoming session" />
            <AppText variant="subheading">Advanced Algorithms Workshop</AppText>
            <AppText variant="caption" tone="muted">
              Tomorrow, 4:00 PM • Room 402
            </AppText>
          </View>

          <Button title="Cancel session" variant="danger" onPress={() => router.back()} size="lg" />
          <Button title="Keep" variant="secondary" onPress={() => router.back()} size="lg" />
        </Card>
      </View>
    </Screen>
  );
}
