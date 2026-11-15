import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { queryClient } from "@/lib/queryClient";
import { checkForAppUpdates } from "@/utils/updateChecker";

SplashScreen.preventAutoHideAsync();

// Nested component so it can read theme from ThemeProvider
function ThemedApp() {
  const { isDark, colors } = useTheme();
  useEffect(() => {
    SplashScreen.hideAsync();
    checkForAppUpdates(false);
  }, []);

  return (
    <GluestackUIProvider mode={isDark ? "dark" : "light"}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="index" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="profile" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="events/index" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="tutors" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="lost" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="studyGroup" options={{ animation: "fade", animationDuration: 150 }} />
          <Stack.Screen name="events/create" options={{ presentation: "modal" }} />
        </Stack>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ThemedApp />
      </QueryClientProvider>
    </ThemeProvider>
  );
}