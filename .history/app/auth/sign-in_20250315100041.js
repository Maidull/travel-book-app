import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { login } from "../../services/api";
import API_URL from "../../services/config";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
  
    try {
      const response = await login(email.trim(), password.trim());
      const token = response.data?.token;
      const user = response.data?.user;
  
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }
  
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));
      console.log("UserInfo đã lưu vào AsyncStorage:", user);
  
      Alert.alert("Success", "Login successful!");
      router.replace("/home");
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", "Login failed. Check your credentials.");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.taotu.cn/ssd/ssd1/1/2022-07-16/1_3499ea38092f05944e78b9f521fc1865.jpg", // URL hình nền
      }}
      style={styles.backgroundImage} // Full màn hình
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="rgba(255, 255, 255, 0.7)" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="rgba(255, 255, 255, 0.7)" 
            value={password}
            onChangeText={setPassword}
          />
        </View>
  
        <TouchableOpacity
          onPress={handleSignIn}
          style={[styles.createButton, { backgroundColor: Colors.primaryColor }]}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
          <Text style={styles.buttonText}>I don't have an account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, paddingTop: 40, backgroundColor: Colors.white, height: "100%" },
  title: { fontFamily: "outfit-bold", fontSize: 30, marginTop: 30 },
  inputContainer: { marginTop: 10 },
  label: { fontFamily: "outfit" },
  input: { padding: 15, borderWidth: 1, borderRadius: 15, borderColor: Colors.GRAY, fontFamily: "outfit" },
  createButton: { padding: 20, borderRadius: 15, marginTop: 50 },
  buttonText: { color: Colors.black, textAlign: "center" },
  signInButton: { padding: 20, backgroundColor: Colors.black, borderRadius: 15, marginTop: 20, borderWidth: 1 },
  signInText: { color: Colors.PRIMARY, textAlign: "center" },
});
