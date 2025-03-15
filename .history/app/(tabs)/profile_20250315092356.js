import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBooking from "../../components/Profile/TopBooking";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import API_URL from "../../services/config";

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const [user, setUser] = useState({ name: "", image: "" });
  const [newAvatar, setNewAvatar] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      await updateAvatar(selectedImage);
    }
  };

  const handleEnterUrl = async () => {
    if (!newAvatar.trim()) {
      Alert.alert("Error", "Please enter a valid image URL.");
      return;
    }

    await updateAvatar(newAvatar);
    setNewAvatar("");
  };

  const updateAvatar = async (imageUri) => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (!userInfo) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userInfo);

      const response = await fetch(`${API_URL}/update-avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, image: imageUri }),
      });

      if (response.ok) {
        const updatedUser = { ...user, image: imageUri };
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
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

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.changeAvatarButton}
        >
          <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Avatar</Text>

            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={newAvatar}
              onChangeText={setNewAvatar}
            />

            <TouchableOpacity
              onPress={handleEnterUrl}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Submit URL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: "red" }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarIndicatorStyle: { backgroundColor: Colors.PRIMARY },
        }}
      >
        <Tab.Screen name="Booked Trips" component={TopBooking} />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff", 
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  input: Ơ
});