import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import colors from "@/constants/colors";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

type Props = {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function isoFromParts(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function DatePickerField({ label, value, onChange }: Props) {
  const today = useMemo(() => new Date(), []);
  const [open, setOpen] = useState(false);
  const initial = value ? new Date(value) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const display = value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectedISO = value;

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setOpen(true)} style={styles.field}>
        <Feather name="calendar" size={16} color={c.textSecondary} />
        <Text style={[styles.value, !value && { color: "#A29A88" }]}>
          {display}
        </Text>
        {value ? (
          <Pressable onPress={() => onChange(undefined)} hitSlop={10}>
            <Feather name="x" size={16} color={c.textSecondary} />
          </Pressable>
        ) : null}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.header}>
              <Pressable onPress={goPrev} hitSlop={10}>
                <Feather name="chevron-left" size={22} color={c.textPrimary} />
              </Pressable>
              <Text style={styles.headerText}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <Pressable onPress={goNext} hitSlop={10}>
                <Feather name="chevron-right" size={22} color={c.textPrimary} />
              </Pressable>
            </View>
            <View style={styles.weekRow}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <Text key={i} style={styles.weekday}>
                  {d}
                </Text>
              ))}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {cells.map((day, idx) => {
                  if (day === null) return <View key={idx} style={styles.cell} />;
                  const iso = isoFromParts(viewYear, viewMonth, day);
                  const selected = iso === selectedISO;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        onChange(iso);
                        setOpen(false);
                      }}
                      style={[
                        styles.cell,
                        styles.day,
                        selected && {
                          backgroundColor: c.textPrimary,
                          borderColor: c.textPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selected && { color: "#FFFFFF" },
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <Button
              label="Close"
              variant="secondary"
              onPress={() => setOpen(false)}
              style={{ marginTop: 12 }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  value: {
    flex: 1,
    fontFamily: fontFamily.mono,
    fontSize: 14,
    color: c.textPrimary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(28,28,26,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: {
    backgroundColor: c.background,
    borderRadius: 22,
    padding: 18,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: fontFamily.serifBold,
    fontSize: 18,
    fontWeight: "700",
    color: c.textPrimary,
  },
  weekRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    color: c.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
  },
  dayText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 14,
    color: c.textPrimary,
  },
});
