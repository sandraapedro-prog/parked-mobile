import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

type Props = TextInputProps & {
  label?: string;
  hint?: string;
  multiline?: boolean;
};

const c = colors.light;

export function Input({ label, hint, style, multiline, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#A29A88"
        {...rest}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, style]}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fontFamily.mono,
    fontSize: 14,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  hint: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: c.textSecondary,
    marginTop: 2,
  },
});
