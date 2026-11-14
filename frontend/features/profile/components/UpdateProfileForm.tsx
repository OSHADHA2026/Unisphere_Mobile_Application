import React from 'react';
import { View } from 'react-native';

import FormError from '@/components/common/FormError';
import TextField from '@/components/common/TextField';

export default function UpdateProfileForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (field: string) => (value: string) => setFormData({ ...formData, [field]: value });
  const pwOk = !formData.password || formData.password.length >= 6;
  const pwMatch = formData.password === formData.confirmPassword;

  return (
    <View style={{ gap: 16 }}>
      <FormError message={errorMessage} />

      <TextField label="Full name" placeholder="John Doe" value={formData.name} onChangeText={update('name')} />
      <TextField
        label="University email"
        helper="Your email cannot be changed."
        value={formData.email}
        onChangeText={() => {}}
        editable={false}
      />
      <TextField
        label="Phone number"
        placeholder="Phone number"
        value={formData.phone}
        onChangeText={update('phone')}
        keyboardType="phone-pad"
      />
      <TextField label="Year of study" placeholder="e.g. Year 1" value={formData.year} onChangeText={update('year')} />
      <TextField
        label="Field of study"
        placeholder="e.g. Data Science"
        value={formData.major}
        onChangeText={update('major')}
      />
      <TextField
        label="New password (optional)"
        placeholder="Leave blank to keep current"
        value={formData.password}
        onChangeText={update('password')}
        secure
        error={showError && !pwOk ? 'Password must be at least 6 characters.' : null}
      />
      <TextField
        label="Confirm new password"
        placeholder="Re-enter new password"
        value={formData.confirmPassword}
        onChangeText={update('confirmPassword')}
        secure
        error={showError && !pwMatch ? 'Passwords do not match' : null}
      />
    </View>
  );
}
