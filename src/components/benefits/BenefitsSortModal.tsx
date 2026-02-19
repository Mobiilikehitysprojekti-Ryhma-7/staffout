import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppModal } from "../ui/AppModal";

export type SortKey = "title-asc" | "title-desc" | "category" | "validUntil";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "validUntil", label: "Voimassaoloaika (lähin ensin)" },
  { key: "title-asc", label: "Nimi (A → Z)" },
  { key: "title-desc", label: "Nimi (Z → A)" },
  { key: "category", label: "Kategoria" },
];

// Sort modal: single-choice selection.
// Apply commits draft -> applied.
export function BenefitsSortModal({
  visible,
  value,
  onChange,
  onClose,
  onApply,
}: {
  visible: boolean;
  value: SortKey;
  onChange: (k: SortKey) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <AppModal
      visible={visible}
      title="Järjestä"
      onClose={onClose}
      footer={
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onApply}>
          <Text style={styles.btnPrimaryText}>Käytä</Text>
        </Pressable>
      }
    >
      {/* Selectable rows */}
      <View style={styles.list}>
        {OPTIONS.map((opt) => {
          const active = value === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              style={[styles.row, active && styles.rowActive]}
            >
              <Text style={[styles.rowText, active && styles.rowTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  rowActive: {
    backgroundColor: "#111",
    borderColor: "#111"
  },
  rowText: {
    fontWeight: "800"
  },
  rowTextActive: {
    color: "#fff"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12
  },
  btnPrimary: {
    backgroundColor: "#111"
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "800"
  },
});
