import React from 'react';
import { Pressable, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import AppText from './AppText';

type OptionChipsProps<T extends string> = {
  label?: string;
  options: readonly T[];
  value: T | string;
  onChange: (value: T) => void;
  error?: string | null;
};

/** Single-choice selector shown as wrapping chips. */
export default function OptionChips<T extends string>({ label, options, value, onChange, error }: OptionChipsProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <AppText variant="bodyStrong" style={{ fontSize: 14 }}>
          {label}
        </AppText>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((option) => {
          const active = value === option;

          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(option)}
              style={{
                height: 40,
                paddingHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.primary : colors.white,
                borderColor: active ? colors.primary : colors.border,
              }}
            >
              <AppText
                variant="bodyStrong"
                style={{ fontSize: 14, color: active ? colors.onPrimary : colors.textSecondary }}
              >
                {option}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={14} color={colors.danger} />
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
