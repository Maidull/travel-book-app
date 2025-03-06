import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Ionicons } from "@expo/vector-icons";
import {useHeaderHeight} from '@react-navigation/elements';
import CategoryBtn from "@/components/CategoryBtn";
import Listing from "@/components/Listing";

const Page = () => {
    const HeaderHeight = useHeaderHeight();
    const [category, setCategory] = useState('Viet Nam');

    const onCatChanged = (category:string) => {
        console.log("Category:",category);
        setCategory(category);
    }

    return (
        <>
        <Stack.Screen options={{
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => (
                <TouchableOpacity onPress={() => {}}>
                    <Image source={{uri: ""
                    }}
                    style={{ width: 40, height: 40, borderRadius:10}}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => {}}
                    style={{
                        marginRight: 20,
                        backgroundColor: Colors.white,
                        padding:10,
                        borderRadius:10,
                        shadowColor:"#171717",
                        shadowOffset: {width: 2, height: 4},
                        shadowOpacity: 0.2,
                        shadowRadius:3,
                    }}
                    >
                        <Ionicons name="search" size={20} color={Colors.black} />
                </TouchableOpacity>
            ),
        }}
        />
        <View style={[styles.container, {paddingTop:HeaderHeight}]}>
            <Text style={styles.headingTxt}>Explore the World</Text>

            <View style={styles.searchSectionWrapper}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={25} style={{marginRight:10}} color={Colors.black}/>
                    <TextInput placeholder="Search"/>
                </View>
                <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
                    <Ionicons name="options" size={28} color={Colors.black}/>
                </TouchableOpacity>
            </View>

            <CategoryBtn onCategoryChanged={setCategory} />
            <Listing category={category} />
        </View>
        </>
    );
};

export default Page

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        backgroundColor: Colors.bgColor,
    },
    headingTxt: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.black,
        marginTop: 10,
    },
    searchSectionWrapper:{
        flexDirection:'row',
        marginVertical: 20,
    },
    searchBar:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: Colors.white,
        padding: 7,
        borderRadius: 10,
    },
    filterBtn:{
        backgroundColor: Colors.primaryColor,
        padding: 12,
        borderRadius: 10,
        marginLeft: 20,
    },
})