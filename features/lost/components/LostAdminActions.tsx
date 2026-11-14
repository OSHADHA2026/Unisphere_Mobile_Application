import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import AppText from "@/components/common/AppText";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

import { useDeleteLostItemMutation, useMarkItemAsResolvedMutation } from "../hooks/useLostItems";

type Props = {
  itemId: string;
};

export default function LostAdminActions({ itemId }: Props) {
  const deleteMutation = useDeleteLostItemMutation();
  const markResolvedMutation = useMarkItemAsResolvedMutation();

  const handleEdit = () => {
    router.push(`/lost/create?itemId=${itemId}`);
  };

  const handleMarkResolved = () => {
    Alert.alert(
      "Mark as Resolved",
      "Are you sure you want to mark this item as resolved?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Resolved",
          style: "default",
          onPress: async () => {
            try {
              await markResolvedMutation.mutateAsync(itemId);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to mark item as resolved.");
            }
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Item", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(itemId);
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to delete item.");
          }
        },
      },
    ]);
  };

  return (
    <Card style={{ gap: 12 }}>
      <AppText variant="overline" tone="muted" center>
        Manage your post
      </AppText>

      <Button title="Mark resolved" onPress={handleMarkResolved} />
      <Button title="Edit details" variant="secondary" onPress={handleEdit} />
      <Button title="Remove post" variant="dangerSoft" onPress={handleDelete} />
    </Card>
  );
}
