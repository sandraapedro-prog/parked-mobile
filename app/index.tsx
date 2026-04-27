import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function GateScreen() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1C1C1A" />
      </View>
    );
  }

  if (user) return <Redirect href="/(app)" />;
  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
});
