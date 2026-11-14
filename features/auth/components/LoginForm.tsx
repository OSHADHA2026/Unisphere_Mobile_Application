import React from 'react';
import { View } from 'react-native';

import FormError from '@/components/common/FormError';
import TextField from '@/components/common/TextField';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errorMessage: string | null;
  onSubmit?: () => void;
}

export default function LoginForm({ email, setEmail, password, setPassword, errorMessage, onSubmit }: LoginFormProps) {
  return (
    <View style={{ gap: 16 }}>
      <FormError message={errorMessage} />
      <TextField
        label="Email address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
      />
      <TextField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secure
        autoComplete="password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}
