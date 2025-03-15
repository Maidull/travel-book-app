import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../services/config";
import { Colors } from "../../constants/Colors";

export default function TopBooking() {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventEmitter = new EventEmitter();

  useEffect(() => {
    const fetchBookedTrips = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        const user = JSON.parse(userInfo);
    
        if (!user || !user.id) {
          console.error("Không tìm thấy user_id");
          setLoading(false);
          return;
        }
    
        const response = await fetch(`${API_URL}/booked-trips/${user.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch booked trips: ${response.status}`);
        }
        const data = await response.json();
        setBookedTrips(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booked trips:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
    
        if (!userInfo) {
          Alert.alert("Error", "User not found. Please log in again.");
          return;
        }
    
        const user = JSON.parse(userInfo);
    
        if (!user || !user.id) {
          Alert.alert("Error", "User ID is missing. Please log in again.");
          return;
        }
    
        const response = await fetch(`${API_URL}/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.id, trip_id: id }),
        });
    
        if (response.ok) {
          Alert.alert("Success", "Trip canceled successfully!");
          setIsBooked(false);
    
          // Gửi sự kiện cập nhật danh sách booked trips
          eventEmitter.emit("tripCanceled", id);
        } else {
          const errorData = await response.json();
          Alert.alert("Error", errorData.error || "Failed to cancel the trip.");
        }
      } catch (error) {
        console.error("Error canceling trip:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };

    fetchBookedTrips();
  }, []);

  

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ flex: 1, justifyContent: "center" }} />;
  }

  if (bookedTrips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa đặt chuyến đi nào!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookedTrips}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => console.log(`Trip ID: ${item.id}`)}>
            <View style={styles.tripItem}>
              <Image source={{ uri: item.image }} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>{item.name}</Text>
                <Text style={styles.tripLocation}>{item.location}</Text>
                <Text style={styles.tripPrice}>${item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  tripItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  tripInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tripName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tripLocation: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 5,
  },
  tripPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});