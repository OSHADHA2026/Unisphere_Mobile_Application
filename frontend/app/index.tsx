import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import Screen from '@/components/common/Screen';
import SearchInput from '@/components/SearchInput';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useEvents } from '@/features/events/hooks/useEvents';
import FeaturedEventCard from '@/features/home/components/FeaturedEventCard';
import WelcomeModal from '@/features/home/components/WelcomeModal';
import { FEATURED_EVENTS_LIMIT, HOME_CATEGORIES } from '@/features/home/constants';
import { useWelcomeRedirect } from '@/features/home/hooks/useWelcomeRedirect';
import SearchResults from '@/features/search/components/SearchResults';
import { useGlobalSearch } from '@/features/search/hooks/useGlobalSearch';

export default function Home() {
  const router = useRouter();
  const { events, loading } = useEvents();
  const { isDark, colors } = useTheme();
  const showWelcome = useWelcomeRedirect();
  const search = useGlobalSearch();

  return (
    <Screen header={<AppHeader title="UniSphere" subtitle="Campus Connection" />} tabBar>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 32, gap: 24 }}
      >
        <SearchInput value={search.query} onChangeText={search.setQuery} placeholder="Search events, items, tutors..." />

        {search.isActive ? (
          <SearchResults results={search.results} loading={search.loading} />
        ) : (
          <>
            <View style={{ gap: 12 }}>
              <AppText variant="title">Explore</AppText>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {HOME_CATEGORIES.map((item) => (
                  <Card
                    key={item.route}
                    onPress={() => router.push(item.route as any)}
                    style={{ width: '48%', flexGrow: 1, minHeight: 132, justifyContent: 'space-between' }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDark ? colors.primaryLight : item.color,
                      }}
                    >
                      <item.icon size={24} color={isDark ? colors.iconActive : item.iconColor} />
                    </View>
                    <View style={{ gap: 2 }}>
                      <AppText variant="subheading">{item.name}</AppText>
                      <AppText variant="caption" tone="muted" numberOfLines={1}>
                        {item.description}
                      </AppText>
                    </View>
                  </Card>
                ))}
              </View>
            </View>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <AppText variant="title">Featured events</AppText>
                <Pressable accessibilityRole="link" onPress={() => router.push('/events')} hitSlop={8}>
                  <AppText variant="bodyStrong" tone="primary">
                    View all
                  </AppText>
                </Pressable>
              </View>

              {loading ? (
                <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : events.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={Calendar}
                    title="No featured events"
                    message="New campus events will show up here."
                  />
                </Card>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12, paddingRight: layout.screenPadding }}
                  style={{ marginHorizontal: -layout.screenPadding, paddingLeft: layout.screenPadding }}
                >
                  {events.slice(0, FEATURED_EVENTS_LIMIT).map((event) => (
                    <FeaturedEventCard
                      key={event.id}
                      event={event}
                      onPress={() => router.push(`/events/${event.id}`)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <WelcomeModal visible={showWelcome} />
    </Screen>
  );
}
