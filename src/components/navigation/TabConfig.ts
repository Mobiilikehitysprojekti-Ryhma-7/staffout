import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";

export const tabConfig = {
  home: { title: "", Icon: FontAwesome, name: "home" as const },
  benefits: { title: "", Icon: Feather, name: "star" as const },
  screen3: { title: "", Icon: MaterialIcons, name: "event" as const },
  screen4: { title: "", Icon: Feather, name: "settings" as const },
} as const;

export const tabNames = ["home", "benefits", "screen3", "screen4"] as const;