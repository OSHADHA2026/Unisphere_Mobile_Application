import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, CalendarX, CheckCheck, Clock, MapPin, Verified } from 'lucide-react-native';

import ActionBar from '@/components/common/ActionBar';
import AppText from '@/components/common/AppText';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import ImageGallery from '@/components/common/ImageGallery';
import InfoRow from '@/components/common/InfoRow';
import LoadingState from '@/components/common/LoadingState';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import Section from '@/components/common/Section';
import ConfirmModal from '@/components/feedback/ConfirmModal';
import LoginRequiredModal from '@/components/feedback/LoginRequiredModal';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useEventDetail } from '@/features/events/hooks/useEventDetail';
import { useUser } from '@/hooks/useUser';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useUser();
  const { colors } = useTheme();

  const { event, loading, isRegistered, registering, register } = useEventDetail(id);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const header = <ScreenHeader title="Event details" />;

  if (loading) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={CalendarX}
          title="Event not found"
          message="This event may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const startMonth = start.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const handleRegisterPress = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }
    if (!isRegistered && !registering) {
      setConfirmModalVisible(true);
    }
  };

  return (
    <Screen
      header={header}
      bottomBar={
        <ActionBar>
          <Button
            title={isRegistered ? 'Registered' : 'RSVP / Register'}
            icon={isRegistered ? CheckCheck : undefined}
            variant={isRegistered ? 'secondary' : 'primary'}
            loading={registering}
            onPress={handleRegisterPress}
            size="lg"
          />
        </ActionBar>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <ImageGallery
          images={[event.image]}
          fallbackIcon={Calendar}
          badge={<Badge label={`${start.getDate()} ${startMonth}`} />}
        />

        <View style={{ gap: 10 }}>
          <Badge label="Open for registration" tone="success" />
          <AppText variant="display">{event.title}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Verified size={18} color={colors.primary} />
            <AppText variant="body" tone="secondary" style={{ flex: 1 }}>
              Hosted by {event.organizerName}
            </AppText>
          </View>
        </View>

        <Card style={{ gap: 16 }}>
          <InfoRow icon={Calendar} label="Starts" value={start.toLocaleString()} />
          <InfoRow icon={Clock} label="Ends" value={end.toLocaleString()} />
          <InfoRow icon={MapPin} label="Location" value={event.location} />
        </Card>

        <Section title="About the event">
          <AppText variant="body" tone="secondary">
            {event.description}
          </AppText>
        </Section>

        {event.tags?.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {event.tags.map((tag: string, index: number) => (
              <Badge key={`${tag}-${index}`} label={tag} />
            ))}
          </View>
        ) : null}
      </ScrollView>

      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirm attendance?"
        message={`Are you sure you want to register for "${event.title}"? Your attendance will be confirmed.`}
        confirmLabel="Register"
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={async () => {
          setConfirmModalVisible(false);
          await register();
        }}
      />

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Please sign in to register for events and manage your event schedule."
      />
    </Screen>
  );
}
