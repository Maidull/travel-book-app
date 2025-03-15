import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        router.replace("/home"); 
      } else {
        router.replace("/auth/welcome"); 
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return <View />;
}