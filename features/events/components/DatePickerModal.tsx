import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import IconButton from '@/components/common/IconButton';
import { useTheme } from '@/context/ThemeContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type DatePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
};

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  currentMonth,
  setCurrentMonth,
}: DatePickerModalProps) {
  const { colors } = useTheme();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Leading blanks + days, padded to full weeks so the grid never shifts.
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      >
        <Pressable
          onPress={() => {}}
          style={{ width: '100%', maxWidth: 380, borderRadius: 28, padding: 20, backgroundColor: colors.white, gap: 12 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton
              icon={ChevronLeft}
              label="Previous month"
              onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
            />
            <AppText variant="heading">
              {MONTHS[month]} {year}
            </AppText>
            <IconButton
              icon={ChevronRight}
              label="Next month"
              onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            {WEEKDAYS.map((d) => (
              <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                <AppText variant="overline" tone="muted" style={{ fontSize: 10 }}>
                  {d}
                </AppText>
              </View>
            ))}
          </View>

          {weeks.map((week, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              {week.map((day, j) => {
                const isToday =
                  day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                return (
                  <View key={j} style={{ flex: 1, alignItems: 'center' }}>
                    {day ? (
                      <Pressable
                        accessibilityLabel={`${MONTHS[month]} ${day}, ${year}`}
                        onPress={() => onSelectDate(new Date(year, month, day))}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isToday ? colors.primaryLight : 'transparent',
                        }}
                      >
                        <AppText variant="bodyStrong" tone={isToday ? 'primary' : 'default'}>
                          {day}
                        </AppText>
                      </Pressable>
                    ) : (
                      <View style={{ width: 40, height: 40 }} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          <Button title="Cancel" variant="secondary" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
