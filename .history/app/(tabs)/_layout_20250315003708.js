import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.bgColor,
          borderTopWidth: 0,
          padding: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#6ad1f5", 
        tabBarInactiveTintColor: "black", 
      }}
    >
      <Tabs.Screen
        name="blog"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}