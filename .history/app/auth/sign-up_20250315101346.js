import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { register } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const OnCreateAccount = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedName) {
      Alert.show("Please enter all details", ToastAndroid.LONG);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.show("Invalid email format", ToastAndroid.LONG);
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.show("Password must be at least 6 characters", ToastAndroid.LONG);
      return;
    }

    try {
      const response = await register(trimmedEmail, trimmedPassword, trimmedName);

      const token = response.data.token;

      await AsyncStorage.setItem("userToken", token);

      ToastAndroid.show("Account created successfully!", ToastAndroid.LONG);
      router.replace("/");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      ToastAndroid.show(error.response?.data?.message || "Failed to create account", ToastAndroid.LONG);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.taotu.cn/ssd/ssd1/1/2022-07-16/1_3499ea38092f05944e78b9f521fc1865.jpg",
      }}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: "cover" }}
    ></ImageBackground>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Create new account</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={setName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry style={styles.input} placeholder="Enter password" value={password} onChangeText={setPassword} />
      </View>

      <TouchableOpacity
        onPress={OnCreateAccount}
        style={[styles.createButton, { backgroundColor: Colors.primaryColor }]} 
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/auth/sign-in")} style={styles.signInButton}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, paddingTop: 40, backgroundColor: Colors.white, height: "100%" },
  title: { fontFamily: "outfit-bold", fontSize: 30, marginTop: 30 },
  inputContainer: { marginTop: 10 },
  label: { fontFamily: "outfit" },
  input: { padding: 15, borderWidth: 1, borderRadius: 15, borderColor: Colors.GRAY, fontFamily: "outfit" },
  createButton: { padding: 20, borderRadius: 15, marginTop: 50 },
  buttonText: { color: Colors.white, textAlign: "center" },
  signInButton: { padding: 20, backgroundColor: Colors.WHITE, borderRadius: 15, marginTop: 20, borderWidth: 1 },
  signInText: { color: Colors.PRIMARY, textAlign: "center" },
});
