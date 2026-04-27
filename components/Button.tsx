import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "warning";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  size?: "md" | "lg";
};

const c = colors.light;

const VARIANT: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: c.textPrimary, fg: "#FFFFFF" },
  secondary: { bg: "#FFFFFF", fg: c.textPrimary, border: c.border },
  ghost: { bg: "transparent", fg: c.textPrimary },
  destructive: { bg: c.destructive, fg: "#FFFFFF" },
  warning: { bg: c.warning, fg: c.textPrimary },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
  size = "md",
}: Props) {
  const v = VARIANT[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === "lg" && styles.lg,
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? "transparent",
          borderWidth: v.border ? 1 : 0,
        },
        (disabled || loading) && { opacity: 0.55 },
        pressed && !disabled && { opacity: 0.85 },
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <Text
          style={[
            styles.label,
            size === "lg" && styles.labelLg,
            { color: v.fg },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  lg: {
    paddingVertical: 18,
    minHeight: 58,
  },
  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  labelLg: {
    fontSize: 16,
    letterSpacing: 0.4,
  },
});
