import React, { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { AlertCircle, Eye, EyeOff } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/constants/theme';

import AppText from './AppText';

type TextFieldProps = Pick<
  TextInputProps,
  'placeholder' | 'keyboardType' | 'autoCapitalize' | 'maxLength' | 'returnKeyType' | 'onSubmitEditing' | 'autoComplete'
> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  helper?: string;
  /** Password field with a show/hide toggle. */
  secure?: boolean;
  multiline?: boolean;
  editable?: boolean;
  required?: boolean;
  /** Optional element on the right inside the field. */
  right?: React.ReactNode;
};

/** The one text input used by every form: label, field, helper and error. */
export default function TextField({
  label,
  value,
  onChangeText,
  error,
  helper,
  secure,
  multiline,
  editable = true,
  required,
  right,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <AppText variant="bodyStrong" style={{ fontSize: 14 }}>
          {label}
          {required ? <AppText tone="danger"> *</AppText> : null}
        </AppText>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          minHeight: multiline ? 112 : 52,
          paddingHorizontal: 14,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: editable ? colors.white : colors.bgInput,
        }}
      >
        <TextInput
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          secureTextEntry={secure && !reveal}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.textMuted}
          style={
            {
              flex: 1,
              fontSize: 15,
              color: editable ? colors.text : colors.textMuted,
              paddingVertical: multiline ? 12 : 0,
              minHeight: multiline ? 112 : 52,
              outlineStyle: 'none',
            } as any
          }
        />
        {secure ? (
          <Pressable
            accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
            onPress={() => setReveal((v) => !v)}
            hitSlop={10}
          >
            {reveal ? <Eye size={20} color={colors.textMuted} /> : <EyeOff size={20} color={colors.textMuted} />}
          </Pressable>
        ) : (
          right
        )}
      </View>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={14} color={colors.danger} />
          <AppText variant="caption" tone="danger" style={{ flex: 1 }}>
            {error}
          </AppText>
        </View>
      ) : helper ? (
        <AppText variant="caption" tone="muted">
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}
