import React, { useMemo } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import type { CategorySelectProps } from "@/src/types/CategorySelectProps";
import { useCategorySelect } from "@/src/hooks/useCategorySelect";

// Layout sizing and default labels.
const CATEGORY_SELECT_ROW_HEIGHT = 56;
const CATEGORY_SELECT_VISIBLE_ROWS = 5;
const DEFAULT_TITLE = "Valitse kategoria";
const DEFAULT_PLACEHOLDER = "Kategoria";

export function BenefitCategorySelect({
  value,
  onChange,
  options,

  placeholder = DEFAULT_PLACEHOLDER,
  title = DEFAULT_TITLE,
}: CategorySelectProps) {
  const {
    open,
    setOpen,
    isEmpty,
    close,
    pickPreset,
  } = useCategorySelect({ value, onChange });

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.key === value)?.label ?? "";
  }, [options, value]);

  return (
    <>
      {/* Closed state field */}
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text
          style={[styles.fieldText, isEmpty && styles.placeholder]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedLabel  || placeholder}
        </Text>

        <View style={styles.chevronWrap}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <Pressable onPress={close} />

        {/* Bottom sheet */}
        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={close} style={styles.closeBtn}>
                <Text style={styles.closeText}>Sulje</Text>
              </Pressable>
            </View>

            {/* Scrollable options */}
            <View style={styles.card}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.key}
                style={{ maxHeight: CATEGORY_SELECT_ROW_HEIGHT * CATEGORY_SELECT_VISIBLE_ROWS }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => {

                  return (
                    // One row per option.
                    <Pressable
                      onPress={() => (pickPreset(item.key))}
                      style={[
                        styles.row,
                        index > 0 && styles.rowBorder,
                        item.key === value && styles.rowActive,
                      ]}
                    >
                      <Text style={styles.rowText}>{item.label}</Text>
                      {item.key === value ? <Text style={styles.check}>✓</Text> : null}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
export const styles = StyleSheet.create({
  field: {
    width: "100%",
    height: 42.5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: {
    flex: 1,
    color: "#000",
  },
  placeholder: {
    color: "#6b6b6b",
  },
  chevronWrap: {
    width: 24,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    fontSize: 22,
    lineHeight: 22,
    color: "#000",
    marginTop: -2,
  },

  sheetWrap: {
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111"
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  closeText: {
    fontWeight: "800",
    color: "#111"
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    height: CATEGORY_SELECT_ROW_HEIGHT,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9"
  },
  rowActive: {
    backgroundColor: "#f8fafc"
  },
  rowText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111"
  },
  check: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111"
  },

  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  secondaryText: {
    fontWeight: "800",
    color: "#111"
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  primaryText: {
    fontWeight: "900",
    color: "#fff"
  },
});
