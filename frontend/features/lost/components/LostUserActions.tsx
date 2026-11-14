import React, { useEffect, useState } from "react";
import { Alert, Linking, View } from "react-native";
import { ShieldCheck, User as UserIcon } from "lucide-react-native";

import AppText from "@/components/common/AppText";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import RemoteImage from "@/components/common/RemoteImage";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useUser";

type Props = {
  itemId: string;
  category: string;
  ownerid: string;
};

type User = {
  _id: string;
  name?: string;
  phone?: string;
  image?: string;
};

export default function LostUserActions({ itemId, category, ownerid }: Props) {
  const { getuserById } = useUser();
  const { colors } = useTheme();

  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  useEffect(() => {
    if (!ownerid) return;

    const fetchOwner = async () => {
      try {
        setLoadingOwner(true);

        const user = await getuserById(ownerid);
        setCreatedUser(user);
      } catch (error) {

        setCreatedUser(null);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchOwner();
  }, [ownerid]);

  const handleCall = () => {
    if (!createdUser?.phone) {
      Alert.alert("Error", "Phone number not available");
      return;
    }

    Alert.alert("Contact Finder", `Call ${createdUser.phone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          Linking.openURL(`tel:${createdUser.phone}`);
        },
      },
    ]);
  };

  return (
    <View style={{ gap: 12 }}>
      <Card style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <RemoteImage
            uri={createdUser?.image}
            fallbackIcon={UserIcon}
            style={{ width: 48, height: 48, borderRadius: 24, overflow: "hidden" }}
          />
          <View>
            <AppText variant="caption" tone="muted">
              Found by
            </AppText>
            <AppText variant="subheading">{loadingOwner ? "Loading..." : createdUser?.name || "Unknown User"}</AppText>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <AppText variant="caption" tone="muted">
              Item
            </AppText>
            <AppText variant="caption" style={{ fontWeight: "700", flexShrink: 1 }} numberOfLines={1}>
              {itemId}
            </AppText>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <AppText variant="caption" tone="muted">
              Category
            </AppText>
            <AppText variant="caption" tone="primary" style={{ fontWeight: "700" }}>
              {category}
            </AppText>
          </View>
        </View>

        <Button title="Claim / contact finder" onPress={handleCall} size="lg" />
      </Card>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.primaryLight,
        }}
      >
        <ShieldCheck size={20} color={colors.primary} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="overline" tone="primary">
            Security note
          </AppText>
          <AppText variant="caption" tone="secondary">
            To prevent fraudulent claims, all high-value items require a formal identity check and specific descriptive
            verification.
          </AppText>
        </View>
      </View>
    </View>
  );
}
