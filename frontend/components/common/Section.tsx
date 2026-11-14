import React from 'react';
import { View } from 'react-native';

import AppText from './AppText';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

/** Titled block of content on detail pages. */
export default function Section({ title, children }: SectionProps) {
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="heading">{title}</AppText>
      {children}
    </View>
  );
}
