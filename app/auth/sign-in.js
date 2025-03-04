import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { login } from "../../services/api";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.LONG);
      return;
    }

    try {
      const response = await login(email.trim(), password.trim());
      const token = response.data.token;

      await AsyncStorage.setItem("userToken", token); 

      ToastAndroid.show("Login successful!", ToastAndroid.LONG);
      router.replace("/"); 
    } catch (error) {
      ToastAndroid.show("Login failed. Check your credentials.", ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Sign In</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry style={styles.input} placeholder="Enter password" value={password} onChangeText={setPassword} />
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        style={styles.createButton}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
        <Text style={styles.buttonText}>I don't have an account</Text>
      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({
  container: { padding: 25, paddingTop: 40, backgroundColor: Colors.WHITE, height: "100%" },
  title: { fontFamily: "outfit-bold", fontSize: 30, marginTop: 30 },
  inputContainer: { marginTop: 10 },
  label: { fontFamily: "outfit" },
  input: { padding: 15, borderWidth: 1, borderRadius: 15, borderColor: Colors.GRAY, fontFamily: "outfit" },
  createButton: { padding: 20, backgroundColor: Colors.PRIMARY, borderRadius: 15, marginTop: 50 },
  buttonText: { color: Colors.WHITE, textAlign: "center" },
  signInButton: { padding: 20, backgroundColor: Colors.WHITE, borderRadius: 15, marginTop: 20, borderWidth: 1 },
  signInText: { color: Colors.PRIMARY, textAlign: "center" },
});
