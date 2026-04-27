import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
};

const SIZE_MAP = {
  sm: 22,
  md: 32,
  lg: 44,
  xl: 64,
} as const;

export function Brand({ size = "md", color = colors.light.textPrimary }: Props) {
  const fontSize = SIZE_MAP[size];
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.text,
          { fontSize, color, lineHeight: fontSize * 1.05 },
        ]}
      >
        PARKED
      </Text>
      <Text
        style={[
          styles.dot,
          { fontSize, color, lineHeight: fontSize * 1.05 },
        ]}
      >
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  text: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  dot: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    color: "#AECC57",
  },
});
