import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { TabBarIcon } from "./TabBarIcon";
import { tabConfig, tabNames } from "./TabConfig";

export default function AppTabs() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      // Options for all tab screens.
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      {tabNames.map((routeName) => {
        const cfg = tabConfig[routeName];

        return (
          <Tabs.Screen
            key={routeName}
            name={routeName}
            options={{
              title: cfg.title,
              // Use the TabBarIcon for icon rendering.
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon
                  Icon={cfg.Icon as any}
                  name={cfg.name as any}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
