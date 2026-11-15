import React from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { layout } from '@/constants/theme';

import ActionBar from './ActionBar';
import Button from './Button';
import Screen from './Screen';
import ScreenHeader from './ScreenHeader';

type FormScreenProps = {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
  submitDisabled?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  /** Extra buttons shown next to the submit button. */
  children: React.ReactNode;
};

/**
 * Page shell for create/edit forms: header with back button, scrollable
 * fields, and a sticky submit bar that stays above the keyboard.
 */
export default function FormScreen({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  submitting,
  submitDisabled,
  onBack,
  headerRight,
  children,
}: FormScreenProps) {
  return (
    <Screen header={<ScreenHeader title={title} subtitle={subtitle} onBack={onBack} right={headerRight} />}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: layout.screenPadding, gap: 18, paddingBottom: 32 }}
        >
          {children}
        </ScrollView>

        <ActionBar>
          <Button title={submitLabel} onPress={onSubmit} loading={submitting} disabled={submitDisabled} size="lg" />
        </ActionBar>
      </KeyboardAvoidingView>
    </Screen>
  );
}
