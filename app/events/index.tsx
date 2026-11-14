import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarX } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import ConfirmDeleteModal from '@/components/feedback/ConfirmDeleteModal';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import EventCard from '@/features/events/components/EventCard';
import { Event, useEvents } from '@/features/events/hooks/useEvents';
import { useUser } from '@/hooks/useUser';
import apiClient from '@/services/api';

const FILTERS = ['All', 'Mine', 'Others'] as const;
type EventFilter = (typeof FILTERS)[number];

export default function EventsList() {
  const router = useRouter();
  const { events, loading, refreshEvents } = useEvents();
  const { userId } = useUser();

  const [activeFilter, setActiveFilter] = useState<EventFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter(
      (e: Event) =>
        (activeFilter === 'All' ? true : activeFilter === 'Mine' ? e.isMine : !e.isMine) &&
        e.title.toLowerCase().includes(query),
    );
  }, [events, activeFilter, searchQuery]);

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      if ((await apiClient.delete(`/events/${eventToDelete}`)).data.success) {
        refreshEvents();
      }
    } catch {
      Alert.alert('Error', 'Failed to delete event.');
    } finally {
      setEventToDelete(null);
    }
  };

  return (
    <FeedScreen
      title="Campus Feed"
      subtitle="Discover and share events happening around you."
      search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Search events...' }}
      filters={{ options: FILTERS, selected: activeFilter, onSelect: setActiveFilter }}
      data={filteredEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard
          item={item}
          onPress={() => router.push(`/events/${item.id}`)}
          onEdit={
            item.isMine ? () => router.push({ pathname: '/events/create', params: { editId: item.id } }) : undefined
          }
          onDelete={item.isMine ? () => setEventToDelete(item.id) : undefined}
        />
      )}
      loading={loading}
      empty={{
        icon: CalendarX,
        title: 'No events found',
        message: 'There are no events matching your search or filter.',
      }}
      onCreate={() => (!userId ? setLoginModalVisible(true) : router.push('/events/create'))}
      createLabel="Create event"
      onRefresh={refreshEvents}
    >
      <ConfirmDeleteModal
        visible={eventToDelete !== null}
        title="Delete Event?"
        message="This will permanently remove your curated event from the campus feed. This action cannot be undone."
        onCancel={() => setEventToDelete(null)}
        onConfirm={confirmDelete}
      />

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to your UniSphere account to create and share new events with the campus."
      />
    </FeedScreen>
  );
}
