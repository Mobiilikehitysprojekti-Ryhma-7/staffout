import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Benefit } from "../../types/benefit";

function Title(title: string) {
  const t = title.trim();
  const cap = t ? t[0].toUpperCase() + t.slice(1) : "";
  return cap;
}

function clean(s: string, max = 12) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function LatestBenefits({
  title = "Henkilöstöedut",
  items,
  onPressItem,
  rightSlot,
}: {
  title?: string;
  items: Benefit[];
  onPressItem: (b: Benefit) => void;
  rightSlot?: React.ReactNode;
}) {
  const chips = useMemo(
    () =>
      items.map((b) => ({
        id: b.id,
        label: clean(Title(b.title), 14),
        item: b,
      })),
    [items]
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>

      <View style={styles.chipsRow}>
        {chips.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => onPressItem(c.item)}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  rightSlot: {
    marginLeft: 12,
  },
  chipsRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#E88C8C",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 72,
    maxWidth: 160,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },
});
