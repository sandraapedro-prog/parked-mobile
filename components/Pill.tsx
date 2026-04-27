import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/lib/fonts";

type Props = {
  label: string;
  background: string;
  color?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md";
};

export function Pill({
  label,
  background,
  color = "#1C1C1A",
  variant = "solid",
  size = "sm",
}: Props) {
  const isSolid = variant === "solid";
  return (
    <View
      style={[
        styles.base,
        size === "md" && styles.md,
        isSolid
          ? { backgroundColor: background }
          : { borderColor: background, borderWidth: 1, backgroundColor: "transparent" },
      ]}
    >
      <Text style={[styles.label, size === "md" && styles.labelMd, { color }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  md: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  labelMd: {
    fontSize: 14,
  },
});
