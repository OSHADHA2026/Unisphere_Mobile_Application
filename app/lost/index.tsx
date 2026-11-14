import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { SearchX } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import LostItemCard from '@/features/lost/components/LostItemCard';
import { useLostItemsListQuery } from '@/features/lost/hooks/useLostItems';
import { LostItem } from '@/features/lost/types/lostItem.types';
import { useFilteredList } from '@/hooks/useFilteredList';
import { useUser } from '@/hooks/useUser';

const FILTERS = ['ALL', 'LOST', 'FOUND', 'ELECTRONICS', 'PERSON'] as const;
type LostItemsFilter = (typeof FILTERS)[number];

const SEARCH_FIELDS: (keyof LostItem)[] = ['title', 'location', 'category'];

export default function LostIndexScreen() {
  const router = useRouter();
  const { userId } = useUser();
  const { data: items = [], isLoading, isError, error, refetch } = useLostItemsListQuery();

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<LostItemsFilter>('ALL');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const customFilter = useCallback(
    (item: LostItem) => {
      if (selectedFilter === 'ALL') return true;

      return item.status.toUpperCase() === selectedFilter || item.category.toUpperCase() === selectedFilter;
    },
    [selectedFilter],
  );

  const filteredItems = useFilteredList<LostItem>({
    items,
    searchText,
    searchFields: SEARCH_FIELDS,
    customFilter,
  });

  return (
    <FeedScreen
      title="Lost & Found"
      subtitle="Reconnecting community members with their belongings."
      search={{ value: searchText, onChange: setSearchText, placeholder: 'Search for lost items...' }}
      filters={{ options: FILTERS, selected: selectedFilter, onSelect: setSelectedFilter }}
      data={filteredItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LostItemCard
          item={item}
          onPress={() => (!userId ? setLoginModalVisible(true) : router.push(`/lost/${item.id}` as any))}
        />
      )}
      loading={isLoading}
      error={isError ? (error instanceof Error ? error.message : 'Failed to load lost items.') : null}
      empty={{
        icon: SearchX,
        title: 'No items found',
        message: "Try adjusting your search or filter to find what you're looking for.",
      }}
      onCreate={() => (!userId ? setLoginModalVisible(true) : router.push('/lost/create' as any))}
      createLabel="Report an item"
      onRefresh={refetch}
    >
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to view item details or report a lost or found item."
      />
    </FeedScreen>
  );
}
