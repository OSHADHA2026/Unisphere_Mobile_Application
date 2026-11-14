import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import FormScreen from "@/components/common/FormScreen";
import LoadingState from "@/components/common/LoadingState";
import OptionChips from "@/components/common/OptionChips";
import PhotoPicker from "@/components/common/PhotoPicker";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import TextField from "@/components/common/TextField";
import apiClient from "@/services/api";

const TAGS = ["GENERAL", "MATHEMATICS", "COMPUTER SCIENCE"] as const;

type FormErrors = {
  subject?: string;
  location?: string;
  time?: string;
  maxParticipants?: string;
  tag?: string;
  learningGoals?: string;
  image?: string;
};

export default function CreateStudyGroup() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();

  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [tag, setTag] = useState("GENERAL");
  const [learningGoals, setLearningGoals] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [newImageSelected, setNewImageSelected] = useState(false);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const parseLearningGoalsForInput = (goals: any): string => {
    if (!goals) return "";

    try {
      let parsed = goals;

      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }

      return "";
    } catch {
      return String(goals)
        .replace(/^\[+|\]+$/g, "")
        .replace(/"+/g, "")
        .split(",")
        .map((goal) => goal.trim())
        .filter(Boolean)
        .join(", ");
    }
  };

  useEffect(() => {
    if (!editId) return;

    const fetchStudyGroupForEdit = async () => {
      try {
        setScreenLoading(true);

        const response = await apiClient.get(`/studyGroups/${editId}`);

        const data =
          response.data?.data?.data ||
          response.data?.data ||
          response.data;

        setSubject(data.subject || "");
        setLocation(data.location || "");
        setTime(data.time || "");
        setMaxParticipants(String(data.maxParticipants || ""));
        setTag(data.tag || "GENERAL");
        setLearningGoals(parseLearningGoalsForInput(data.learningGoals));
        setImage(data.image || null);
        setNewImageSelected(false);
      } catch (error) {
        console.error("Failed to load study group:", error);
        Alert.alert("Error", "Could not load study group details.");
      } finally {
        setScreenLoading(false);
      }
    };

    fetchStudyGroupForEdit();
  }, [editId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewImageSelected(true);
      clearError("image");
    }
  };

  const handleSave = async () => {
    setErrors({});

    const localErrors: FormErrors = {};

    if (!subject.trim()) localErrors.subject = "Subject is required.";
    if (!location.trim()) localErrors.location = "Location is required.";
    if (!time.trim()) localErrors.time = "Time is required.";
    if (!maxParticipants.trim()) {
      localErrors.maxParticipants = "Max participants is required.";
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (
      maxParticipants.trim() &&
      (Number.isNaN(maxParticipantsNumber) || maxParticipantsNumber < 1)
    ) {
      localErrors.maxParticipants =
        "Max participants must be a valid number greater than 0.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("subject", subject.trim());
      formData.append("location", location.trim());
      formData.append("time", time.trim());
      formData.append("maxParticipants", String(maxParticipantsNumber));
      formData.append("tag", tag);

      const goalsArray = learningGoals
          .split(",")
          .map((goal) => goal.trim())
          .filter(Boolean);

      formData.append("learningGoals", JSON.stringify(goalsArray));

      if (image && newImageSelected) {
        const filename = image.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      if (isEdit) {
        await apiClient.put(`/studyGroups/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Success", "Study group updated successfully.");
      } else {
        await apiClient.post("/studyGroups", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Success", "Study group created successfully.");
      }

      router.replace("/studyGroup");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "subject" ||
            err.field === "location" ||
            err.field === "time" ||
            err.field === "maxParticipants" ||
            err.field === "tag" ||
            err.field === "learningGoals" ||
            err.field === "image"
          ) {
            fieldErrors[err.field as keyof FormErrors] = err.message;
          }
        });

        setErrors(fieldErrors);
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          (isEdit
            ? "Could not update study group."
            : "Could not create study group.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <Screen header={<ScreenHeader title={isEdit ? "Edit study group" : "Create study group"} />}>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <FormScreen
      title={isEdit ? "Edit study group" : "Create study group"}
      submitLabel={isEdit ? "Update session" : "Create session"}
      onSubmit={handleSave}
      submitting={loading}
    >
      <PhotoPicker label="Cover photo" uri={image} onPress={pickImage} error={errors.image} height={200} />

      <TextField
        label="Subject"
        placeholder="e.g. Linear Algebra"
        value={subject}
        onChangeText={(text) => {
          setSubject(text);
          clearError("subject");
        }}
        error={errors.subject}
        required
      />
      <TextField
        label="Location"
        placeholder="e.g. Library, room 3"
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          clearError("location");
        }}
        error={errors.location}
        required
      />
      <TextField
        label="Time"
        placeholder="e.g. 2026-05-10T14:30:00Z"
        value={time}
        onChangeText={(text) => {
          setTime(text);
          clearError("time");
        }}
        error={errors.time}
        required
      />
      <TextField
        label="Max participants"
        placeholder="e.g. 10"
        value={maxParticipants}
        onChangeText={(text) => {
          setMaxParticipants(text);
          clearError("maxParticipants");
        }}
        keyboardType="numeric"
        error={errors.maxParticipants}
        required
      />
      <OptionChips
        label="Tag"
        options={TAGS}
        value={tag}
        onChange={(t) => {
          setTag(t);
          clearError("tag");
        }}
        error={errors.tag}
      />
      <TextField
        label="Learning goals"
        placeholder="Separate goals with commas"
        value={learningGoals}
        onChangeText={(text) => {
          setLearningGoals(text);
          clearError("learningGoals");
        }}
        multiline
        error={errors.learningGoals}
      />
    </FormScreen>
  );
}
