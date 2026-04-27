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
import { Pill } from "@/components/Pill";
import { SelectChips } from "@/components/SelectChips";
import colors from "@/constants/colors";
import {
  CATEGORIES,
  ENERGY_HINT,
  ENERGY_LEVELS,
  Energy,
  ITEM_TYPES,
  ItemType,
} from "@/constants/parked";
import { useItems } from "@/contexts/ItemsContext";
import { confirm } from "@/lib/confirm";
import { formatCheckIn, isDueSoon } from "@/lib/format";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const {
    getItem,
    updateItem,
    deleteItem,
    unparkItem,
    snoozeItem,
    customCategories,
    addCustomCategory,
    colorFor,
  } = useItems();

  const item = useMemo(() => (id ? getItem(id) : undefined), [getItem, id]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item?.title ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [type, setType] = useState<ItemType>(item?.type ?? "Idea");
  const [category, setCategory] = useState<string | undefined>(item?.category);
  const [energy, setEnergy] = useState<Energy | undefined>(item?.energy);
  const [checkInDate, setCheckInDate] = useState<string | undefined>(
    item?.checkInDate,
  );
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const allCategoryNames = useMemo(
    () => [...CATEGORIES, ...customCategories.map((c) => c.name)],
    [customCategories],
  );

  if (!item) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
            <Feather name="arrow-left" size={20} color={c.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>That spot is empty</Text>
          <Text style={styles.notFoundBody}>
            This parked item may have been unparked or deleted.
          </Text>
          <Button label="Back to parking lot" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const due = isDueSoon(item.checkInDate);
  const checkInLabel = formatCheckIn(item.checkInDate);
  const isUnparked = !!item.unparkedAt;
  const isDeleted = !!item.deletedAt;

  const save = async () => {
    if (!title.trim()) {
      Alert.alert("Almost there", "Give your parked item a short title.");
      return;
    }
    await updateItem(item.id, {
      title: title.trim(),
      notes: notes.trim() || undefined,
      type,
      category,
      energy,
      checkInDate,
    });
    setEditing(false);
  };

  const onUnpark = async () => {
    await unparkItem(item.id);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // On native, show a friendly confirmation before navigating back.
      Alert.alert(
        "Welcome back",
        "It's now in your Active list — go enjoy it.",
        [{ text: "Okay", onPress: () => router.back() }],
      );
      return;
    }
    // On web, Alert.alert is a no-op, so the user would be stranded
    // on the item screen. Navigate back directly instead — the Active
    // tab will already show the item the moment they land on it.
    router.back();
  };

  const onSnooze = async () => {
    await snoozeItem(item.id, 14);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are you sure you want to delete?",
      message:
        "You'll have 7 days to restore this from Recently deleted before it's gone for good.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteItem(item.id);
    router.back();
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
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {editing
            ? "Editing"
            : isDeleted
            ? "Deleted"
            : isUnparked
            ? "Active"
            : "Parked"}
        </Text>
        {editing ? (
          <Pressable onPress={save} hitSlop={10}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setTitle(item.title);
              setNotes(item.notes ?? "");
              setType(item.type);
              setCategory(item.category);
              setEnergy(item.energy);
              setCheckInDate(item.checkInDate);
              setEditing(true);
            }}
            style={styles.iconBtn}
            hitSlop={10}
          >
            <Feather name="edit-2" size={16} color={c.textPrimary} />
          </Pressable>
        )}
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.scroll}
        bottomOffset={20}
      >
        {!editing ? (
          <>
            <View style={styles.tagRow}>
              <Pill
                label={item.type}
                background={c.type[item.type]}
                color={c.textPrimary}
              />
              {item.category ? (
                <Pill
                  label={item.category}
                  background={colorFor(item.category)}
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
                  <Text style={styles.energyChipText}>{item.energy}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.heading}>{item.title}</Text>

            {checkInLabel ? (
              <View
                style={[
                  styles.checkInRow,
                  due && { backgroundColor: c.warning },
                ]}
              >
                <Feather name="calendar" size={14} color={c.textPrimary} />
                <Text style={styles.checkInLabel}>Check-in by</Text>
                <Text style={styles.checkInValue}>{checkInLabel}</Text>
              </View>
            ) : null}

            <View style={styles.notesBlock}>
              <Text style={styles.metaLabel}>Notes</Text>
              <Text style={styles.notesText}>
                {item.notes ?? "No notes yet — leave breadcrumbs for your future self."}
              </Text>
            </View>

            {item.energy ? (
              <View style={styles.energyExplain}>
                <Text style={styles.metaLabel}>Energy</Text>
                <Text style={styles.energyExplainText}>
                  <Text style={{ fontFamily: fontFamily.sansSemiBold }}>
                    {item.energy} —{" "}
                  </Text>
                  {ENERGY_HINT[item.energy]}
                </Text>
              </View>
            ) : null}

            {!isDeleted ? (
              <View style={styles.actions}>
                {isUnparked ? (
                  <Button
                    label="Park again"
                    variant="primary"
                    size="lg"
                    onPress={() => router.push(`/(app)/park-again/${item.id}`)}
                  />
                ) : (
                  <Button
                    label="Unpark"
                    variant="primary"
                    size="lg"
                    onPress={onUnpark}
                  />
                )}
                {!isUnparked && item.checkInDate ? (
                  <Button
                    label="Snooze 2 weeks"
                    variant="warning"
                    onPress={onSnooze}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#000000",
                      borderWidth: 0.5,
                    }}
                  />
                ) : null}
                <Button
                  label="Delete"
                  variant="destructive"
                  onPress={onDelete}
                />
              </View>
            ) : (
              <View style={styles.deletedNotice}>
                <Feather name="trash-2" size={14} color={c.textSecondary} />
                <Text style={styles.deletedText}>
                  In Recently deleted — you can restore it from there.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={{ gap: 18 }}>
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="What are you parking?"
            />
            <SelectChips<ItemType>
              label="Type"
              options={ITEM_TYPES.map((t) => ({
                value: t,
                label: t,
                color: c.type[t],
              }))}
              value={type}
              onChange={(v) => setType(v ?? "Idea")}
              allowClear={false}
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
                <Pressable
                  onPress={() => setShowNew(true)}
                  style={styles.addCatBtn}
                >
                  <Feather name="plus" size={14} color={c.textPrimary} />
                  <Text style={styles.addCatText}>Add new category</Text>
                </Pressable>
              )}
            </View>
            <Input
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Any context, links or loose threads…"
            />
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
            <DatePickerField
              label="Check-in by"
              value={checkInDate}
              onChange={setCheckInDate}
            />

            <View style={{ gap: 10, marginTop: 6 }}>
              <Button label="Save changes" onPress={save} size="lg" />
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => setEditing(false)}
              />
            </View>
          </View>
        )}
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
  saveText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    color: c.textPrimary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 60,
    gap: 18,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  energyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  energyChipText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textPrimary,
  },
  heading: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 30,
    lineHeight: 36,
    color: c.textPrimary,
    marginTop: 4,
  },
  checkInRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F9FF83",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  checkInLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textSecondary,
  },
  checkInValue: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 13,
    color: c.textPrimary,
    marginLeft: "auto",
  },
  notesBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  metaLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: c.textSecondary,
  },
  notesText: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    lineHeight: 22,
    color: c.textPrimary,
  },
  energyExplain: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  energyExplainText: {
    fontFamily: fontFamily.mono,
    fontSize: 14,
    lineHeight: 20,
    color: c.textPrimary,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  deletedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#EFEAE0",
    marginTop: 8,
  },
  deletedText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    color: c.textSecondary,
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
