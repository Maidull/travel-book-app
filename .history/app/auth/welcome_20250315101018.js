import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import Animated, { FadeOut } from "react-native-reanimated";

export default function Welcome() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const router = useRouter();

  const handleSwitchToggle = (value) => {
    setIsSwitchOn(value);
    if (value) {
      router.replace("/auth/sign-in");
    }
  };

  return (
    <Animated.View
      exiting={FadeOut.duration(300)} // Hiệu ứng mờ dần khi rời khỏi trang
      style={{ flex: 1 }}
    >
    <ImageBackground
      source={{
        uri: "https://img.taotu.cn/ssd/ssd1/1/2022-07-16/1_3499ea38092f05944e78b9f521fc1865.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Discover Us</Text>
        <Switch
          value={isSwitchOn}
          onValueChange={handleSwitchToggle}
          trackColor={{ false: Colors.gray, true: Colors.primaryColor }}
          thumbColor={isSwitchOn ? Colors.white : Colors.black}
          style={styles.switch}
        />
      </View>
    </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 20,
  },
  switch: {
    marginTop: 20,
    transform: [{ scale: 1.5 }], 
  },
});