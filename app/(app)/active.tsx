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

import { ItemCard } from "@/components/ItemCard";
import colors from "@/constants/colors";
import { ParkedItem } from "@/constants/parked";
import { useItems } from "@/contexts/ItemsContext";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function ActiveScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 24;
  const { activeItems } = useItems();

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle}>Active</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.intro}>
        <Text style={styles.heading}>What you're back to</Text>
        <Text style={styles.lede}>
          Things you've unparked and are giving time again. Park them back when
          life gets busy — that's the point.
        </Text>
      </View>

      <FlatList
        data={activeItems}
        keyExtractor={(it) => it.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad },
          activeItems.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
        renderItem={({ item }) => <ActiveRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ActiveRow({ item }: { item: ParkedItem }) {
  return (
    <View style={styles.rowWrap}>
      <ItemCard
        item={item}
        showUnparkedBadge
        onPress={() => router.push(`/(app)/item/${item.id}`)}
      />
      <Pressable
        onPress={() => router.push(`/(app)/park-again/${item.id}`)}
        style={({ pressed }) => [
          styles.parkAgain,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Feather name="bookmark" size={14} color="#FFFFFF" />
        <Text style={styles.parkAgainText}>Park again</Text>
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyMark}>
        <Feather name="play-circle" size={20} color={c.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>Nothing active right now</Text>
      <Text style={styles.emptyBody}>
        When you unpark something from your parking lot, it'll wait here while
        you give it time.
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
  rowWrap: {
    gap: 0,
  },
  parkAgain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1C1C1A",
    marginTop: 10,
  },
  parkAgainText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    letterSpacing: 0.4,
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
