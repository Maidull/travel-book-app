import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ListRenderItem,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListingType } from "@/types/tripListingType";
import destinations from "../../data/destinations.json";
import { Colors } from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
type Props = {};

export default function TopTrip(props: Props) {
  const {
    id,
    tour_name,
    description,
    price,
    image,
    location,
    duration,
    average_rating,
  } = useLocalSearchParams();
  const [bookmarkItem, setBookmarkItem] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  const router = useRouter();
  useEffect(() => {
    fetchBookmark();
  }, [isFocused]);
  const fetchBookmark = async () => {
    await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      let items: ListingType[] = [];
      if (res) {
        console.log("Bookmark result: ", res);
        res.forEach((element: string) => {
          let data = destinations.find((val) => val.id == element);
          if (data) {
            items.push(data);
          }
        });
        setBookmarkItem(items);
        setIsLoading(false);
      } else {
        setBookmarkItem([]);
        setIsLoading(false);
      }
    });
  };

  const renderItems: ListRenderItem<ListingType> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/discover/[id]",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                style={{ marginRight: 5 }}
                color={Colors.PRIMARY}
              />
              <Text style={[styles.itemLocationTxt]}>{item.location}</Text>
            </View>
            <Text style={styles.itemPriceTxt}>${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          data={bookmarkItem}
          renderItem={renderItems}
          // horizontal
          showsVerticalScrollIndicator={false}
        ></FlatList>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 10,
    borderRadius: 10,
    width: 300,
    margin: 15,
    // overflow: "hidden",
  },
  image: {
    width: 280,
    height: 250,
    borderRadius: 10,
    marginBottom: 30,
  },
  bookmark: {
    position: "absolute",
    top: 185,
    right: 30,
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  itemTxt: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemLocationTxt: {
    fontSize: 12,
  },
  itemPriceTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.PRIMARY,
  },
});

