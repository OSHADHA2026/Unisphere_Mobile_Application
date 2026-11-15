import React from 'react';
import { Pressable, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, Calendar, HelpCircle, Home, User, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/common/AppText';
import { useTheme } from '@/context/ThemeContext';
import { layout } from '@/constants/theme';

const TABS = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Tutors', icon: BookOpen, path: '/tutors' },
  { name: 'Lost', icon: HelpCircle, path: '/lost' },
  { name: 'Groups', icon: Users, path: '/studyGroup' },
  { name: 'Events', icon: Calendar, path: '/events' },
  { name: 'Profile', icon: User, path: '/profile' },
] as const;

/**
 * Bottom tab bar. It is part of the page's column layout (see <Screen>),
 * not floating over it, and it adds the device's bottom safe-area itself.
 */
export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isActive = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.navBg,
        borderTopWidth: 1,
        borderTopColor: colors.navBorder,
        paddingBottom: insets.bottom,
        minHeight: layout.tabBarHeight + insets.bottom,
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.path);
        const color = active ? colors.iconActive : colors.icon;

        return (
          <Pressable
            key={tab.path}
            accessibilityRole="tab"
            accessibilityLabel={tab.name}
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(tab.path as any)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <View
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.primaryLight : 'transparent',
              }}
            >
              <tab.icon size={20} color={color} strokeWidth={active ? 2.5 : 2} />
            </View>
            <AppText
              variant="caption"
              numberOfLines={1}
              style={{ fontSize: 11, lineHeight: 14, fontWeight: active ? '700' : '500', color }}
            >
              {tab.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
