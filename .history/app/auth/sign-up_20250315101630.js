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
        uri: "https://d29fhpw069ctt2.cloudfront.net/photo/thumb/36619/spring-river.jpg",
      }}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Create New Account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={name}
            onChangeText={setName}
          />
        </View>

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
            placeholder="Enter Password"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={OnCreateAccount}
          style={[styles.createButton, { backgroundColor: Colors.primaryColor }]}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/auth/sign-in")}>
          <Text style={styles.buttonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontFamily: "outfit",
    color: "white",
    marginBottom: 5,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "rgba(255, 255, 255, 0.5)", 
    backgroundColor: "rgba(255, 255, 255, 0.3)", 
    color: "white", 
    fontFamily: "outfit",
  },
  createButton: {
    padding: 20,
    borderRadius: 15,
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
