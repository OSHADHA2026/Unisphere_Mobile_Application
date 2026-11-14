import React from "react";
import { ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar, MapPin, Search, SearchX } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import ImageGallery from "@/components/common/ImageGallery";
import InfoRow from "@/components/common/InfoRow";
import LoadingState from "@/components/common/LoadingState";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import Section from "@/components/common/Section";
import { layout } from "@/constants/theme";
import LostAdminActions from "@/features/lost/components/LostAdminActions";
import LostUserActions from "@/features/lost/components/LostUserActions";
import { useLostItemDetailQuery } from "@/features/lost/hooks/useLostItems";
import { useUser } from "@/hooks/useUser";

export default function LostDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { userId } = useUser();

  const { data: item, isLoading, isError, error } = useLostItemDetailQuery(itemId as string);

  const header = <ScreenHeader title="Lost & Found" />;

  if (isLoading) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !item) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={SearchX}
          title="Failed to load item details"
          message={error instanceof Error ? error.message : "Something went wrong"}
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isOwner = userId === item.reporter;
  const isResolved = item.status?.toLowerCase() === "resolved";

  return (
    <Screen header={header}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <ImageGallery images={[item.image]} fallbackIcon={Search} badge={<Badge label={item.category || "General"} />} />

        <View style={{ gap: 10 }}>
          <Badge label={item.status || "Active"} tone={item.status?.toLowerCase() === "lost" ? "danger" : "success"} />
          <AppText variant="display">{item.title}</AppText>
        </View>

        <Card style={{ gap: 16 }}>
          <InfoRow icon={MapPin} label="Location" value={item.location} />
          <InfoRow icon={Calendar} label="Reported on" value={new Date(item.createdAt).toLocaleDateString()} />
        </Card>

        <Section title="Description">
          <AppText variant="body" tone="secondary">
            {item.features || item.description}
          </AppText>
        </Section>

        {!isResolved &&
          (isOwner ? (
            <LostAdminActions itemId={itemId as string} />
          ) : (
            <LostUserActions itemId={item.title} category={item.category || "General"} ownerid={item.reporter} />
          ))}
      </ScrollView>
    </Screen>
  );
}
