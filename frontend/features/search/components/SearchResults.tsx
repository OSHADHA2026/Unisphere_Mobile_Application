import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, SearchX } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import { useTheme } from '@/context/ThemeContext';

import type { GlobalSearchItem } from '../hooks/useGlobalSearch';

type SearchResultsProps = {
  results: GlobalSearchItem[];
  loading: boolean;
};

export default function SearchResults({ results, loading }: SearchResultsProps) {
  const router = useRouter();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 48, gap: 12 }}>
        <ActivityIndicator color={colors.primary} />
        <AppText variant="caption" tone="muted">
          Searching UniSphere...
        </AppText>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results found"
        message="Try a different keyword, or browse a category instead."
      />
    );
  }

  return (
    <Card padded={false}>
      {results.map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={`${item.type}-${item.id}`}
          accessibilityRole="button"
          onPress={() => router.push(item.route as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderTopWidth: index === 0 ? 0 : 1,
            borderTopColor: colors.border,
          }}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="overline" tone="primary">
              {item.type}
            </AppText>
            <AppText variant="subheading" numberOfLines={1}>
              {item.title}
            </AppText>
            {item.subtitle ? (
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {item.subtitle}
              </AppText>
            ) : null}
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </Card>
  );
}
