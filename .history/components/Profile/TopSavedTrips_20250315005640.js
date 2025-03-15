import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../services/config";

export default function TopSavedTrips() {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    const fetchSavedTrips = async () => {
      // Lấy danh sách trip đã lưu từ AsyncStorage
      const trips = await AsyncStorage.getItem("savedTrips");
      if (trips) {
        setSavedTrips(JSON.parse(trips));
      }
    };

    fetchSavedTrips();
  }, []);

  if (savedTrips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No saved trips yet!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedTrips}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.tripItem}>
          <Text style={styles.tripName}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  tripItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tripName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});