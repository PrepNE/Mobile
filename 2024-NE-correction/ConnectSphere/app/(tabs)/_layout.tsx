import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { View } from "react-native";


export default function TabLayout(){

  const colorScheme = useColorScheme()

  return (
    <Tabs
     screenOptions={{
       tabBarActiveTintColor: "#2563eb",
       headerShown: false,
       tabBarStyle: {
         borderTopEndRadius: 20,
         borderTopStartRadius: 20
       }
     }}
    >
        <Tabs.Screen
          name="posts"
          options={{
            title: "Posts",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-post"
          options={{
            title: "Add Post",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "create" : "create-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: "Bookmarks",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "bookmark" : "bookmark-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />
    </Tabs>
  )
}