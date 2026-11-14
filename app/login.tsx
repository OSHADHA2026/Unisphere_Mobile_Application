import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';

import AppText from '@/components/common/AppText';
import Button from '@/components/common/Button';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import { STORAGE_KEYS } from '@/constants/config';
import { layout } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AppStorage } from '@/services/storage';

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isLoading, errorMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Mark welcome as seen when reaching login to avoid loops
    AppStorage.setItem(STORAGE_KEYS.hasSeenWelcome, 'true');
  }, []);

  const handleLogin = () => login(email, password);

  return (
    <Screen header={<ScreenHeader title="Sign in" onBack={() => router.replace('/')} />}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: layout.screenPadding, paddingTop: 32, gap: 28, flexGrow: 1 }}
        >
          <View style={{ alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={38} color={colors.onPrimary} />
            </View>
            <AppText variant="display" tone="primary">
              UniSphere
            </AppText>
            <AppText variant="body" tone="secondary">
              Connect. Explore. Succeed.
            </AppText>
          </View>

          <View style={{ gap: 4 }}>
            <AppText variant="title">Welcome back</AppText>
            <AppText variant="body" tone="secondary">
              Sign in to continue to UniSphere
            </AppText>
          </View>

          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            errorMessage={errorMessage}
            onSubmit={handleLogin}
          />

          <Button title="Sign in" onPress={handleLogin} loading={isLoading} size="lg" />

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
            <AppText variant="body" tone="secondary">
              Don&apos;t have an account?
            </AppText>
            <Pressable accessibilityRole="link" onPress={() => router.push('/signup')} hitSlop={8}>
              <AppText variant="bodyStrong" tone="primary">
                Sign up
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
