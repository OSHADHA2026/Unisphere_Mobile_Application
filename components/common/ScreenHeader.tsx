import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/constants/theme';

import AppText from './AppText';
import IconButton from './IconButton';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Override the default back behaviour. */
  onBack?: () => void;
  /** Hide the back button (root-level pages). */
  hideBack?: boolean;
  /** Optional action(s) on the right, e.g. an IconButton. */
  right?: React.ReactNode;
};

/** Header for every inner page: back button, title, optional action. */
export default function ScreenHeader({ title, subtitle, onBack, hideBack, right }: ScreenHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View
      style={{
        minHeight: layout.headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: layout.screenPadding - 4,
        paddingVertical: 8,
        backgroundColor: colors.navBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.navBorder,
      }}
    >
      {hideBack ? null : <IconButton icon={ChevronLeft} label="Go back" onPress={handleBack} />}

      <View style={{ flex: 1, paddingLeft: hideBack ? 8 : 0 }}>
        <AppText variant="heading" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{right}</View> : null}
    </View>
  );
}
