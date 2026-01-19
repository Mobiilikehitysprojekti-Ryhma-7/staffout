import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BENEFITS } from "../../types/benefit";
import { BenefitCard } from "../../components/benefits/BenefitCard";
import { BenefitsHeader } from "../../components/benefits/BenefitsHeader";

export default function Benefits() {
  // Placeholder handlers for header actions (sort / filter).
  const onSortPress = () => {};
  const onFilterPress = () => {};

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.topTitle}>Yritys</Text>

        {/* Section header with title + action buttons */}
        <BenefitsHeader onSortPress={onSortPress} onFilterPress={onFilterPress} />

        {/* 2-column grid list of benefit cards */}
        <FlatList
          data={BENEFITS}
          keyExtractor={(it) => it.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={{ gap: 16 }}
          renderItem={({ item }) => <BenefitCard item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  topTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 24,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16
  },
});
