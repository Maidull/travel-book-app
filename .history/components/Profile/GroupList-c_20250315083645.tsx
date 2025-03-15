import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { GroupType } from "@/types/groupType";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const GroupListing = ({ listing }: { listing: GroupType[] }) => {
  const renderItem: ListRenderItem<GroupType> = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text style={styles.itemTxt}>{item.name}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Ionicons name="star" size={20} color={Colors.PRIMARY} />
            <Text style={styles.itemRating}>{item.rating}</Text>
            <Text style={styles.itemReviews}>({item.reviews})</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{ marginVertical: 20 }}>
      <FlatList
        data={listing}
        renderItem={renderItem}
        // horizontal
        keyExtractor={(item) => item.id.toString()}
        // showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default GroupListing;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  item: {
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
    color: "#999",
    marginLeft: 5,
  },
});
