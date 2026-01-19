import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

// Header component for the Benefits section.
export function BenefitsHeader({
  onSortPress,
  onFilterPress,
}: {
  onSortPress: () => void;
  onFilterPress: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>Henkilöstöedut</Text>

      <View style={styles.actions}>
        {/* Sort button */}
        <Pressable style={styles.actionBtn} onPress={onSortPress}>
          <MaterialIcons name="swap-vert" size={20} color="#fff" />
        </Pressable>

        {/* Filter button */}
        <Pressable style={styles.actionBtn} onPress={onFilterPress}>
          <Feather name="filter" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});
