import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import IconButton from '@/components/common/IconButton';
import { useTheme } from '@/context/ThemeContext';

const HOURS = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const PERIODS = ['AM', 'PM'] as const;

type TimePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Called with a 24h "HH:MM" string. */
  onSelectTime: (time: string) => void;
};

function Column({
  title,
  values,
  selected,
  onSelect,
}: {
  title: string;
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <AppText variant="overline" tone="muted" center style={{ marginBottom: 8 }}>
        {title}
      </AppText>
      <ScrollView showsVerticalScrollIndicator={false}>
        {values.map((value) => {
          const active = selected === value;

          return (
            <Pressable
              key={value}
              onPress={() => onSelect(value)}
              style={{
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: 14,
                marginBottom: 4,
                backgroundColor: active ? colors.primary : 'transparent',
              }}
            >
              <AppText variant="heading" style={{ color: active ? colors.onPrimary : colors.textMuted }}>
                {value}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function TimePickerModal({ visible, onClose, onSelectTime }: TimePickerModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('AM');

  const handleConfirm = () => {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    onSelectTime(`${h.toString().padStart(2, '0')}:${minute}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            gap: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText variant="title">Select time</AppText>
            <IconButton icon={X} label="Close" onPress={onClose} />
          </View>

          <View style={{ flexDirection: 'row', height: 240, gap: 12 }}>
            <Column title="Hour" values={HOURS} selected={hour} onSelect={setHour} />
            <Column title="Minute" values={MINUTES} selected={minute} onSelect={setMinute} />
            <View style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
              {PERIODS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={{
                    paddingVertical: 18,
                    alignItems: 'center',
                    borderRadius: 14,
                    backgroundColor: period === p ? colors.primaryLight : colors.bgInput,
                  }}
                >
                  <AppText variant="heading" tone={period === p ? 'primary' : 'muted'}>
                    {p}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          <Button title="Confirm time" onPress={handleConfirm} size="lg" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
