import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Calendar,
  Camera,
  CircleUserRound,
  GraduationCap,
  LogOut,
  Mail,
  Moon,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import IconButton from '@/components/common/IconButton';
import LoadingState from '@/components/common/LoadingState';
import MenuRow from '@/components/common/MenuRow';
import RemoteImage from '@/components/common/RemoteImage';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { resolveImageUrl } from '@/utils/imageUrl';
import { checkForAppUpdates } from '@/utils/updateChecker';

const Stat = ({ value, label }: { value: string | number; label: string }) => (
  <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
    <AppText variant="title" tone="primary">
      {value}
    </AppText>
    <AppText variant="overline" tone="muted">
      {label}
    </AppText>
  </View>
);

export default function Profile() {
  const router = useRouter();
  const { user, loading, isUpdating, logout, refreshProfile, updateProfile, deleteProfileImage } = useProfile();
  const { isDark, colors, toggleTheme } = useTheme();

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const success = await updateProfile({
        name: user.name,
        phone: user.phone,
        year: user.year,
        major: user.major
      }, result.assets[0], false);
      
      if (success) {
        refreshProfile();
      }
    }
  };

  const handleDeleteImage = async () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => {
        await deleteProfileImage();
        refreshProfile();
      }}
    ]);
  };

  useFocusEffect(React.useCallback(() => { refreshProfile(); }, [refreshProfile]));

  if (loading) {
    return (
      <Screen header={<ScreenHeader title="My profile" />} tabBar>
        <LoadingState />
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen header={<ScreenHeader title="My profile" />} tabBar>
        <EmptyState
          icon={CircleUserRound}
          title="Hello there!"
          message="Please sign in to your UniSphere account to view and manage your profile."
          actionLabel="Sign in"
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  const avatarUri = resolveImageUrl(user.image);
  const graduationYear = user.year
    ? new Date().getFullYear() + (4 - parseInt(user.year.match(/\d+/)?.[0] || '0'))
    : 'N/A';

  return (
    <Screen
      header={
        <ScreenHeader
          title="My profile"
          right={<IconButton icon={Settings} label="Edit profile" onPress={() => router.push('/update-profile')} />}
        />
      }
      tabBar
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <View style={{ alignItems: 'center', gap: 10 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={handleImagePick}
            onLongPress={user.image ? handleDeleteImage : undefined}
          >
            <View>
              <RemoteImage
                uri={avatarUri}
                fallbackIcon={CircleUserRound}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 56,
                  overflow: 'hidden',
                  borderWidth: 3,
                  borderColor: colors.white,
                }}
              />
              {isUpdating ? (
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 56,
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator color="#fff" />
                </View>
              ) : null}
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: colors.primary,
                  borderWidth: 3,
                  borderColor: colors.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Camera size={16} color={colors.onPrimary} />
              </View>
            </View>
          </Pressable>

          <AppText variant="title">{user?.name || 'User'}</AppText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              backgroundColor: colors.primaryLight,
            }}
          >
            <GraduationCap size={16} color={colors.primary} />
            <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
              {user?.major || 'Student'} • Year {user?.year || 'N/A'}
            </AppText>
          </View>
        </View>

        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Stat value={user?.groupCount || 0} label="Groups" />
          <View style={{ width: 1, height: 36, backgroundColor: colors.border }} />
          <Stat value={user?.eventCount || 0} label="Events" />
          <View style={{ width: 1, height: 36, backgroundColor: colors.border }} />
          <Stat value={graduationYear} label="Graduation" />
        </Card>

        <View style={{ gap: 8 }}>
          <AppText variant="overline" tone="muted" style={{ paddingLeft: 4 }}>
            Activity
          </AppText>
          <Card padded={false}>
            <MenuRow icon={Users} label="Joined study groups" onPress={() => router.push('/studyGroup/joined')} />
            <MenuRow icon={Calendar} label="Registered events" onPress={() => router.push('/events/registrations')} />
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <AppText variant="overline" tone="muted" style={{ paddingLeft: 4 }}>
            Account & settings
          </AppText>
          <Card padded={false}>
            <MenuRow icon={Mail} label="Email address" value={user?.email || 'No email provided'} />
            <MenuRow icon={ShieldCheck} label="Privacy & security" onPress={() => router.push('./privacy')} />
            <MenuRow
              icon={Moon}
              label="Dark mode"
              value={isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#CBD5E1', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              }
            />
            <MenuRow icon={RefreshCw} label="Check for updates" onPress={() => checkForAppUpdates(true)} />
          </Card>
        </View>

        <Button title="Log out" icon={LogOut} variant="dangerSoft" onPress={logout} size="lg" />
      </ScrollView>
    </Screen>
  );
}
