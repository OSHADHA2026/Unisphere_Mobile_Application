import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { HomeIcon } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import HousingCard from '@/features/housing/components/HousingCard';
import { Housing, useHousing } from '@/features/housing/hooks/useHousing';
import { useUser } from '@/hooks/useUser';

const FILTERS = ['All', 'Mine', 'Others'] as const;
type HousingFilter = (typeof FILTERS)[number];

export default function HousingList() {
  const router = useRouter();
  const { housings, loading, refreshHousings } = useHousing();
  const { userId } = useUser();

  const [activeFilter, setActiveFilter] = useState<HousingFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshHousings();
    }, [refreshHousings]),
  );

  const filteredHousings = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return housings.filter(
      (h: Housing) =>
        (activeFilter === 'All' ? true : activeFilter === 'Mine' ? h.isMine : !h.isMine) &&
        (h.title.toLowerCase().includes(query) || h.location.toLowerCase().includes(query)),
    );
  }, [housings, activeFilter, searchQuery]);

  const goToHousing = (item: Housing) => {
    if (!item.id?.trim()) return;
    router.push({ pathname: '/housing/[id]', params: { id: item.id } });
  };

  return (
    <FeedScreen
      title="Housing"
      subtitle="Find rooms and accommodations around campus."
      search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Search rooms...' }}
      filters={{ options: FILTERS, selected: activeFilter, onSelect: setActiveFilter }}
      data={filteredHousings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HousingCard item={item} onPress={() => goToHousing(item)} />}
      loading={loading}
      empty={{
        icon: HomeIcon,
        title: 'No rooms found',
        message: 'There are no rooms matching your search or filter.',
      }}
      onCreate={() => (!userId ? setLoginModalVisible(true) : router.push('/housing/create'))}
      createLabel="Post a room"
      onRefresh={refreshHousings}
    >
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to post a room listing."
      />
    </FeedScreen>
  );
}
