import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/components/Brand";
import { Button } from "@/components/Button";
import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  return (
    <LinearGradient
      colors={["#F1ECDF", "#E8E0CC", "#D5DCC0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}
    >
      <View style={styles.brandRow}>
        <Brand size="sm" />
      </View>

      <View style={styles.middle}>
        <Text style={styles.eyebrow}>Welcome to</Text>
        <Brand size="xl" />
        <Text style={styles.tagline}>Not abandoned, just parked.</Text>
        <Text style={styles.copy}>
          A calm, judgment-free space to keep the ideas and hobbies you love —
          ready for whenever you come back to them.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Sign in"
          variant="primary"
          size="lg"
          onPress={() => router.push("/sign-in")}
        />
        <Button
          label="Create an account"
          variant="secondary"
          size="lg"
          onPress={() => router.push("/register")}
        />
        <Text style={styles.footnote}>
          Your parked items live on this device.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  middle: {
    gap: 14,
    paddingVertical: 24,
  },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: c.textSecondary,
  },
  tagline: {
    fontFamily: fontFamily.serif,
    fontSize: 22,
    color: c.textPrimary,
    fontStyle: "italic",
    marginTop: 4,
  },
  copy: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    lineHeight: 22,
    color: c.textSecondary,
    marginTop: 14,
    maxWidth: 360,
  },
  actions: {
    gap: 12,
  },
  footnote: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: c.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
});
