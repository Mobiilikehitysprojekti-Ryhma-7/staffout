import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";

export const tabConfig = {
  Home: { title: "", Icon: FontAwesome, name: "home" as const },
  Benefits: { title: "", Icon: Feather, name: "star" as const },
  Screen3: { title: "", Icon: MaterialIcons, name: "event" as const },
  Screen4: { title: "", Icon: Feather, name: "settings" as const },
} as const;

export const tabNames = ["Home", "Benefits", "Screen3", "Screen4"] as const;
