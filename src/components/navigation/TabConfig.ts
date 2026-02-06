import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";

export const tabConfig = {
  index: { title: "", Icon: FontAwesome, name: "home" as const },
  benefits: { title: "", Icon: Feather, name: "star" as const },
  channels: { title: "", Icon: MaterialIcons, name: "chat" as const },
  event: { title: "", Icon: MaterialIcons, name: "event" as const },
  profile: { title: "", Icon: Feather, name: "user" as const },
} as const;

export const tabNames = ["index", "benefits","channels", "profile"] as const;