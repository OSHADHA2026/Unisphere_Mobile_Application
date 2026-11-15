import { Stack } from "expo-router";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TutorsLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.bg },
            }}
        >
            {/* The main list page */}
            <Stack.Screen name="index" />

            {/* 1. Add the setup screen here */}
            <Stack.Screen 
                name="setup" 
                options={{ 
                    presentation: 'modal',
                    animation: 'slide_from_bottom' 
                }} 
            />

            {/* 2. Add the dynamic tutor profile page */}
            <Stack.Screen name="[id]" />

            <Stack.Screen name="settings" />
            
        </Stack>
    );
}