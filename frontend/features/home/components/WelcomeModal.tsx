import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

type WelcomeModalProps = {
  visible: boolean;
};

export default function WelcomeModal({ visible }: WelcomeModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-10">
        <View style={{ backgroundColor: colors.primaryLight }} className="p-10 rounded-[45px] mb-10 shadow-sm">
          <GraduationCap size={100} color={colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={{ color: colors.text }} className="text-4xl font-black text-center mb-5">
          Welcome to UniSphere
        </Text>

        <Text style={{ color: colors.textSecondary }} className="text-center text-lg leading-relaxed font-medium px-4">
          Your all-in-one campus hub for events, marketplace, and community connections.
        </Text>

        <View className="absolute bottom-20 items-center">
          <ActivityIndicator color={colors.primary} size="large" />

          <Text style={{ color: colors.primary }} className="mt-6 font-bold uppercase tracking-[3px] text-[10px] text-center">
            Initializing your experience
          </Text>
        </View>
      </View>
    </Modal>
  );
}
