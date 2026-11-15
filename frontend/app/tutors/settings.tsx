import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldOff, Trash2 } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Screen from "@/components/common/Screen";
import ScreenHeader from "@/components/common/ScreenHeader";
import { layout } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import apiClient from "@/services/api";
import { refreshList } from "@/lib/queryClient";

export default function SettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    if (!id) return Alert.alert("Error", "Tutor ID missing");

    setLoading(true);
    try {
      await apiClient.patch(`/tutors/${id}/status`, { isOnline: false });
      Alert.alert("Success", "Status updated successfully.");
      refreshList("tutors");
      router.dismissTo("/tutors");
    } catch (error: any) {
      console.log("Error Detail:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!id) return Alert.alert("Error", "Tutor ID missing");

    Alert.alert("Delete Profile", "Are you sure? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await apiClient.delete(`/tutors/${id}`);
            Alert.alert("Deleted", "Your profile has been removed.");
            refreshList("tutors");
      router.dismissTo("/tutors");
          } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Error", "Failed to delete account.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const iconCircle = (background: string, children: React.ReactNode) => (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );

  return (
    <Screen header={<ScreenHeader title="Settings" />}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 16, paddingBottom: 32 }}
      >
        <View style={{ gap: 4 }}>
          <AppText variant="overline" tone="primary">
            Account management
          </AppText>
          <AppText variant="display">Settings &amp; safety</AppText>
        </View>

        <Card style={{ gap: 12 }}>
          {iconCircle(colors.primaryLight, <ShieldOff size={22} color={colors.primary} />)}
          <AppText variant="heading">Switch status?</AppText>
          <AppText variant="body" tone="secondary">
            Toggling this will change your visibility in search results.
          </AppText>
          <Button title="Switch status" onPress={handleToggleStatus} loading={loading} />
          <Button title="Cancel" variant="secondary" onPress={() => router.back()} disabled={loading} />
        </Card>

        <Card style={{ gap: 12 }}>
          {iconCircle(colors.dangerLight, <Trash2 size={22} color={colors.danger} />)}
          <AppText variant="heading">Close account?</AppText>
          <AppText variant="body" tone="secondary">
            Deleting your tutor profile removes it for everyone and cannot be undone.
          </AppText>
          <Button title="Delete account" variant="danger" onPress={handleDeleteAccount} disabled={loading} />
          <Button title="Keep profile" variant="secondary" onPress={() => router.back()} disabled={loading} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
