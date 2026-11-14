import React from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { layout } from '@/constants/theme';
import EventCard from '@/features/events/components/EventCard';
import { useEvents } from '@/features/events/hooks/useEvents';

export default function MyRegistrations() {
  const router = useRouter();
  const { events, loading } = useEvents('registrations');

  return (
    <Screen header={<ScreenHeader title="My registered events" />}>
      {loading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 32, flexGrow: 1 }}
          ListHeaderComponent={
            events.length > 0 ? (
              <AppText variant="overline" tone="muted" style={{ marginBottom: 12 }}>
                Registered events ({events.length})
              </AppText>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon={Calendar}
              title="No registrations yet"
              message="You haven't registered for any events. Browse the campus feed and join some events!"
              actionLabel="Discover events"
              onAction={() => router.push('/events')}
            />
          }
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => router.push(`/events/${item.id}`)}
              onEdit={
                item.isMine ? () => router.push({ pathname: '/events/create', params: { editId: item.id } }) : undefined
              }
            />
          )}
        />
      )}
    </Screen>
  );
}
