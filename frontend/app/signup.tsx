import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppText from '@/components/common/AppText';
import FormScreen from '@/components/common/FormScreen';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SignUp() {
  const router = useRouter();
  const { signup, isLoading, errorMessage } = useAuth();
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    major: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignUp = async () => {
    const success = await signup(formData);
    if (!success && !errorMessage) setShowError(true);
  };

  return (
    <FormScreen
      title="Join UniSphere"
      subtitle="Student registration"
      submitLabel="Create account"
      onSubmit={handleSignUp}
      submitting={isLoading}
    >
      <SignUpForm formData={formData} setFormData={setFormData} showError={showError} errorMessage={errorMessage} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        <AppText variant="body" tone="secondary">
          Already a member?
        </AppText>
        <Pressable accessibilityRole="link" onPress={() => router.push('/login')} hitSlop={8}>
          <AppText variant="bodyStrong" tone="primary">
            Sign in
          </AppText>
        </Pressable>
      </View>
    </FormScreen>
  );
}
