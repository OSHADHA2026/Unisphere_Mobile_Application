import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function LostLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[itemId]" />
      <Stack.Screen name="create" options={{ presentation: "modal" }} />
    </Stack>
  );
}