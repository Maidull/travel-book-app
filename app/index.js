import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.replace("/auth/sign-in"); 
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Travel App</Text>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem("userToken");
          router.replace("/auth/sign-in"); 
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
