import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import type { CityStat } from "@/src/types/cityStats";

// Legend component for the city pie chart, showing color, percentage and count for each city.

export function CityPieLegend({
  stats,
  selectedCity,
  onSelectCity,
}: {
  stats: CityStat[];
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
}) {
  return (
    <View style={styles.legendGrid}>
      {stats.map((s) => {
        const active = s.city === selectedCity;
        return (
          <Pressable
            key={s.city}
            onPress={() => onSelectCity(s.city)}
            style={[styles.legendItem, active && styles.legendRowActive]}
          >
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendText} numberOfLines={1} ellipsizeMode="tail">
              {s.percent}% {s.city}
            </Text>
            <Text style={styles.legendCount}>{s.count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
    legendGrid: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 12,
      columnGap: 12,
    },
    legendItem: {
      width: "48%",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: "#f6f6f6",
    },
    legendRowActive: {
      backgroundColor: "#eeeeee",
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 999,
      marginRight: 10
    },
    legendTextGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      flex: 1
    },
    legendText: {
      flex: 1,
      fontSize: 14,
      color: "#333"
    },
    legendCount: {
      fontSize: 14,
      fontWeight: "800",
      color: "#111"
    },
});