import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import FormScreen from "@/components/common/FormScreen";
import LoadingState from "@/components/common/LoadingState";
import OptionChips from "@/components/common/OptionChips";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import TextField from "@/components/common/TextField";
import apiClient from "@/services/api";

const CONDITIONS = ["New", "Used", "Like New"] as const;

export default function EditListingScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [condition, setCondition] = useState("Used");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/api/marketplace/${id}`);
        const data = response.data.data;
        setTitle(data.title);
        setPrice(data.price.toString());
        setDescription(data.description);
        setLocation(data.location || "");
        setContactNumber(data.contactNumber || "");
        setCondition(data.condition || "Used");
      } catch (error) { Alert.alert("Error", "Could not load data."); } 
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !price || !description || !location || !contactNumber) return Alert.alert("Wait", "Fill all fields.");
    try {
      setSaving(true);
      await apiClient.put(`/api/marketplace/${id}`, { title, price, description, location, contactNumber, condition });
      router.back();
    } catch (error) { Alert.alert("Error", "Update failed."); } 
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <Screen header={<ScreenHeader title="Edit listing" />}>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <FormScreen title="Edit listing" submitLabel="Save changes" onSubmit={handleUpdate} submitting={saving}>
      <TextField label="Title" placeholder="Title" value={title} onChangeText={setTitle} required />
      <TextField
        label="Price ($)"
        placeholder="0"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        required
      />
      <OptionChips label="Condition" options={CONDITIONS} value={condition} onChange={setCondition} />
      <TextField
        label="Contact number"
        placeholder="Contact number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
        required
      />
      <TextField label="Location" placeholder="Location" value={location} onChangeText={setLocation} required />
      <TextField
        label="Description"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        required
      />
    </FormScreen>
  );
}
