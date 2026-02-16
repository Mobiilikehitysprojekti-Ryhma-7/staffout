import React from "react";
import { Platform, StyleSheet, Text, TextInput, View, Button } from "react-native";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { BenefitCategorySelect } from "./BenefitCategorySelect";
import type { BenefitCategory } from "@/src/types/benefit";

const CATEGORIES: { key: BenefitCategory; label: string }[] = [
  { key: "sports", label: "Urheilu" },
  { key: "meals", label: "Ruokailu" },
  { key: "culture", label: "Kulttuuri" },
  { key: "health", label: "Terveys" },
  { key: "other", label: "Muu" },
];

type Props = {
  benefitTitle: string;
  setBenefitTitle: (v: string) => void;

  benefitDescription: string;
  setBenefitDescription: (v: string) => void;

  benefitCategory: BenefitCategory | null;
  setBenefitCategory: (v: BenefitCategory) => void;

  onUpdate: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function BenefitEdit({
  benefitTitle,
  setBenefitTitle,
  benefitDescription,
  setBenefitDescription,
  benefitCategory,
  setBenefitCategory,
  onUpdate,
  onDelete,
  onCancel,
}: Props) {
  const Input = Platform.OS === "web" ? TextInput : BottomSheetTextInput;

  return (
    <BottomSheetView style={styles.container}>
      <Text style={styles.label}>Edun otsikko</Text>
      <Input style={styles.input} value={benefitTitle} onChangeText={setBenefitTitle} placeholder="Edun otsikko" />

      <Text style={styles.label}>Edun kuvaus</Text>
      <Input style={styles.input} value={benefitDescription} onChangeText={setBenefitDescription} placeholder="Edun kuvaus" />

      <Text style={styles.label}>Edun kategoria</Text>
      <BenefitCategorySelect value={benefitCategory || "other"} onChange={setBenefitCategory} options={CATEGORIES} />

      <View style={{ height: 16 }} />

      <View style={styles.buttonContainer}>
        <Button title="Päivitä etu" onPress={onUpdate} />
        <Button title="Poista etu" onPress={onDelete} />
        <Button title="Peruuta" onPress={onCancel} />
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 14, fontWeight: "400", marginBottom: 6, textAlign: "left", width: "100%" },
  input: { alignSelf: "stretch", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 16, width: "100%" },
  buttonContainer: { gap: 10 },
});
