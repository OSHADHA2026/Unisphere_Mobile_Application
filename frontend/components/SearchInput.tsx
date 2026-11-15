import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/constants/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchInput = ({ value, onChangeText, placeholder = 'Search...' }: SearchInputProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        paddingHorizontal: 14,
        gap: 10,
        borderRadius: radius.md,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Search size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        style={{ flex: 1, minHeight: 48, fontSize: 15, color: colors.text, outlineStyle: 'none' } as any}
      />
      {value.length > 0 ? (
        <Pressable accessibilityLabel="Clear search" onPress={() => onChangeText('')} hitSlop={10}>
          <X size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SearchInput;
