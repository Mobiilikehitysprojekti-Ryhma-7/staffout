import type { ImageSourcePropType } from "react-native";

export type Benefit = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  badge: { family: "fa" | "mi"; name: string };
};

// Example benefit data
export const BENEFITS: Benefit[] = [
  {
    id: "1",
    title: "etu1",
    description: "desc1",
    image: require("../../assets/benefitBG.png"),
    badge: { family: "fa", name: "bicycle" },
  },
  {
    id: "2",
    title: "etu2",
    description: "desc2",
    image: require("../../assets/benefitBG.png"),
    badge: { family: "mi", name: "restaurant" },
  },
  {
    id: "3",
    title: "etu3",
    description: "desc3",
    image: require("../../assets/benefitBG.png"),
    badge: { family: "mi", name: "restaurant" },
  },
];