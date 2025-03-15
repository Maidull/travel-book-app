import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import destinationsCategories from "@/data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    onCategoryChanged: (category: string) => void;
} 

const CategoryBtn = ({ onCategoryChanged }: Props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const destinationsCategories = [
        { key: "vietnam", title: "Vietnam", iconName: "map" },
        { key: "global", title: "Global", iconName: "earth" },
        { key: "island", title: "Island", iconName: "island" },
        { key: "moutain", title: "Mountain", iconName: "moutain" },
        { key: "beach", title: "Beach", iconName: "beach" },
      ];
  
    const handleSelectCategory = (index: number) => {
      const selectedCategory = destinationsCategories[index].key; 
      setActiveIndex(index);
      onCategoryChanged(selectedCategory); 
    };
  
    return (
      <View>
        <Text style={styles.title}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 20,
            paddingVertical: 10,
            marginBottom: 10,
          }}
        >
          {destinationsCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectCategory(index)}
              style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
            >
              <Text style={activeIndex === index ? styles.categoryBtnTxtActive : styles.categoryTxt}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

export default CategoryBtn;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.black,
    },
    categoryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryBtnActive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryTxt: {
        marginLeft: 5,
        color: Colors.black,
    },
    categoryBtnTxtActive: {
        marginLeft: 5,
        color: Colors.white,
    },
});
