import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react-native';

import FormScreen from '@/components/common/FormScreen';
import FormError from '@/components/common/FormError';
import IconButton from '@/components/common/IconButton';
import LoadingState from '@/components/common/LoadingState';
import Screen from '@/components/common/Screen';
import ScreenHeader from '@/components/common/ScreenHeader';
import ConfirmDeleteModal from '@/components/feedback/ConfirmDeleteModal';
import { useTheme } from '@/context/ThemeContext';
import UpdateProfileForm from '@/features/profile/components/UpdateProfileForm';
import { useProfile } from '@/features/profile/hooks/useProfile';

export default function UpdateProfile() {
  const { colors } = useTheme();
  const { user, loading, isUpdating, errorMessage, successMessage, updateProfile, deleteAccount } = useProfile();
  const [showError, setShowError] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    major: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        year: user.year || '',
        major: user.major || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    const success = await updateProfile(formData);
    if (!success && !errorMessage) setShowError(true);
  };

  if (loading) {
    return (
      <Screen header={<ScreenHeader title="Edit profile" />}>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <FormScreen
      title="Edit profile"
      subtitle="Update your account details"
      submitLabel="Save changes"
      onSubmit={handleUpdate}
      submitting={isUpdating}
      headerRight={
        <IconButton
          icon={Trash2}
          label="Delete account"
          color={colors.danger}
          onPress={() => setDeleteModalVisible(true)}
        />
      }
    >
      <FormError message={successMessage} tone="success" />
      <UpdateProfileForm formData={formData} setFormData={setFormData} showError={showError} errorMessage={errorMessage} />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        title="Delete Account?"
        message="This will permanently remove your UniSphere account and all associated data. This action cannot be undone."
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={async () => {
          await deleteAccount();
          setDeleteModalVisible(false);
        }}
      />
    </FormScreen>
  );
}
