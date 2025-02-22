import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import React from "react";
import TopBar from "../../components/TopBar"; // Adjust path as needed

export default function RootLayout() {
 
  return (
    <View style={{ flex: 1 }}>
      {/* Top Bar */}
      <TopBar />
      {/* Screens */}
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}
