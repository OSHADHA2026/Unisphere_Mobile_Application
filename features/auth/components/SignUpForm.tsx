import React from 'react';
import { View } from 'react-native';

import FormError from '@/components/common/FormError';
import TextField from '@/components/common/TextField';

export default function SignUpForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (field: string) => (value: string) => setFormData({ ...formData, [field]: value });

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isEmailValid = formData.email.includes('@');
  const isPasswordValid = formData.password.length >= 6;

  return (
    <View style={{ gap: 16 }}>
      <FormError message={errorMessage} />

      <TextField label="Full name" placeholder="John Doe" value={formData.name} onChangeText={update('name')} />
      <TextField
        label="University email"
        placeholder="you@university.edu"
        value={formData.email}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={showError && !isEmailValid ? 'Please enter a valid university email.' : null}
      />
      <TextField
        label="Phone number"
        placeholder="Optional"
        value={formData.phone}
        onChangeText={update('phone')}
        keyboardType="phone-pad"
      />
      <TextField
        label="Year of study"
        placeholder="e.g. Year 1"
        value={formData.year}
        onChangeText={update('year')}
      />
      <TextField
        label="Field of study"
        placeholder="e.g. Data Science"
        value={formData.major}
        onChangeText={update('major')}
      />
      <TextField
        label="Create password"
        placeholder="At least 6 characters"
        value={formData.password}
        onChangeText={update('password')}
        secure
        error={showError && !isPasswordValid ? 'Password must be at least 6 characters.' : null}
      />
      <TextField
        label="Confirm password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChangeText={update('confirmPassword')}
        secure
        error={showError && !passwordsMatch ? 'Passwords do not match' : null}
      />
    </View>
  );
}
