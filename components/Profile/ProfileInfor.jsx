import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function ProfileInfor() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
      }}
    >
      <Image
        source={{
          uri: "https://static-cse.canva.com/blob/1806762/1600w-vkBvE1d_xYA.jpg",
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 99,
        }}
      />
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
        }}
      >
        Mai
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 16,
        }}
      >
        mai2@gmail.com
      </Text>
    </View>
  );
}

