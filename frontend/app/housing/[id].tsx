import React, { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, Car, Home, HomeIcon, Mail, MapPin, Phone, Wallet, Wifi } from "lucide-react-native";

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
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

import { getCachedListItem } from "@/lib/cache";
import { queryKeys } from "@/lib/queryKeys";
import apiClient from "@/services/api";
import { refreshList } from "@/lib/queryClient";

interface HousingDetail {
  id: string;
  title: string;
  description: string;
  address: string;
  roomType: string;
  rentPrice: number;
  deposit?: number;
  availableFrom?: string;
  availabilityStatus: string;
  furnished: boolean;
  wifi: boolean;
  parking: boolean;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  postedBy: string;
  isMine: boolean;
}

const toHousingDetail = (h: any, fallbackId: string, userId?: string): HousingDetail => {
  const postedBy = typeof h.postedBy === "object" ? h.postedBy?._id : h.postedBy;

  return {
    id: typeof h._id === "string" ? h._id : typeof h.id === "string" ? h.id : fallbackId,
    title: h.title,
    description: h.description,
    address: h.address,
    roomType: h.roomType,
    rentPrice: h.rentPrice,
    deposit: h.deposit,
    availableFrom: h.availableFrom,
    availabilityStatus: h.availabilityStatus,
    furnished: h.furnished,
    wifi: h.wifi,
    parking: h.parking,
    images: h.images || [],
    contactName: h.contactName,
    contactPhone: h.contactPhone,
    contactEmail: h.contactEmail,
    postedBy,
    isMine: postedBy === userId,
  };
};

export default function HousingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const housingId = typeof params.id === "string" ? params.id : undefined;

  const { userId } = useUser();
  const { colors } = useTheme();

  const queryClient = useQueryClient();
  // Open instantly with the listing the list already downloaded.
  const [seed] = useState(() =>
    getCachedListItem(queryClient, queryKeys.housings, (h) => h.id === housingId)?.raw,
  );
  const [housing, setHousing] = useState<HousingDetail | null>(
    seed && housingId ? toHousingDetail(seed, housingId, userId) : null,
  );
  const [loading, setLoading] = useState(!seed);
  const [hasFetched, setHasFetched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!housingId) return;

    (async () => {
      try {
        if (!seed) setLoading(true);
        setNotFound(false);
        setHasFetched(false);

        const { data } = await apiClient.get(`/housing/${housingId}`);

        if (data.success && data.data) {
          setHousing(toHousingDetail(data.data, housingId, userId));

          setNotFound(false);
        } else {
          setHousing(null);
          setNotFound(true);
        }
      } catch (error) {
        setHousing(null);
        setNotFound(true);
        Alert.alert("Error", "Could not load housing details.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [housingId, userId]);

  const header = <ScreenHeader title="Housing details" />;

  if (!housing && (notFound || hasFetched)) {
    return (
      <Screen header={header}>
        <EmptyState
          icon={HomeIcon}
          title="Listing not found"
          message="This listing may have been removed."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  if (loading || !housing) {
    return (
      <Screen header={header}>
        <LoadingState />
      </Screen>
    );
  }

  const handleContact = (type: "phone" | "email") => {
    if (type === "phone" && housing.contactPhone) {
      Linking.openURL(`tel:${housing.contactPhone}`);
    } else if (type === "email" && housing.contactEmail) {
      Linking.openURL(`mailto:${housing.contactEmail}`);
    }
  };

  const handleEdit = () => {
    router.push({ pathname: "/housing/create", params: { editId: housing.id } });
  };

  const handleDelete = () => {
    Alert.alert("Delete Listing", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/housing/${housing.id}`);
            refreshList("housings");
            router.dismissTo("/housing");
          } catch {
            Alert.alert("Error", "Failed to delete housing listing.");
          }
        },
      },
    ]);
  };

  const features = [
    { icon: Home, label: "Furnished", value: housing.furnished },
    { icon: Wifi, label: "WiFi", value: housing.wifi },
    { icon: Car, label: "Parking", value: housing.parking },
  ];

  const hasContact = !!(housing.contactPhone || housing.contactEmail);

  return (
    <Screen
      header={header}
      bottomBar={
        housing.isMine ? (
          <ActionBar>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button title="Edit listing" variant="secondary" onPress={handleEdit} style={{ flex: 1 }} />
              <Button title="Remove" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
            </View>
          </ActionBar>
        ) : hasContact ? (
          <ActionBar>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {housing.contactPhone ? (
                <Button title="Call" icon={Phone} onPress={() => handleContact("phone")} style={{ flex: 1 }} />
              ) : null}
              {housing.contactEmail ? (
                <Button
                  title="Email"
                  icon={Mail}
                  variant={housing.contactPhone ? "ghost" : "primary"}
                  onPress={() => handleContact("email")}
                  style={{ flex: 1 }}
                />
              ) : null}
            </View>
          </ActionBar>
        ) : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: layout.screenPadding, gap: 20, paddingBottom: 32 }}
      >
        <ImageGallery
          images={housing.images}
          fallbackIcon={HomeIcon}
          badge={<Badge label={housing.roomType} />}
        />

        <View style={{ gap: 10 }}>
          <Badge label={housing.availabilityStatus} tone="success" />
          <AppText variant="display">{housing.title}</AppText>
          <AppText variant="title" tone="primary">
            LKR {housing.rentPrice}
            <AppText variant="caption" tone="muted">
              {" "}
              /month
            </AppText>
          </AppText>
        </View>

        <Card style={{ gap: 16 }}>
          <InfoRow icon={MapPin} label="Address" value={housing.address} />
          {housing.availableFrom ? (
            <InfoRow
              icon={Calendar}
              label="Available from"
              value={new Date(housing.availableFrom).toLocaleDateString()}
            />
          ) : null}
          {housing.deposit ? <InfoRow icon={Wallet} label="Deposit" value={`LKR ${housing.deposit}`} /> : null}
        </Card>

        <Section title="About">
          <AppText variant="body" tone="secondary">
            {housing.description}
          </AppText>
        </Section>

        <Section title="Features">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {features.map((feature) => (
              <View
                key={feature.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: feature.value ? colors.primaryLight : colors.bgInput,
                }}
              >
                <feature.icon size={18} color={feature.value ? colors.primary : colors.textMuted} />
                <AppText
                  variant="bodyStrong"
                  style={{ fontSize: 13, color: feature.value ? colors.primary : colors.textMuted }}
                >
                  {feature.label}
                </AppText>
              </View>
            ))}
          </View>
        </Section>

        {!housing.isMine && housing.contactName ? (
          <Section title="Posted by">
            <Card>
              <AppText variant="subheading">{housing.contactName}</AppText>
            </Card>
          </Section>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
