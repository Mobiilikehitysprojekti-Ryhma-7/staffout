import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BenefitCategory } from "../../types/benefit";
import { AppModal } from "../ui/AppModal";

const CATEGORIES: { key: BenefitCategory; label: string }[] = [
  { key: "sports", label: "Urheilu" },
  { key: "meals", label: "Ruokailu" },
  { key: "culture", label: "Kulttuuri" },
  { key: "health", label: "Terveys" },
  { key: "other", label: "Muu" },
];

// Filter modal edits the "draft" category selection.
// Apply commits draft -> applied; Clear resets the draft.
export function BenefitsFilterModal({
  visible,
  selected,
  onToggle,
  onClose,
  onClear,
  onApply,
}: {
  visible: boolean;
  selected: Set<BenefitCategory>;
  onToggle: (c: BenefitCategory) => void;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <AppModal
      visible={visible}
      title="Suodata"
      onClose={onClose}
      footer={
        // Footer actions : Clear and Apply
        <>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={onClear}>
            <Text style={styles.btnGhostText}>Tyhjennä</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onApply}>
            <Text style={styles.btnPrimaryText}>Käytä</Text>
          </Pressable>
        </>
      }
    >
      {/* Chip-style multi-select categories */}
      <View style={styles.categories}>
        {CATEGORIES.map((c) => {
          const active = selected.has(c.key);
          return (
            <Pressable
              key={c.key}
              onPress={() => onToggle(c.key)}
              style={[styles.category, active && styles.categoryActive]}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  categoryActive: {
    backgroundColor: "#111",
    borderColor: "#111"
  },
  categoryText: {
    fontWeight: "700"
  },
  categoryTextActive: {
    color: "#fff" 
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12
  },
  btnGhost: {
    backgroundColor: "#f2f2f2"
  },
  btnGhostText: {
    fontWeight: "800"
  },
  btnPrimary: {
    backgroundColor: "#111"
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "800"
  },
});
