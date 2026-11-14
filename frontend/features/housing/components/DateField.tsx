import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

import TextField from '@/components/common/TextField';
import { useTheme } from '@/context/ThemeContext';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
};

/** mm/dd/yyyy text field with a native date picker behind the calendar icon. */
export default function DateField({ label, value, onChange, error }: DateFieldProps) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  const handlePicked = (_event: unknown, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate.toLocaleDateString('en-US'));
  };

  const handleText = (text: string) => {
    let digits = text.replace(/\D/g, '');
    if (digits.length > 2 && digits.length <= 4) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    else if (digits.length > 4) digits = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    onChange(digits);
  };

  const safeDate = () => {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? new Date() : new Date(parsed);
  };

  return (
    <>
      <TextField
        label={label}
        placeholder="mm/dd/yyyy"
        value={value}
        onChangeText={handleText}
        keyboardType="number-pad"
        maxLength={10}
        error={error}
        right={
          <Pressable accessibilityLabel="Pick a date" onPress={() => setShow(true)} hitSlop={10}>
            <Calendar size={20} color={colors.primary} />
          </Pressable>
        }
      />
      {show ? (
        <DateTimePicker
          value={safeDate()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePicked}
        />
      ) : null}
    </>
  );
}
