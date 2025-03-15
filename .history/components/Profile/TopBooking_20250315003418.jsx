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

        const response = await fetch(`${API_URL}/booked-trips/${user.id}`);import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupListing from "./GroupList-c";

export default function TopBooking() {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedTrips = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        const user = JSON.parse(userInfo);

        if (!user || !user.id) {
          setError("Không tìm thấy user_id");
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
        setError("Lỗi khi lấy danh sách booked trips: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTrips();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ flex: 1, justifyContent: "center" }} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
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
      <GroupListing listing={bookedTrips} />
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
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
      <GroupListing listing={bookedTrips} />
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