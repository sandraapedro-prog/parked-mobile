import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/components/Brand";
import { ItemCard } from "@/components/ItemCard";
import colors from "@/constants/colors";
import { FILTERS, Filter } from "@/constants/parked";
import { useAuth } from "@/contexts/AuthContext";
import { useItems } from "@/contexts/ItemsContext";
import { isDueSoon } from "@/lib/format";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function ParkingLotScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const { parkedItems, activeItems, deletedItems } = useItems();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return {
      All: parkedItems.length,
      Hobbies: parkedItems.filter((i) => i.type === "Hobby").length,
      Ideas: parkedItems.filter((i) => i.type === "Idea").length,
      Due: parkedItems.filter((i) => isDueSoon(i.checkInDate)).length,
    } as Record<Filter, number>;
  }, [parkedItems]);

  const filtered = useMemo(() => {
    let list = parkedItems;
    if (filter === "Hobbies") list = list.filter((i) => i.type === "Hobby");
    else if (filter === "Ideas") list = list.filter((i) => i.type === "Idea");
    else if (filter === "Due") list = list.filter((i) => isDueSoon(i.checkInDate));

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.notes ?? "").toLowerCase().includes(q) ||
          (i.category ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [parkedItems, filter, query]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Late evening";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            {greeting}
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </Text>
          <Brand size="md" />
        </View>
        <View style={styles.headerActions}>
          <HeaderIconButton
            icon="play-circle"
            badge={activeItems.length || undefined}
            onPress={() => router.push("/(app)/active")}
            accessibilityLabel="Active items"
          />
          <HeaderIconButton
            icon="trash-2"
            badge={deletedItems.length || undefined}
            onPress={() => router.push("/(app)/trash")}
            accessibilityLabel="Recently deleted"
          />
          <HeaderIconButton
            icon="user"
            onPress={() => router.push("/(app)/settings")}
            accessibilityLabel="Account"
          />
        </View>
      </View>

      <Text style={styles.subtitle}>Your parking lot</Text>

      <View style={styles.searchRow}>
        <Feather name="search" size={16} color={c.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your parked things"
          placeholderTextColor="#A29A88"
          style={styles.searchInput}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Feather name="x" size={16} color={c.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterStrip}>
        <FlatList
          data={FILTERS}
          keyExtractor={(f) => f.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          renderItem={({ item: f }) => {
            const active = filter === f.key;
            return (
              <Pressable
                onPress={() => setFilter(f.key)}
                style={[
                  styles.filterChip,
                  active && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    active && { backgroundColor: "#FFFFFF" },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      active && { color: c.textPrimary },
                    ]}
                  >
                    {counts[f.key]}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad },
          filtered.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => router.push(`/(app)/item/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<EmptyState filter={filter} hasQuery={!!query} />}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          router.push("/(app)/park");
        }}
        style={({ pressed }) => [
          styles.fab,
          { bottom: (Platform.OS === "web" ? 34 : insets.bottom) + 24 },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>Park it</Text>
      </Pressable>
    </View>
  );
}

function HeaderIconButton({
  icon,
  onPress,
  badge,
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
  badge?: number;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.iconButton}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
    >
      <Feather name={icon} size={17} color={c.textPrimary} />
      {badge ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function EmptyState({ filter, hasQuery }: { filter: Filter; hasQuery: boolean }) {
  let title = "Your parking lot is quiet";
  let body = "When something comes to you — an idea, a hobby — park it here.";
  if (hasQuery) {
    title = "Nothing matches that yet";
    body = "Try a different word, or clear the search.";
  } else if (filter === "Hobbies") {
    title = "No hobbies parked";
    body = "Add a hobby you've been meaning to come back to.";
  } else if (filter === "Ideas") {
    title = "No ideas parked";
    body = "Got something to chew on later? Park the spark here.";
  } else if (filter === "Due") {
    title = "Nothing due this week";
    body = "Items with a check-in within 7 days will appear here.";
  }
  return (
    <View style={styles.empty}>
      <View style={styles.emptyMark}>
        <Feather name="bookmark" size={20} color={c.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  greeting: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textSecondary,
    letterSpacing: 0.4,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
  },
  iconBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#1C1C1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: c.background,
  },
  iconBadgeText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 10,
    lineHeight: 12,
  },
  subtitle: {
    fontFamily: fontFamily.serif,
    fontStyle: "italic",
    fontSize: 16,
    color: c.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.mono,
    fontSize: 14,
    color: c.textPrimary,
    paddingVertical: 0,
  },
  filterStrip: {
    paddingBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
  },
  filterChipActive: {
    backgroundColor: c.textPrimary,
    borderColor: c.textPrimary,
  },
  filterText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textPrimary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#EFEAE0",
    minWidth: 22,
    alignItems: "center",
  },
  countText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 11,
    color: c.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
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
  fab: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#1C1C1A",
    shadowColor: "#1C1C1A",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  fabText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
