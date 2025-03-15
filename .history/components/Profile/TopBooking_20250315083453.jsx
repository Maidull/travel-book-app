import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupListing from "./GroupList-c";
import API_URL from "../../services/config";

export default function TopBooking() {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <View style={styles.tripItem}>
            <Image source={{ uri: item.image }} style={styles.tripImage} />
            <View style={styles.tripInfo}>
              <Text style={styles.tripName}>{item.name}</Text>
              <Text style={styles.tripLocation}>{item.location}</Text>
              <Text style={styles.tripPrice}>${item.price}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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