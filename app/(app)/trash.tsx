import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pill } from "@/components/Pill";
import colors from "@/constants/colors";
import { ParkedItem } from "@/constants/parked";
import { useItems } from "@/contexts/ItemsContext";
import { confirm } from "@/lib/confirm";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function daysLeft(deletedAtIso?: string) {
  if (!deletedAtIso) return null;
  const t = new Date(deletedAtIso).getTime();
  if (Number.isNaN(t)) return null;
  const remaining = SEVEN_DAYS_MS - (Date.now() - t);
  if (remaining <= 0) return 0;
  return Math.max(1, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

export default function TrashScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 24;
  const { deletedItems, restoreItem, permanentDeleteItem, colorFor } = useItems();

  const onPermanent = async (item: ParkedItem) => {
    const ok = await confirm({
      title: "Delete forever?",
      message: "This will remove it from your device permanently.",
      confirmLabel: "Delete forever",
      cancelLabel: "Keep",
      destructive: true,
    });
    if (!ok) return;
    await permanentDeleteItem(item.id);
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle}>Recently deleted</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.intro}>
        <Text style={styles.heading}>Just in case</Text>
        <Text style={styles.lede}>
          Deleted items live here for 7 days. After that, they're gently
          removed for good.
        </Text>
      </View>

      <FlatList
        data={deletedItems}
        keyExtractor={(it) => it.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad },
          deletedItems.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
        renderItem={({ item }) => {
          const left = daysLeft(item.deletedAt);
          const tint = c.type[item.type];
          const catColor = colorFor(item.category);
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Pill label={item.type} background={tint} color={c.textPrimary} />
              </View>

              {item.notes ? (
                <Text style={styles.notes} numberOfLines={2}>
                  {item.notes}
                </Text>
              ) : null}

              <View style={styles.metaRow}>
                {item.category ? (
                  <Pill label={item.category} background={catColor} />
                ) : null}
                <View style={styles.countdown}>
                  <Feather name="clock" size={12} color={c.textPrimary} />
                  <Text style={styles.countdownText}>
                    {left == null
                      ? "—"
                      : left === 0
                      ? "Gone today"
                      : `${left} day${left === 1 ? "" : "s"} left`}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => restoreItem(item.id)}
                  style={({ pressed }) => [
                    styles.restoreBtn,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Feather name="rotate-ccw" size={14} color="#FFFFFF" />
                  <Text style={styles.restoreText}>Restore</Text>
                </Pressable>
                <Pressable
                  onPress={() => onPermanent(item)}
                  style={({ pressed }) => [
                    styles.permanentBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                  hitSlop={8}
                >
                  <Feather name="x" size={14} color={c.textSecondary} />
                  <Text style={styles.permanentText}>Delete forever</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyMark}>
        <Feather name="trash-2" size={20} color={c.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>Nothing recently deleted</Text>
      <Text style={styles.emptyBody}>
        When you delete a parked item, it'll wait here for a week before it
        goes for good.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
  },
  topTitle: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: c.textSecondary,
  },
  intro: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 8,
  },
  heading: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 26,
    color: c.textPrimary,
  },
  lede: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: c.textSecondary,
    lineHeight: 20,
    maxWidth: 360,
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: c.border,
    opacity: 0.96,
  },
  cardTop: {
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
  countdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.background,
  },
  countdownText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textPrimary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 4,
  },
  restoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1C1C1A",
  },
  restoreText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  permanentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  permanentText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
  },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyMark: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 20,
    color: c.textPrimary,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    color: c.textSecondary,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
});
