import React from 'react';
import { View } from 'react-native';

import AppText from '@/components/common/AppText';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <View style={{ gap: 4 }}>
    <AppText variant="display">{title}</AppText>
    {subtitle ? (
      <AppText variant="body" tone="secondary">
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

export default SectionHeader;
