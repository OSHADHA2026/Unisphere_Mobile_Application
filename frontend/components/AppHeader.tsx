import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap, User } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { resolveImageUrl } from '@/utils/imageUrl';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

/** Top bar for the main tab pages: brand on the left, account on the right. */
const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useTheme();

  const avatarUri = resolveImageUrl(user?.image);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: layout.screenPadding,
        paddingVertical: 12,
        backgroundColor: colors.navBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.navBorder,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GraduationCap size={22} color={colors.onPrimary} strokeWidth={2.4} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <AppText variant="heading" tone="primary" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="muted" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {user ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push('/profile')}>
          <Avatar style={{ backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20 }}>
            {avatarUri ? (
              <AvatarImage source={{ uri: avatarUri }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
            ) : (
              <User size={20} color={colors.onPrimary} />
            )}
          </Avatar>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          onPress={() => router.push('/login')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 14,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.primaryLight,
          }}
        >
          <User size={16} color={colors.primary} />
          <AppText variant="bodyStrong" tone="primary" style={{ fontSize: 14 }}>
            Sign in
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

export default AppHeader;
