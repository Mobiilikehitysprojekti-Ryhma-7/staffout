import React from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import type { CitySelectProps } from "@/src/types/CitySelectProps";
import { cleanCity } from "@/src/utils/cleanCity";
import { useCitySelect } from "@/src/hooks/useCitySelect";

// Layout sizing and default labels.
const CITY_SELECT_ROW_HEIGHT = 56;
const CITY_SELECT_VISIBLE_ROWS = 5;
const DEFAULT_TITLE = "Valitse kaupunki";
const DEFAULT_PLACEHOLDER = "Asuinkaupunki";
const DEFAULT_OTHER_OPTION = "Muu…";
const DEFAULT_OTHER_LABEL = "Kirjoita kaupunki";
const DEFAULT_OTHER_PLACEHOLDER = "Esim. Kajaani";

export function CitySelect({
  value,
  onChange,
  options,

  placeholder = DEFAULT_PLACEHOLDER,
  title = DEFAULT_TITLE,
  otherOptionLabel = DEFAULT_OTHER_OPTION,
  otherInputLabel = DEFAULT_OTHER_LABEL,
  otherInputPlaceholder = DEFAULT_OTHER_PLACEHOLDER,
}: CitySelectProps) {
  const {
    open,
    setOpen,
    showOtherInput,
    setShowOtherInput,
    otherDraft,
    setOtherDraft,
    normalizedValue,
    isEmpty,
    close,
    pickPreset,
    startOther,
    saveOther,
  } = useCitySelect({ value, onChange });

  return (
    <>
      {/* Closed state field */}
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text
          style={[styles.fieldText, isEmpty && styles.placeholder]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {normalizedValue || placeholder}
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
                data={[...options, otherOptionLabel]}
                keyExtractor={(item) => item}
                style={{ maxHeight: CITY_SELECT_ROW_HEIGHT * CITY_SELECT_VISIBLE_ROWS }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => {
                  const isOther = item === otherOptionLabel;

                  // Compare using cleaned values, but show the original label
                  const active =
                    !isOther &&
                    normalizedValue &&
                    (cleanCity(item) ?? item).toLowerCase() === normalizedValue.toLowerCase();

                  return (
                    // One row per option.
                    <Pressable
                      onPress={() => (isOther ? startOther() : pickPreset(item))}
                      style={[
                        styles.row,
                        index > 0 && styles.rowBorder,
                        active && styles.rowActive,
                      ]}
                    >
                      <Text style={styles.rowText}>{item}</Text>
                      {active ? <Text style={styles.check}>✓</Text> : null}
                    </Pressable>
                  );
                }}
              />
            </View>

            {/* "Other" input */}
            {showOtherInput ? (
              <View style={styles.otherBox}>
                <Text style={styles.otherLabel}>{otherInputLabel}</Text>
                <TextInput
                  value={otherDraft}
                  onChangeText={setOtherDraft}
                  placeholder={otherInputPlaceholder}
                  autoCorrect={false}
                  autoCapitalize="words"
                  style={styles.otherInput}
                />

                <View style={styles.otherActions}>
                  <Pressable
                    onPress={() => setShowOtherInput(false)}
                    style={styles.secondaryBtn}
                  >
                    <Text style={styles.secondaryText}>Peruuta</Text>
                  </Pressable>

                  <Pressable onPress={saveOther} style={styles.primaryBtn}>
                    <Text style={styles.primaryText}>Tallenna</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
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
    height: CITY_SELECT_ROW_HEIGHT,
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

  otherBox: {
    marginTop: 14
  },
  otherLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "700"
  },
  otherInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
  },
  otherActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10
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
