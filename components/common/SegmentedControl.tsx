import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type SegmentedControlProps<T extends string> = {
  label?: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Two-to-three way switch (e.g. "I lost" / "I found"). */
export default function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <AppText variant="bodyStrong" style={{ fontSize: 14 }}>
          {label}
        </AppText>
      ) : null}
      <View style={{ flexDirection: 'row', padding: 4, borderRadius: 16, backgroundColor: colors.bgInput }}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(option.value)}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.white : 'transparent',
              }}
            >
              <AppText
                variant="bodyStrong"
                style={{ fontSize: 14, color: active ? colors.primary : colors.textSecondary }}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
