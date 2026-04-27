import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1C1C1A" />
      </View>
    );
  }

  if (!user) return <Redirect href="/welcome" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F5F5F5" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="park"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="park-again/[id]"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="active"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="trash"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
});
