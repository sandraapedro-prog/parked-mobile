import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

type Option<T extends string> = {
  value: T;
  label: string;
  color?: string;
};

type Props<T extends string> = {
  label?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  allowClear?: boolean;
};

const c = colors.light;

export function SelectChips<T extends string>({
  label,
  options,
  value,
  onChange,
  allowClear = true,
}: Props<T>) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const tint = opt.color ?? "#EAE6DB";
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                if (selected && allowClear) onChange(undefined);
                else onChange(opt.value);
              }}
              style={({ pressed }) => [
                styles.chip,
                selected
                  ? { backgroundColor: tint, borderColor: tint }
                  : { backgroundColor: "#FFFFFF", borderColor: c.border },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && { color: c.textPrimary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textPrimary,
  },
});
