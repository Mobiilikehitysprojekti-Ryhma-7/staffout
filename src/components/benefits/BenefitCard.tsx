import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import type { Benefit } from "../../types/benefit";

// Calculate a responsive card width based on screen size.
// Assumes a 2-column layout with horizontal padding and a gap between cards.
const { width } = Dimensions.get("window");
const CARD_W = (width - 20 * 2 - 16) / 2;

// Benefit card with image, title, description and an icon badge.
export function BenefitCard({ item }: { item: Benefit }) {
  return (
    <View style={[styles.card, { width: CARD_W }]}>
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        {/* Badge */}
        <View style={styles.badge}>
          {item.badge.family === "fa" ? (
            <FontAwesome name={item.badge.name as any} size={14} color="#fff" />
          ) : (
            <MaterialIcons name={item.badge.name as any} size={16} color="#fff" />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14, 
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  cardImage: {
    width: "100%",
    height: 80
  },
  cardBody: {
    backgroundColor: "#E97A7A",
    padding: 12,
    minHeight: 110,
    position: "relative",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
    marginLeft: 4
  },
  badge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B32626",
    alignItems: "center",
    justifyContent: "center",
  },
});
