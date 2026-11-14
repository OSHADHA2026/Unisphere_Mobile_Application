import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import { layout } from "@/constants/theme";
import StudyGroupCard from "@/features/studyGroup/components/StudyGroupCard";
import { useUser } from "@/hooks/useUser";
import apiClient from "@/services/api";

export default function JoinedStudyGroups() {
  const router = useRouter();
  const { userId } = useUser();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await apiClient.get("/studyGroups");
        const data = response.data.data || response.data;

        if (Array.isArray(data)) {
          const joined = data.filter((group: any) =>
            group.joinedUsers?.includes(userId) || group.createdBy === userId
          );
          setGroups(joined);
        }
      } catch (error) {
        console.error("Error fetching joined groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedGroups();
  }, [userId]);

  return (
    <Screen header={<ScreenHeader title="My study groups" />}>
      {loading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(group) => group._id || group.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 32, flexGrow: 1 }}
          ListHeaderComponent={
            groups.length > 0 ? (
              <AppText variant="overline" tone="muted" style={{ marginBottom: 12 }}>
                Joined groups ({groups.length})
              </AppText>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon={Users}
              title="No groups joined"
              message="You haven't joined any study groups yet. Find your peers and start collaborating!"
              actionLabel="Browse groups"
              onAction={() => router.push("/studyGroup")}
            />
          }
          renderItem={({ item }) => (
            <StudyGroupCard group={item} onPress={() => router.push(`/studyGroup/${item._id || item.id}`)} />
          )}
        />
      )}
    </Screen>
  );
}
