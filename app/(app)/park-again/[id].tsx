import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { DatePickerField } from "@/components/DatePickerField";
import { Input } from "@/components/Input";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { SelectChips } from "@/components/SelectChips";
import colors from "@/constants/colors";
import {
  CATEGORIES,
  ENERGY_HINT,
  ENERGY_LEVELS,
  Energy,
} from "@/constants/parked";
import { useItems } from "@/contexts/ItemsContext";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function ParkAgainScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 8, 56) : insets.top + 8;
  const { getItem, parkAgain, customCategories, addCustomCategory, colorFor } =
    useItems();

  const item = useMemo(() => (id ? getItem(id) : undefined), [id, getItem]);

  const [notes, setNotes] = useState(item?.notes ?? "");
  const [category, setCategory] = useState<string | undefined>(item?.category);
  const [energy, setEnergy] = useState<Energy | undefined>(item?.energy);
  const [checkInDate, setCheckInDate] = useState<string | undefined>(
    item?.checkInDate,
  );
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
            <Feather name="x" size={20} color={c.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>That spot is empty</Text>
          <Text style={styles.notFoundBody}>
            That item isn't around anymore.
          </Text>
          <Button label="Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const allCategoryNames = useMemo(
    () => [...CATEGORIES, ...customCategories.map((c) => c.name)],
    [customCategories],
  );

  const submit = async () => {
    setBusy(true);
    try {
      await parkAgain(item.id, {
        notes: notes.trim() || undefined,
        category,
        energy,
        checkInDate,
      });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (e) {
      Alert.alert("Couldn't park that", e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  };

  const onAddNewCategory = async () => {
    const created = await addCustomCategory(newName);
    if (created) {
      setCategory(created.name);
      setNewName("");
      setShowNew(false);
    } else {
      Alert.alert("Hm", "That category already exists or is empty.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Feather name="x" size={20} color={c.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Park again</Text>
        <Pressable onPress={submit} hitSlop={10}>
          <Text style={[styles.saveText, busy && { opacity: 0.5 }]}>
            {busy ? "Saving…" : "Save"}
          </Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.scroll}
        bottomOffset={20}
      >
        <View style={styles.titleCard}>
          <Text style={styles.eyebrow}>Returning to the lot</Text>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.lede}>
            Anything you want to update before parking it? No pressure — just
            a quick brush before it rests again.
          </Text>
        </View>

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Where you got to, what's next…"
        />

        <View style={{ gap: 8 }}>
          <Text style={styles.fieldLabel}>Category</Text>
          <SelectChips<string>
            options={allCategoryNames.map((name) => ({
              value: name,
              label: name,
              color: colorFor(name),
            }))}
            value={category}
            onChange={setCategory}
          />
          {showNew ? (
            <View style={styles.newCatRow}>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="New category name"
                placeholderTextColor="#A29A88"
                style={styles.newCatInput}
                autoFocus
                onSubmitEditing={onAddNewCategory}
                returnKeyType="done"
              />
              <Pressable onPress={onAddNewCategory} style={styles.newCatAdd}>
                <Feather name="check" size={16} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowNew(false);
                  setNewName("");
                }}
                style={styles.newCatCancel}
              >
                <Feather name="x" size={16} color={c.textSecondary} />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setShowNew(true)} style={styles.addCatBtn}>
              <Feather name="plus" size={14} color={c.textPrimary} />
              <Text style={styles.addCatText}>Add new category</Text>
            </Pressable>
          )}
        </View>

        <SelectChips<Energy>
          label="Energy"
          options={ENERGY_LEVELS.map((e) => ({
            value: e,
            label: e,
            color: c.energy[e],
          }))}
          value={energy}
          onChange={setEnergy}
        />
        {energy ? (
          <View style={styles.energyHint}>
            <View
              style={[
                styles.energyDot,
                { backgroundColor: c.energy[energy] },
              ]}
            />
            <Text style={styles.energyHintText}>{ENERGY_HINT[energy]}</Text>
          </View>
        ) : null}

        <DatePickerField
          label="Check-in by (optional)"
          value={checkInDate}
          onChange={setCheckInDate}
        />

        <Button
          label={busy ? "Parking…" : "Park it again"}
          onPress={submit}
          loading={busy}
          size="lg"
          style={{ marginTop: 8 }}
        />
        <Text style={styles.footnote}>
          It'll move back to your parking lot, ready for whenever.
        </Text>
      </KeyboardAwareScrollViewCompat>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: "space-between",
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
  title: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 20,
    color: c.textPrimary,
  },
  saveText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    color: c.textPrimary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
    gap: 18,
  },
  titleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: c.textSecondary,
  },
  titleText: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 22,
    color: c.textPrimary,
  },
  lede: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: c.textSecondary,
    lineHeight: 20,
  },
  fieldLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  addCatBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
    borderStyle: "dashed",
  },
  addCatText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textPrimary,
  },
  newCatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  newCatInput: {
    flex: 1,
    fontFamily: fontFamily.sansMedium,
    fontSize: 14,
    color: c.textPrimary,
    paddingVertical: 8,
  },
  newCatAdd: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#1C1C1A",
    alignItems: "center",
    justifyContent: "center",
  },
  newCatCancel: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  energyHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -8,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  energyHintText: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: c.textSecondary,
  },
  footnote: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    textAlign: "center",
    color: c.textSecondary,
    marginTop: 4,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  notFoundTitle: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 22,
    color: c.textPrimary,
  },
  notFoundBody: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    color: c.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
});
