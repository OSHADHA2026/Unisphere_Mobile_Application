import React, { useState } from 'react';
import { FlatList, RefreshControl, View, type ListRenderItem } from 'react-native';
import { AlertCircle, type LucideIcon } from 'lucide-react-native';

import AppHeader from '@/components/AppHeader';
import FilterChips from '@/components/FilterChips';
import SearchInput from '@/components/SearchInput';
import { layout } from '@/constants/theme';

import AppText from './AppText';
import EmptyState from './EmptyState';
import FAB from './FAB';
import LoadingState from './LoadingState';
import Screen from './Screen';

type FeedScreenProps<T, F extends string> = {
  title: string;
  subtitle: string;
  search: { value: string; onChange: (value: string) => void; placeholder: string };
  filters?: { options: readonly F[]; selected: F; onSelect: (value: F) => void };
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  /** 2 renders a grid (e.g. the marketplace). */
  numColumns?: 1 | 2;
  loading?: boolean;
  error?: string | null;
  empty: { icon: LucideIcon; title: string; message: string };
  onCreate?: () => void;
  createLabel?: string;
  onRefresh?: () => Promise<unknown> | void;
  /** Modals and other overlays owned by the page. */
  children?: React.ReactNode;
};

/**
 * Shared layout for every "browse a list" page (Events, Housing, Marketplace,
 * Study Groups, Lost & Found, Tutors): header, sticky search and filters,
 * list, empty/loading/error states and the create button.
 */
export default function FeedScreen<T, F extends string = string>({
  title,
  subtitle,
  search,
  filters,
  data,
  keyExtractor,
  renderItem,
  numColumns = 1,
  loading,
  error,
  empty,
  onCreate,
  createLabel = 'Create',
  onRefresh,
  children,
}: FeedScreenProps<T, F>) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  let body: React.ReactNode;

  if (loading && !refreshing) {
    body = <LoadingState />;
  } else if (error) {
    body = <EmptyState icon={AlertCircle} title="Something went wrong" message={error} />;
  } else {
    body = (
      <FlatList
        key={numColumns}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: 16, gap: 4 }}>
            <AppText variant="display">{title}</AppText>
            <AppText variant="body" tone="secondary">
              {subtitle}
            </AppText>
          </View>
        }
        ListEmptyComponent={<EmptyState icon={empty.icon} title={empty.title} message={empty.message} />}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingTop: 8,
          paddingBottom: onCreate ? layout.fabSize + layout.screenPadding * 2 : 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} /> : undefined}
      />
    );
  }

  return (
    <Screen
      header={<AppHeader title="UniSphere" />}
      tabBar
      fab={onCreate ? <FAB onPress={onCreate} label={createLabel} /> : undefined}
    >
      <View style={{ paddingHorizontal: layout.screenPadding, paddingTop: 12, gap: 12 }}>
        <SearchInput value={search.value} onChangeText={search.onChange} placeholder={search.placeholder} />
        {filters ? (
          <FilterChips options={filters.options} selectedValue={filters.selected} onSelect={filters.onSelect} />
        ) : null}
      </View>

      {body}
      {children}
    </Screen>
  );
}
