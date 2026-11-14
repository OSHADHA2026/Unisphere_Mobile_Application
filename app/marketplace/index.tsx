import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';

import FeedScreen from '@/components/common/FeedScreen';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import ProductCard from '@/features/marketplace/components/ProductCard';
import { useMarketplace } from '@/features/marketplace/hooks/useMarketplace';
import { useUser } from '@/hooks/useUser';

const FILTERS = ['ALL', 'CHEAP', 'EXPENSIVE', 'NEW', 'USED'] as const;
type MarketFilter = (typeof FILTERS)[number];

const CHEAP_PRICE_LIMIT = 5000;
const SPACER = { _id: '__spacer__' } as any;

export default function MarketplaceIndex() {
  const router = useRouter();
  const { userId } = useUser();
  const { products, loading, refreshProducts } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MarketFilter>('ALL');
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = products.filter((item) => {
      if (query && !item.title?.toLowerCase().includes(query)) return false;

      switch (selectedFilter) {
        case 'CHEAP':
          return item.price < CHEAP_PRICE_LIMIT;
        case 'EXPENSIVE':
          return item.price >= CHEAP_PRICE_LIMIT;
        case 'NEW':
          return item.condition?.toUpperCase() === 'NEW';
        case 'USED':
          return item.condition?.toUpperCase() === 'USED';
        default:
          return true;
      }
    });

    // Keep the last card of an odd-sized grid from stretching full width.
    return matches.length % 2 === 1 ? [...matches, SPACER] : matches;
  }, [products, searchQuery, selectedFilter]);

  const handlePressProduct = (item: any) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    if (item.userId === userId || item.ownerId === userId || item.createdBy === userId) {
      router.push('/marketplace/create' as any);
      return;
    }

    router.push({ pathname: '/marketplace/[id]', params: { id: item._id } });
  };

  const handleCreateProduct = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push('/marketplace/create' as any);
  };

  return (
    <FeedScreen
      title="Marketplace"
      subtitle="Buy, sell, and discover useful items around campus."
      search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Find items...' }}
      filters={{ options: FILTERS, selected: selectedFilter, onSelect: setSelectedFilter }}
      data={filteredProducts}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) =>
        item._id === SPACER._id ? (
          <View style={{ flex: 1 }} />
        ) : (
          <ProductCard item={item} onPress={() => handlePressProduct(item)} />
        )
      }
      loading={loading}
      empty={{ icon: ShoppingBag, title: 'No items found', message: 'Try adjusting your search or filter.' }}
      onCreate={handleCreateProduct}
      createLabel="Sell an item"
      onRefresh={refreshProducts}
    >
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to your UniSphere account to view marketplace items or create a new listing."
      />
    </FeedScreen>
  );
}
