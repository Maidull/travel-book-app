import {
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoryBtn from "@/components/CategoryBtn";
import Listing from "@/components/Listing";
import API_URL from "../../services/config";

interface Trip {
  id: number;
  name: string;
  image: string;
  location: string;
  price: number;
}

const Page = () => {
  const HeaderHeight = useHeaderHeight();
  const router = useRouter();
  const [category, setCategory] = useState("vietnam");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Trip[]>([]);

  const handleTripClick = (id: number) => {
    router.push(`/${id}` as `/[id]`);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/trips?search=${searchText}`);
      const data: Trip[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching trips:", error);
    }
  };

  return (
    <ScrollView
    style={[styles.container, { paddingTop: HeaderHeight }]}
    contentContainerStyle={{ paddingBottom: 150 }}
  >
          <ImageBackground
        source={{
          uri: "https://img.taotu.cn/ssd/ssd1/1/2022-07-16/1_3499ea38092f05944e78b9f521fc1865.jpg", 
        }}
        style={styles.imageBackground}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View style={styles.searchSectionWrapper}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={28}
              style={{ marginRight: 15 }}
              color={Colors.white}
              onPress={handleSearch}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                if (text === "") {
                  setSearchResults([]);
                }
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ImageBackground>
    <CategoryBtn onCategoryChanged={setCategory} />
    <Listing category={category} onTripClick={handleTripClick} />

    {searchResults.length > 0 && (
      <>
        <Text style={styles.searchResultsTitle}>Search Results</Text>
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTripClick(item.id)}>
              <View style={styles.searchResultItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.searchResultImage}
                />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={styles.searchResultLocation}>
                    {item.location}
                  </Text>
                  <Text style={styles.searchResultPrice}>
                    ${item.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} 
        />
      </>
    )}
  </ScrollView>
);
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor,
  },
  imageBackground: {
    width: "100%",
    height: 125, 
    justifyContent: "center",
    borderRadius: 10,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  searchResultsWrapper: {
    marginTop: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
  },
  searchResultImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: "center",
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchResultLocation: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 5,
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
});
