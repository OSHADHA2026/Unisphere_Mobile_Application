import React from 'react';
import { ScrollView, View } from 'react-native';
import { Eye, FileText, Globe, Lock, ShieldCheck } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const SECTIONS = [
  {
    title: 'Data Collection',
    icon: Eye,
    content:
      'UniSphere collects minimal data necessary to provide our campus hub services. This includes your student email, name, and profile information you choose to share with the community.',
  },
  {
    title: 'Information Usage',
    icon: Globe,
    content:
      'Your data is used to facilitate event registrations, marketplace connections, and study group interactions. We do not sell your personal information to third parties.',
  },
  {
    title: 'Security Measures',
    icon: Lock,
    content:
      'We implement industry-standard security protocols to protect your data. This includes encrypted storage for passwords and secure communication channels for all API requests.',
  },
  {
    title: 'Your Rights',
    icon: ShieldCheck,
    content:
      'You have the right to access, update, or delete your profile information at any time. For full account deletion requests, please contact our support team.',
  },
  {
    title: 'Policy Updates',
    icon: FileText,
    content:
      'We may update this privacy policy from time to time to reflect changes in our services. Users will be notified of any significant changes via the app.',
  },
];

export default function PrivacyPolicy() {
  const { colors } = useTheme();

  return (
    <Screen header={<ScreenHeader title="Privacy & policy" />}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 16, paddingBottom: 32 }}
      >
        <View
          style={{ alignItems: 'center', gap: 8, padding: 24, borderRadius: 24, backgroundColor: colors.primaryLight }}
        >
          <ShieldCheck size={44} color={colors.primary} strokeWidth={1.6} />
          <AppText variant="title" center>
            Your privacy matters
          </AppText>
          <AppText variant="body" tone="secondary" center>
            At UniSphere, we are committed to protecting your personal information and your right to privacy.
          </AppText>
        </View>

        {SECTIONS.map((section) => (
          <Card key={section.title} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <section.icon size={18} color={colors.primary} />
              </View>
              <AppText variant="heading">{section.title}</AppText>
            </View>
            <AppText variant="body" tone="secondary">
              {section.content}
            </AppText>
          </Card>
        ))}

        <AppText variant="overline" tone="muted" center>
          Last updated: May 2026
        </AppText>
      </ScrollView>
    </Screen>
  );
}
