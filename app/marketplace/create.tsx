import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import FormScreen from "@/components/common/FormScreen";
import OptionChips from "@/components/common/OptionChips";
import PhotoPicker from "@/components/common/PhotoPicker";
import TextField from "@/components/common/TextField";
import apiClient from "@/services/api";

const CONDITIONS = ["New", "Used", "Like New"] as const;

type FormErrors = {
  title?: string;
  price?: string;
  description?: string;
  location?: string;
  contactNumber?: string;
  condition?: string;
  image?: string;
};

export default function CreateListingScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [condition, setCondition] = useState("Used");
  const [image, setImage] = useState<string | null>(null);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      clearError("image");
    }
  };

  const handleSave = async () => {
    setErrors({});

    const localErrors: FormErrors = {};

    if (!title.trim()) localErrors.title = "Title is required.";
    if (!price.trim()) localErrors.price = "Price is required.";
    if (!description.trim())
      localErrors.description = "Description is required.";
    if (!location.trim()) localErrors.location = "Location is required.";
    if (!contactNumber.trim())
      localErrors.contactNumber = "Phone number is required.";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("price", price.trim());
      formData.append("description", description.trim());
      formData.append("location", location.trim());
      formData.append("contactNumber", contactNumber.trim());
      formData.append("condition", condition);

      if (image) {
        const filename = image.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      await apiClient.post("/api/marketplace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace("/marketplace");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "title" ||
            err.field === "price" ||
            err.field === "description" ||
            err.field === "location" ||
            err.field === "contactNumber" ||
            err.field === "condition" ||
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
        error.response?.data?.message || "Could not save listing."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="New listing" submitLabel="List now" onSubmit={handleSave} submitting={loading}>
      <PhotoPicker label="Photo" uri={image} onPress={pickImage} error={errors.image} height={220} hint="Add a photo" />

      <TextField
        label="Title"
        placeholder="What are you selling?"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          clearError("title");
        }}
        error={errors.title}
        required
      />
      <TextField
        label="Price ($)"
        placeholder="0"
        value={price}
        onChangeText={(text) => {
          setPrice(text);
          clearError("price");
        }}
        keyboardType="numeric"
        error={errors.price}
        required
      />
      <OptionChips
        label="Condition"
        options={CONDITIONS}
        value={condition}
        onChange={(c) => {
          setCondition(c);
          clearError("condition");
        }}
        error={errors.condition}
      />
      <TextField
        label="Phone number"
        placeholder="How buyers can reach you"
        value={contactNumber}
        onChangeText={(text) => {
          setContactNumber(text);
          clearError("contactNumber");
        }}
        keyboardType="phone-pad"
        error={errors.contactNumber}
        required
      />
      <TextField
        label="Location"
        placeholder="Where can it be picked up?"
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          clearError("location");
        }}
        error={errors.location}
        required
      />
      <TextField
        label="Description"
        placeholder="Describe the item..."
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          clearError("description");
        }}
        multiline
        error={errors.description}
        required
      />
    </FormScreen>
  );
}
