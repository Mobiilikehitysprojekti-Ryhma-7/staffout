import React from "react";
import { FlatList } from "react-native";
import type { Benefit } from "../../types/benefit";
import { BenefitCard } from "./BenefitCard";

export function BenefitsList({
  items,
  onPressItem,
}: {
  items: Benefit[];
  onPressItem: (b: Benefit) => void;
}) {
  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 16 }}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, gap: 16 }}
      renderItem={({ item }) => (
        <BenefitCard item={item} onPress={() => onPressItem(item)} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}