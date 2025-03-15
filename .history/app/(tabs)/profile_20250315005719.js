import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, Modal,
  TextInput, 
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBooking from "../../components/Profile/TopBooking";
import TopSavedTrips from "../../components/Profile/TopSavedTrips";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import API_URL from "../../services/config";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const [user, setUser] = useState({ name: "", image: "" });
  const [newAvatar, setNewAvatar] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        console.log("UserInfo từ AsyncStorage:", userInfo);

        if (!userInfo) {
          console.error("User info not found in AsyncStorage");
          return;
        }

        const user = JSON.parse(userInfo);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      Alert.alert("Logged Out", "You have been logged out successfully.");
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const handleChangeAvatar = async () => {
    if (!newAvatar.trim()) {
      Alert.alert("Error", "Please enter a valid image URL.");
      return;
    }

    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (!userInfo) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userInfo);

      const response = await fetch(${API_URL}/update-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, image: newAvatar }),
      });

      if (response.ok) {
        const updatedUser = { ...user, image: newAvatar };
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setNewAvatar("");
        Alert.alert("Success", "Avatar updated successfully!");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to update avatar.");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert("Error", "Failed to update avatar. Please try again.");
    }
  };

  return (
<View style={styles.container}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
      <Ionicons name="log-out-outline" size={24} color={Colors.BLACK} />
    </TouchableOpacity>

    <View style={styles.profileHeader}>
      {/* Avatar */}
      <Image
        source={{
          uri:
            user.image ||
            "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp",
        }}
        style={styles.avatar}
      />
      <Text style={styles.userName}>{user.name || "Guest"}</Text>

      {/* Thay đổi avatar */}
      <TextInput
        style={styles.input}
        placeholder="Enter new avatar URL"
        value={newAvatar}
        onChangeText={setNewAvatar}
      />
      <TouchableOpacity
        onPress={handleChangeAvatar}
        style={styles.changeAvatarButton}
      >
        <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
      </TouchableOpacity>
    </View>

    {/* Tab điều hướng */}
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarIndicatorStyle: { backgroundColor: Colors.PRIMARY },
      }}
    >
      <Tab.Screen name="Booked Trips" component={TopBooking} />
      <Tab.Screen name="Saved Trips" component={TopSavedTrips} />
    </Tab.Navigator>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  logoutIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  input: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
    width: "80%",
  },
  changeAvatarButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  changeAvatarButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
});