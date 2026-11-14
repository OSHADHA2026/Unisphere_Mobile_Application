import React from 'react';
import { Pressable, ScrollView } from 'react-native';

import AppText from '@/components/common/AppText';
import { useTheme } from '@/context/ThemeContext';

/** "COMPUTER SCIENCE" -> "Computer Science"; short codes like "IT" stay as is. */
const formatLabel = (value: string): string =>
  value.length <= 2
    ? value
    : value.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

const FilterChips = <T extends string>({ options, selectedValue, onSelect }: FilterChipsProps<T>) => {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
      {options.map((option) => {
        const isActive = selectedValue === option;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onSelect(option)}
            style={{
              height: 36,
              paddingHorizontal: 16,
              borderRadius: 18,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive ? colors.primary : colors.white,
              borderColor: isActive ? colors.primary : colors.border,
            }}
          >
            <AppText
              variant="bodyStrong"
              style={{ fontSize: 13, lineHeight: 18, color: isActive ? colors.onPrimary : colors.textSecondary }}
            >
              {formatLabel(option)}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default FilterChips;
