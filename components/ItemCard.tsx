import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Pill } from "@/components/Pill";
import colors from "@/constants/colors";
import { ParkedItem } from "@/constants/parked";
import { useItems } from "@/contexts/ItemsContext";
import { formatCheckIn, isDueSoon } from "@/lib/format";
import { fontFamily } from "@/lib/fonts";

type Props = {
  item: ParkedItem;
  onPress?: () => void;
  showUnparkedBadge?: boolean;
};

export function ItemCard({ item, onPress, showUnparkedBadge = false }: Props) {
  const c = colors.light;
  const { colorFor } = useItems();
  const due = isDueSoon(item.checkInDate);
  const checkInLabel = formatCheckIn(item.checkInDate);
  const categoryColor = colorFor(item.category);
  const typeColor = c.type[item.type];
  const isUnparked = showUnparkedBadge && !!item.unparkedAt;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.995 }], opacity: 0.92 },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Pill label={item.type} background={typeColor} color={c.textPrimary} />
      </View>

      {item.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        {item.category ? (
          <Pill
            label={item.category}
            background={categoryColor}
            color={c.textPrimary}
          />
        ) : null}
        {item.energy ? (
          <View style={styles.energyChip}>
            <View
              style={[
                styles.energyDot,
                { backgroundColor: c.energy[item.energy] },
              ]}
            />
            <Text style={styles.energyText}>{item.energy} energy</Text>
          </View>
        ) : null}
        {checkInLabel ? (
          <View
            style={[
              styles.dateChip,
              due && { backgroundColor: c.warning, borderColor: c.warning },
            ]}
          >
            <Feather
              name="calendar"
              size={12}
              color={c.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.dateText}>{checkInLabel}</Text>
          </View>
        ) : null}
        {isUnparked ? (
          <View style={styles.unparkedChip}>
            <Feather
              name="play"
              size={10}
              color={c.textPrimary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.unparkedText}>Unparked</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const c = colors.light;

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.card,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.serif,
    fontSize: 19,
    lineHeight: 24,
    color: c.textPrimary,
    fontWeight: "600",
  },
  notes: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    lineHeight: 19,
    color: c.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  energyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F2EEE3",
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  energyText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textPrimary,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textPrimary,
  },
  unparkedChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1C1C1A",
  },
  unparkedText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
});
