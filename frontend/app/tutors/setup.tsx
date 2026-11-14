import React, { useRef, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Camera, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import AppText from "@/components/common/AppText";
import FormScreen from "@/components/common/FormScreen";
import RemoteImage from "@/components/common/RemoteImage";
import TextField from "@/components/common/TextField";
import { useTheme } from "@/context/ThemeContext";
import apiClient from "@/services/api";

type FormErrors = {
  name?: string;
  fullName?: string;
  subject?: string;
  subjects?: string;
  price?: string;
  hourlyRate?: string;
  bio?: string;
  phone?: string;
  image?: string;
};

export default function ProfileSetup() {
  const router = useRouter();
  const { colors } = useTheme();
  const savingRef = useRef(false);

  const [fullName, setFullName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const getError = (...fields: (keyof FormErrors)[]) => {
    for (const field of fields) {
      if (errors[field]) return errors[field];
    }
    return undefined;
  };

  const pickImage = async () => {
    if (loading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      clearError("image");
    }
  };

  const handleSaveProfile = async () => {
    if (savingRef.current || loading) return;

    setErrors({});

    const localErrors: FormErrors = {};

    if (!fullName.trim()) localErrors.name = "Full name is required.";
    if (!hourlyRate.trim()) localErrors.price = "Hourly rate is required.";
    if (!subjects.trim()) localErrors.subject = "Subject is required.";
    if (!image) localErrors.image = "Profile photo is required.";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    savingRef.current = true;
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", fullName.trim());
      formData.append("subject", subjects.trim());
      formData.append("price", `Rs.${hourlyRate.trim()}`);
      formData.append("bio", bio.trim());
      formData.append("phone", phone.trim());
      formData.append("isOnline", "true");

      if (image) {
        const filename = image.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const response = await apiClient.post("/tutors/setup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Tutor profile created successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/tutors"),
          },
        ]);
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "name" ||
            err.field === "fullName" ||
            err.field === "subject" ||
            err.field === "subjects" ||
            err.field === "price" ||
            err.field === "hourlyRate" ||
            err.field === "bio" ||
            err.field === "phone" ||
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
        error.response?.data?.message || "Failed to save profile."
      );
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
  };

  const nameError = getError("name", "fullName");
  const priceError = getError("price", "hourlyRate");
  const subjectError = getError("subject", "subjects");

  return (
    <FormScreen
      title="Tutor profile"
      subtitle="Tell us about your academic expertise"
      submitLabel="Save profile"
      onSubmit={handleSaveProfile}
      submitting={loading}
    >
      <View style={{ alignItems: "center", gap: 8 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Choose profile photo" onPress={pickImage} disabled={loading}>
          <View>
            <RemoteImage
              uri={image}
              fallbackIcon={User}
              style={{
                width: 104,
                height: 104,
                borderRadius: 52,
                overflow: "hidden",
                borderWidth: errors.image ? 2 : 0,
                borderColor: colors.danger,
              }}
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: colors.primary,
                borderWidth: 3,
                borderColor: colors.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera size={16} color={colors.onPrimary} />
            </View>
          </View>
        </Pressable>
        <AppText variant="caption" tone={errors.image ? "danger" : "muted"}>
          {errors.image ?? (image ? "Tap to change photo" : "Add a profile photo")}
        </AppText>
      </View>

      <TextField
        label="Full name"
        placeholder="Dr. Julian Sterling"
        value={fullName}
        editable={!loading}
        onChangeText={(text) => {
          setFullName(text);
          clearError("name");
          clearError("fullName");
        }}
        error={nameError}
        required
      />
      <TextField
        label="Hourly rate (LKR)"
        placeholder="1000"
        value={hourlyRate}
        editable={!loading}
        keyboardType="numeric"
        onChangeText={(text) => {
          setHourlyRate(text);
          clearError("price");
          clearError("hourlyRate");
        }}
        error={priceError}
        required
      />
      <TextField
        label="Subjects"
        placeholder="Physics, Calculus"
        value={subjects}
        editable={!loading}
        onChangeText={(text) => {
          setSubjects(text);
          clearError("subject");
          clearError("subjects");
        }}
        error={subjectError}
        required
      />
      <TextField
        label="Bio & experience"
        placeholder="Share your background..."
        value={bio}
        editable={!loading}
        multiline
        onChangeText={(text) => {
          setBio(text);
          clearError("bio");
        }}
        error={errors.bio}
      />
      <TextField
        label="Contact number"
        placeholder="0771234567"
        value={phone}
        editable={!loading}
        keyboardType="phone-pad"
        onChangeText={(text) => {
          setPhone(text);
          clearError("phone");
        }}
        error={errors.phone}
      />
    </FormScreen>
  );
}
