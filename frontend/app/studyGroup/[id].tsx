import React, { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Clock, MapPin, Users } from "lucide-react-native";
import axios from "axios";

import ActionBar from "@/components/common/ActionBar";
import AppText from "@/components/common/AppText";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import ImageGallery from "@/components/common/ImageGallery";
import InfoRow from "@/components/common/InfoRow";
import LoadingState from "@/components/common/LoadingState";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import Section from "@/components/common/Section";
import { layout } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

import { getCachedListItem } from "@/lib/cache";
import { queryKeys } from "@/lib/queryKeys";
import apiClient from "@/services/api";
import { refreshList } from "@/lib/queryClient";

export default function StudyGroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();
  const queryClient = useQueryClient();
  // Open instantly with the group the list already downloaded.
  const [seed] = useState(() =>
    getCachedListItem(queryClient, queryKeys.studyGroups, (g) => (g._id || g.id) === id),
  );
  const [group, setGroup] = useState<any>(seed ?? null);
  const [loading, setLoading] = useState(!seed);

  const fetchGroup = useCallback(async () => {
    try {
      const response = await apiClient.get(`/studyGroups/${id}`);

      const groupData =
        response.data?.data?.data || response.data?.data || response.data;

      setGroup(groupData);
    } catch (error) {
      console.error("Failed to fetch study group:", error);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchGroup();
      }
    }, [id, fetchGroup]),
  );

  const handleEdit = () => {
    router.push({
      pathname: "/studyGroup/create",
      params: { editId: String(id) },
    });
  };

  const handleJoin = async () => {
    try {
      const res = await apiClient.patch(`/studyGroups/${group._id}/join`);

      const response = res.data;

      if (!response.success) {
        Alert.alert("Notice", response.message || "Something went wrong");
        return;
      }

      setGroup(response.data);
      Alert.alert("Success", response.message || "Joined successfully!");
    } catch (error) {
      console.error("Join failed:", error);

      let message = "Something went wrong";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      Alert.alert("Error", message);
    }
  };

  const handleLeave = async () => {
    try {
      const res = await apiClient.delete(`/studyGroups/${group._id}/leave`);

      const response = res.data;

      if (!response.success) {
        Alert.alert("Notice", response.message || "Something went wrong");
        return;
      }

      setGroup(response.data);
      Alert.alert("Success", "You have left the study group.");
    } catch (error) {
      console.error("Leave failed:", error);
      Alert.alert("Error", "Failed to leave the study group.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Session", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/studyGroups/${id}`);
            refreshList("studyGroups");
            router.dismissTo("/studyGroup");
          } catch (error) {
            console.error("Failed to delete study group:", error);
            Alert.alert("Error", "Failed to delete session.");
          }
        },
      },
    ]);
  };

  const parseLearningGoals = (goals: any): string[] => {
    if (!goals) return [];

    try {
      let parsed = goals;

      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (Array.isArray(parsed)) {
        return parsed.map((goal) =>
          String(goal)
            .replace(/^\[+|\]+$/g, "")
            .replace(/^"+|"+$/g, "")
            .trim(),
        );
      }

      return [];
    } catch {
      return String(goals)
        .replace(/^\[+|\]+$/g, "")
        .replace(/"+/g, "")
        .split(",")
        .map((goal) => goal.trim())
        .filter(Boolean);
    }
  };

  const header = <ScreenHeader title="Study group" />;

  if (loading) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  if (!group) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={Users}
          title="Study group not found"
          message="This session may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const learningGoals = parseLearningGoals(group.learningGoals);

  const isOwner =
    String(group.createdBy) === String(userId) ||
    String(group.userId) === String(userId) ||
    String(group.createdBy?._id) === String(userId);

  const isJoined = group.joinedUsers?.includes(userId);

  return (
    <Screen
      header={header}
      bottomBar={
        <ActionBar>
          {isOwner ? (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button title="Edit session" variant="secondary" onPress={handleEdit} style={{ flex: 1 }} />
              <Button title="Remove" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
            </View>
          ) : isJoined ? (
            <Button title="Leave study group" icon={Users} variant="dangerSoft" onPress={handleLeave} size="lg" />
          ) : (
            <Button title="Join study group" icon={Users} onPress={handleJoin} size="lg" />
          )}
        </ActionBar>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <ImageGallery images={[group.image]} fallbackIcon={Users} badge={<Badge label={group.tag || "GENERAL"} />} />

        <View style={{ gap: 10 }}>
          <Badge label="Open" tone="success" />
          <AppText variant="display">{group.subject || "Untitled Study Group"}</AppText>
        </View>

        <Card style={{ gap: 16 }}>
          <InfoRow icon={MapPin} label="Location" value={group.location || "No location added"} />
          <InfoRow icon={Clock} label="Time" value={group.time || "No time added"} />
          <InfoRow
            icon={Users}
            label="Participants"
            value={`${group.participants || 0} / ${group.maxParticipants || 0}`}
          />
        </Card>

        {learningGoals.length > 0 ? (
          <Section title="Learning goals">
            <View style={{ gap: 6 }}>
              {learningGoals.map((goal, index) => (
                <AppText key={index} variant="body" tone="secondary">
                  • {goal}
                </AppText>
              ))}
            </View>
          </Section>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
