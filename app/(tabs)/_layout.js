import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Layout() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");
      const user = JSON.parse(userInfo);
      setUserRole(user?.role);
    };

    fetchUserRole();
  }, []);

  if (userRole === "admin") {
    return (
      <Tabs
        screenOptions={{
          headerShown: true,
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
          name="admin/trips"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
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
          tabBarIcon: ({ color }) => <Ionicons name="newspaper" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}