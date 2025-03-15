import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../services/config";

interface Listing {
  id: number;
  name: string;
  location: string;
  duration: number;
  rating: number;
  description: string;
  price: number;
  image: string;
  person: number;
}

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("ID is missing in the route parameters");
      return;
    }

    const fetchListing = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (!userInfo) {
          console.error("User not found in AsyncStorage");
          return;
        }

        const user = JSON.parse(userInfo);

        const response = await fetch(`${API_URL}/trip/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch trip: ${response.status}`);
        }
        const data = await response.json();
        setListing(data);

        const bookingStatusResponse = await fetch(
          `${API_URL}/book-status/${id}?user_id=${user.id}`
        );
        if (!bookingStatusResponse.ok) {
          throw new Error(
            `Failed to fetch booking status: ${bookingStatusResponse.status}`
          );
        }
        const status = await bookingStatusResponse.json();
        setIsBooked(status.isBooked);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        Alert.alert("Error", "Failed to load trip details.");
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBook = async () => {
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

      const response = await fetch(`${API_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, trip_id: id }),
      });

      if (response.ok) {
        Alert.alert("Success", "Trip booked successfully!");
        setIsBooked(true);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to book the trip.");
      }
    } catch (error) {
      console.error("Error booking trip:", error);
      Alert.alert("Error", "An unexpected error occurred.");
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
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to cancel the trip.");
      }
    } catch (error) {
      console.error("Error canceling trip:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primaryColor}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  if (!listing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: Colors.black }}>Listing not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/home")} // Quay lại trang Home
              style={{
                marginLeft: 10,
                padding: 10,
              }}
            >
              <FontAwesome5 name="arrow-left" size={20} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          {listing && listing.image ? (
            <Image source={{ uri: listing.image }} style={styles.image} />
          ) : (
            <ActivityIndicator size="large" color="blue" />
          )}
          <View style={styles.contentWrapper}>
            <Text style={styles.listName}>{listing?.name}</Text>
            <View style={styles.listLocation}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primaryColor}
              />
              <Text style={styles.listLocationTxt}>{listing?.location}</Text>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={16} color={Colors.primaryColor} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Duration</Text>
                  <Text style={styles.highlightTxtVal}>
                    {listing?.duration}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <FontAwesome5
                    name="dollar-sign"
                    size={16}
                    color={Colors.primaryColor}
                  />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Price</Text>
                  <Text style={styles.highlightTxtVal}>{listing?.price}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={16} color={Colors.primaryColor} />
                </View>
                <View>
                  <Text style={styles.highlightTxt}>Rating</Text>
                  <Text style={styles.highlightTxtVal}>{listing?.rating}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.listDetails}>{listing?.description}</Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {isBooked ? (
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.footerBtn, { backgroundColor: "red" }]}
          >
            <Text style={styles.footerBtnTxt}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleBook} style={styles.footerBtn}>
            <Text style={styles.footerBtnTxt}>Book now</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ListingDetails;

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width,
    height: 300,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentWrapper: {
    padding: 20,
  },
  listName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  listLocation: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  listLocationTxt: {
    fontSize: 16,
    marginLeft: 5,
    color: Colors.black,
  },
  highlightWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
  },
  listDetails: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: Dimensions.get("window").width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
