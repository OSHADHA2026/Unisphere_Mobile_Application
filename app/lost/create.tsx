import React from "react";
import { useLocalSearchParams } from "expo-router";

import FormScreen from "@/components/common/FormScreen";
import LoadingState from "@/components/common/LoadingState";
import OptionChips from "@/components/common/OptionChips";
import PhotoPicker from "@/components/common/PhotoPicker";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import SegmentedControl from "@/components/common/SegmentedControl";
import TextField from "@/components/common/TextField";
import { ReportType, useLostForm } from "@/features/lost/hooks/useCreateLostForm";

const CATEGORIES = ["Electronics", "Clothing", "Accessories", "Documents", "Other"] as const;

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: "LOST", label: "I lost something" },
  { value: "FOUND", label: "I found something" },
];

export default function CreateLostReportScreen() {
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();

  const { form, errors, updateField, pickImage, submitForm, isSubmitting, isEditMode, isLoadingItem } = useLostForm({
    itemId,
  });

  if (isLoadingItem) {
    return (
      <Screen header={<ScreenHeader title="Lost & Found" />}>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <FormScreen
      title={isEditMode ? "Edit report" : "New report"}
      subtitle="Lost & Found"
      submitLabel={isEditMode ? "Update report" : "Post report"}
      onSubmit={submitForm}
      submitting={isSubmitting}
    >
      <SegmentedControl
        label="Report type"
        options={REPORT_TYPES}
        value={form.reportType}
        onChange={(value) => updateField("reportType", value)}
      />

      <OptionChips
        label="Category"
        options={CATEGORIES}
        value={form.category}
        onChange={(category) => updateField("category", category)}
        error={errors.category}
      />

      <TextField
        label="Item title"
        placeholder="e.g. MacBook"
        value={form.title}
        onChangeText={(text) => updateField("title", text)}
        error={errors.title}
        required
      />

      <TextField
        label="Last seen / found location"
        placeholder="e.g. Library, second floor"
        value={form.location}
        onChangeText={(text) => updateField("location", text)}
        error={errors.location}
        required
      />

      <TextField
        label="Distinguishing features"
        placeholder="e.g. Contains a student ID and a $20 bill."
        value={form.features}
        onChangeText={(text) => updateField("features", text)}
        multiline
        error={errors.features}
        required
      />

      <PhotoPicker
        label="Photo reference"
        uri={form.image}
        onPress={pickImage}
        error={errors.image}
        hint="Upload or select an image"
      />
    </FormScreen>
  );
}
