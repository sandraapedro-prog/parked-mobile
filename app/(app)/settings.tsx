import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/components/Brand";
import { Button } from "@/components/Button";
import colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useItems } from "@/contexts/ItemsContext";
import { confirm } from "@/lib/confirm";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const { user, signOut } = useAuth();
  const { parkedItems, activeItems, deletedItems } = useItems();

  const hobbies = parkedItems.filter((i) => i.type === "Hobby").length;
  const ideas = parkedItems.filter((i) => i.type === "Idea").length;

  const onSignOut = async () => {
    const ok = await confirm({
      title: "Sign out?",
      message: "Your parked items stay safe on this device.",
      confirmLabel: "Sign out",
      cancelLabel: "Stay",
      destructive: true,
    });
    if (!ok) return;
    await signOut();
    router.replace("/welcome");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle}>Account</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name?.[0] ?? "?").toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{parkedItems.length}</Text>
            <Text style={styles.statLabel}>parked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{hobbies}</Text>
            <Text style={styles.statLabel}>hobbies</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{ideas}</Text>
            <Text style={styles.statLabel}>ideas</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuRow
            icon="play-circle"
            label="Active items"
            sub="What you're back to"
            count={activeItems.length}
            onPress={() => router.push("/(app)/active")}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="trash-2"
            label="Recently deleted"
            sub="Restored within 7 days"
            count={deletedItems.length}
            onPress={() => router.push("/(app)/trash")}
          />
        </View>

        <View style={styles.quoteCard}>
          <Brand size="sm" />
          <Text style={styles.quote}>
            "Not abandoned, just parked."
          </Text>
          <Text style={styles.quoteBody}>
            A calm place for the things you love but haven't gotten back to —
            your future self will thank you.
          </Text>
        </View>

        <Button
          label="Sign out"
          variant="secondary"
          onPress={onSignOut}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  sub,
  count,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  sub: string;
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.menuIcon}>
        <Feather name={icon} size={18} color={c.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuSub}>{sub}</Text>
      </View>
      <View style={styles.menuCount}>
        <Text style={styles.menuCountText}>{count}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={c.textSecondary} />
    </Pressable>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,
    gap: 18,
  },
  profile: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 18,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#1C1C1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarText: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 28,
    color: "#FFFFFF",
  },
  name: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 22,
    color: c.textPrimary,
  },
  email: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: c.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  statValue: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 26,
    color: c.textPrimary,
  },
  statLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
    letterSpacing: 0.6,
    marginTop: 2,
    textTransform: "uppercase",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#EFEAE0",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    color: c.textPrimary,
  },
  menuSub: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: c.textSecondary,
    marginTop: 2,
  },
  menuCount: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EFEAE0",
    minWidth: 28,
    alignItems: "center",
  },
  menuCountText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 12,
    color: c.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: c.border,
    marginHorizontal: 14,
  },
  quoteCard: {
    backgroundColor: "#EAE6DB",
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  quote: {
    fontFamily: fontFamily.serif,
    fontStyle: "italic",
    fontSize: 18,
    color: c.textPrimary,
  },
  quoteBody: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: c.textSecondary,
    lineHeight: 20,
  },
});
