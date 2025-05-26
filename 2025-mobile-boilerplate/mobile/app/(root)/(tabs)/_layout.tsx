import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <TabBarIcon name="cart" color={color} />,
        }}
      />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="receipt-outline" color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
