import React, { useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen, Phone, User, UserX } from "lucide-react-native";

import ActionBar from "@/components/common/ActionBar";
import AppText from "@/components/common/AppText";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import InfoRow from "@/components/common/InfoRow";
import LoadingState from "@/components/common/LoadingState";
import RemoteImage from "@/components/common/RemoteImage";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import Section from "@/components/common/Section";
import { layout } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

import { getCachedListItem } from "@/lib/cache";
import { queryKeys } from "@/lib/queryKeys";
import apiClient from "@/services/api";
import { refreshList } from "@/lib/queryClient";

export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { userId } = useUser();
  const { colors } = useTheme();

  const queryClient = useQueryClient();
  // Open instantly with the tutor the list already downloaded.
  const [seed] = useState(() => getCachedListItem(queryClient, queryKeys.tutors, (t) => t._id === id));
  const [tutor, setTutor] = useState<any>(seed ?? null);
  const [loading, setLoading] = useState(!seed);
  const [showContact, setShowContact] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTutorDetails = async () => {
        try {
          const response = await apiClient.get(`/tutors/${id}`);
          setTutor(response.data.data || response.data);
        } catch (error) {
          console.error("Backend Fetch Error:", error);
        } finally {
          setLoading(false);
        }
      };

      if (id) fetchTutorDetails();
    }, [id])
  );

  const handleToggleStatus = async () => {
    if (!id || !tutor) return Alert.alert("Error", "Tutor ID missing");

    const newStatus = !tutor.isOnline;
    setLoading(true);
    try {
      await apiClient.patch(`/tutors/${id}/status`, { isOnline: newStatus });

      const response = await apiClient.get(`/tutors/${id}`);
      setTutor(response.data.data || response.data);

      Alert.alert("Success", `Status updated to ${newStatus ? "Online" : "Offline"}`);
    } catch (error: any) {
      console.log("Error Detail:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Profile", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            const response = await apiClient.delete(`/tutors/${id}`);

            console.log("Delete success:", response.data);

            Alert.alert("Success", "Tutor profile deleted successfully.", [
              {
                text: "OK",
                onPress: () => {
                  refreshList("tutors");
                  router.dismissTo("/tutors");
                },
              },
            ]);
          } catch (error: any) {
            console.log("Delete error:", error.response?.data || error.message);

            const backendMessage =
              error.response?.data?.message ||
              "Failed to delete profile. Please try again.";

            Alert.alert("Error", backendMessage);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const header = <ScreenHeader title="Tutor profile" />;

  if (loading) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  if (!tutor) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={UserX}
          title="Tutor not found"
          message="This profile may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isOwner =
    tutor.userId === userId || tutor.ownerId === userId || tutor.createdBy === userId || tutor._id === userId;

  const online = tutor.isOnline !== false;

  return (
    <Screen
      header={header}
      bottomBar={
        <ActionBar>
          {isOwner ? (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                title={tutor.isOnline ? "Set offline" : "Set online"}
                variant="secondary"
                onPress={handleToggleStatus}
                style={{ flex: 1 }}
              />
              <Button title="Remove" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
            </View>
          ) : (
            <Button title="Book a session" icon={Phone} onPress={() => setShowContact(true)} size="lg" />
          )}
        </ActionBar>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <Card style={{ alignItems: "center", gap: 12, paddingVertical: 28 }}>
          <View>
            <RemoteImage
              uri={tutor.image}
              fallbackIcon={User}
              style={{ width: 104, height: 104, borderRadius: 52, overflow: "hidden" }}
            />
            <View
              style={{
                position: "absolute",
                right: 4,
                bottom: 4,
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: colors.white,
                backgroundColor: online ? colors.success : colors.borderLight,
              }}
            />
          </View>

          <AppText variant="title" center>
            {tutor.name}
          </AppText>
          <Badge label={online ? "Online" : "Offline"} tone={online ? "success" : "neutral"} />
          <AppText variant="title" tone="primary">
            {tutor.price}
            <AppText variant="caption" tone="muted">
              /hr
            </AppText>
          </AppText>
        </Card>

        <Card>
          <InfoRow icon={BookOpen} label="Subject" value={tutor.subject} />
        </Card>

        <Section title="About">
          <AppText variant="body" tone="secondary">
            {tutor.bio || `I am ${tutor.name}, specializing in ${tutor.subject}.`}
          </AppText>
        </Section>

        {showContact ? (
          <Card style={{ gap: 12 }}>
            <AppText variant="overline" tone="primary">
              Contact
            </AppText>
            <Button
              title={tutor.phone || "No number available"}
              icon={Phone}
              variant="ghost"
              onPress={() => tutor.phone && Linking.openURL(`tel:${tutor.phone}`)}
            />
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
