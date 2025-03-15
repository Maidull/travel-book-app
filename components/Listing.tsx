import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Colors } from "@/constants/Colors";
  import { FontAwesome5, Ionicons } from "@expo/vector-icons";
  import API_URL from "../services/config";
  
  interface Trip {
    id: number;
    name: string;
    image: string;
    description: string;
    rating: number;
    price: number;
    duration: string;
    location: string;
    category: string;
  }

  interface ListingProps {
    category: string;
    onTripClick: (id: number) => void;
}

  
const Listing: React.FC<ListingProps> = ({ category, onTripClick }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Category received in Listing:", category);

    const url = `${API_URL}/trips?category=${encodeURIComponent(category)}`;
    console.log("Fetching URL:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data: Trip[]) => {
        console.log("Fetched data:", data);
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch trips:", error.message);
        setLoading(false);
      });
  }, [category]);

  const renderItem = ({ item }: { item: Trip }) => {
    return (
      <TouchableOpacity onPress={() => onTripClick(item.id)}>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.bookmark}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
          </View>
          <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                color={Colors.primaryColor}
              />
              <Text style={styles.itemLocationTxt}>{item.location}</Text>
            </View>
            <Text style={styles.itemPriceTxt}>${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View>
      <FlatList
        data={trips}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Listing;
  

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    width: 220,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  bookmark: {
    position: "absolute",
    top: 185,
    right: 30,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
});
