import React, { useState } from "react";
import { Alert, Image, Platform, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, X } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import Button from "@/components/common/Button";
import CheckRow from "@/components/common/CheckRow";
import FormScreen from "@/components/common/FormScreen";
import OptionChips from "@/components/common/OptionChips";
import TextField from "@/components/common/TextField";
import SuccessModal from "@/components/feedback/SuccessModal";
import { useTheme } from "@/context/ThemeContext";
import DateField from "@/features/housing/components/DateField";
import apiClient from "@/services/api";

const ROOM_TYPES = ["Single", "Shared", "Apartment"] as const;
const AVAILABILITY = ["Available", "Not Available"] as const;

const blurActiveElement = () => {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }
};

type FormState = {
  title: string;
  description: string;
  address: string;
  roomType: string;
  rentPrice: string;
  deposit: string;
  availableFrom: string;
  availabilityStatus: string;
  furnished: boolean;
  wifi: boolean;
  parking: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

type FormErrors = Partial<Record<keyof FormState | "images", string>>;

type FormTextKey = Exclude<keyof FormState, "furnished" | "wifi" | "parking">;
type FeatureKey = "furnished" | "wifi" | "parking";

export default function CreateHousing() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const { colors } = useTheme();

  const isEditing = !!editId;

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    address: "",
    roomType: "Single",
    rentPrice: "",
    deposit: "",
    availableFrom: "",
    availabilityStatus: "Available",
    furnished: false,
    wifi: false,
    parking: false,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickImage = async () => {
    try {
      setIsPicking(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        const newImages = result.assets
          .map((asset) =>
            asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
          )
          .filter(Boolean);

        setImages((prevImages) => [...prevImages, ...newImages]);
        clearError("images");
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick images");
    } finally {
      setIsPicking(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updated = prevImages.filter((_, i) => i !== index);

      if (updated.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: "Please upload at least one room photo.",
        }));
      }

      return updated;
    });
  };

  React.useEffect(() => {
    if (!isEditing) return;

    const loadHousingDetails = async () => {
      try {
        const {
          data: { success, data: h },
        } = await apiClient.get(`/housing/${editId}`);

        if (success) {
          setForm({
            title: h.title || "",
            description: h.description || "",
            address: h.address || "",
            roomType: h.roomType || "Single",
            rentPrice: h.rentPrice?.toString() || "",
            deposit: h.deposit?.toString() || "",
            availableFrom: h.availableFrom
              ? new Date(h.availableFrom).toLocaleDateString()
              : "",
            availabilityStatus: h.availabilityStatus || "Available",
            furnished: h.furnished || false,
            wifi: h.wifi || false,
            parking: h.parking || false,
            contactName: h.contactName || "",
            contactPhone: h.contactPhone || "",
            contactEmail: h.contactEmail || "",
          });

          if (h.images) {
            setImages(h.images);
          }
        }
      } catch (error) {
        Alert.alert("Error", "Could not load housing details.");
      }
    };

    loadHousingDetails();
  }, [editId, isEditing]);

  const updateForm = (field: FormTextKey, text: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: text,
    }));

    clearError(field);
  };

  const toggleFeature = (feature: FeatureKey) => {
    setForm((prevForm) => ({
      ...prevForm,
      [feature]: !prevForm[feature],
    }));
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    setErrors({});

    const localErrors: FormErrors = {};

    if (!form.title.trim()) {
      localErrors.title = "Please enter a room title.";
    }

    if (!form.address.trim()) {
      localErrors.address = "Please enter an address/location.";
    }

    if (!form.rentPrice.trim()) {
      localErrors.rentPrice = "Please enter a rent price.";
    }

    if (!form.contactName.trim()) {
      localErrors.contactName = "Please enter your name.";
    }

    if (!form.contactPhone.trim() && !form.contactEmail.trim()) {
      localErrors.contactPhone = "Please enter phone or email.";
      localErrors.contactEmail = "Please enter phone or email.";
    }

    if (images.length === 0) {
      localErrors.images = "Please upload at least one room photo.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      setIsPublishing(true);

      const payload = {
        title: form.title,
        description: form.description,
        address: form.address,
        roomType: form.roomType,
        rentPrice: parseFloat(form.rentPrice),
        deposit: form.deposit ? parseFloat(form.deposit) : undefined,
        availableFrom: form.availableFrom
          ? new Date(form.availableFrom)
          : undefined,
        availabilityStatus: form.availabilityStatus,
        furnished: form.furnished,
        wifi: form.wifi,
        parking: form.parking,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        images,
      };

      const { data } = isEditing
        ? await apiClient.put(`/housing/${editId}`, payload)
        : await apiClient.post("/housing", payload);

      if (data.success) {
        setSuccessMessage(
          isEditing
            ? "Listing updated successfully!"
            : "Listing posted successfully!"
        );

        blurActiveElement();
        setShowSuccessModal(true);

        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "title" ||
            err.field === "description" ||
            err.field === "address" ||
            err.field === "roomType" ||
            err.field === "rentPrice" ||
            err.field === "deposit" ||
            err.field === "availableFrom" ||
            err.field === "availabilityStatus" ||
            err.field === "contactName" ||
            err.field === "contactPhone" ||
            err.field === "contactEmail" ||
            err.field === "images"
          ) {
            fieldErrors[err.field as keyof FormErrors] = err.message;
          }
        });

        setErrors(fieldErrors);
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred during publishing"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const closeSuccessModal = () => {
    blurActiveElement();
    setShowSuccessModal(false);
    router.back();
  };

  const sectionTitle = (title: string) => (
    <AppText variant="heading" style={{ marginTop: 8 }}>
      {title}
    </AppText>
  );

  return (
    <FormScreen
      title={isEditing ? "Edit room" : "Post a room"}
      subtitle={isEditing ? "Edit listing" : "Housing submission"}
      submitLabel={isEditing ? "Update listing" : "Post listing"}
      onSubmit={handlePublish}
      submitting={isPublishing}
    >
      {sectionTitle("Basic information")}
      <TextField
        label="Room title"
        placeholder="e.g. Single room near campus"
        value={form.title}
        onChangeText={(text) => updateForm("title", text)}
        error={errors.title}
        required
      />
      <TextField
        label="Description"
        placeholder="Tell more about the room..."
        value={form.description}
        onChangeText={(text) => updateForm("description", text)}
        multiline
        error={errors.description}
      />
      <TextField
        label="Address / location"
        placeholder="Street address, area, near landmarks"
        value={form.address}
        onChangeText={(text) => updateForm("address", text)}
        error={errors.address}
        required
        right={<MapPin size={20} color={colors.primary} />}
      />
      <OptionChips
        label="Room type"
        options={ROOM_TYPES}
        value={form.roomType}
        onChange={(val) => updateForm("roomType", val)}
        error={errors.roomType}
      />

      {sectionTitle("Pricing")}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <TextField
            label="Rent price"
            placeholder="Amount"
            value={form.rentPrice}
            onChangeText={(text) => updateForm("rentPrice", text)}
            keyboardType="numeric"
            error={errors.rentPrice}
            required
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextField
            label="Deposit"
            placeholder="Optional"
            value={form.deposit}
            onChangeText={(text) => updateForm("deposit", text)}
            keyboardType="numeric"
            error={errors.deposit}
          />
        </View>
      </View>

      {sectionTitle("Availability")}
      <DateField
        label="Available from"
        value={form.availableFrom}
        onChange={(text) => updateForm("availableFrom", text)}
        error={errors.availableFrom}
      />
      <OptionChips
        label="Availability status"
        options={AVAILABILITY}
        value={form.availabilityStatus}
        onChange={(val) => updateForm("availabilityStatus", val)}
        error={errors.availabilityStatus}
      />

      {sectionTitle("Features")}
      <View style={{ gap: 10 }}>
        <CheckRow label="Furnished" value={form.furnished} onChange={() => toggleFeature("furnished")} />
        <CheckRow label="WiFi available" value={form.wifi} onChange={() => toggleFeature("wifi")} />
        <CheckRow label="Parking available" value={form.parking} onChange={() => toggleFeature("parking")} />
      </View>

      {sectionTitle("Room photos")}
      <View style={{ gap: 12 }}>
        <Button
          title={isPicking ? "Picking..." : images.length > 0 ? "Add more photos" : "Upload photos"}
          variant="ghost"
          onPress={pickImage}
          disabled={isPicking}
        />
        {errors.images ? (
          <AppText variant="caption" tone="danger">
            {errors.images}
          </AppText>
        ) : null}

        {images.length > 0 ? (
          <View style={{ gap: 8 }}>
            <AppText variant="caption" tone="muted">
              Uploaded photos ({images.length})
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {images.map((img, idx) => (
                <View key={`${idx}-${img.slice(-12)}`}>
                  <Image source={{ uri: img }} style={{ width: 84, height: 84, borderRadius: 14 }} />
                  <Pressable
                    accessibilityLabel="Remove photo"
                    onPress={() => removeImage(idx)}
                    hitSlop={6}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.danger,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={14} color="#fff" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      {sectionTitle("Contact information")}
      <TextField
        label="Your name"
        placeholder="Full name"
        value={form.contactName}
        onChangeText={(text) => updateForm("contactName", text)}
        error={errors.contactName}
        required
      />
      <TextField
        label="Phone number"
        placeholder="Your phone"
        value={form.contactPhone}
        onChangeText={(text) => updateForm("contactPhone", text)}
        keyboardType="phone-pad"
        error={errors.contactPhone}
      />
      <TextField
        label="Email address"
        placeholder="Your email"
        value={form.contactEmail}
        onChangeText={(text) => updateForm("contactEmail", text)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.contactEmail}
      />

      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        actionLabel="Done"
        onClose={closeSuccessModal}
      />
    </FormScreen>
  );
}
