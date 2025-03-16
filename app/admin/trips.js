import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import API_URL from "../../services/config";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import CategoryBtn from "@/components/CategoryBtn";

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [editedTrip, setEditedTrip] = useState({});
    const [newTrip, setNewTrip] = useState({ name: "", location: "", price: "", image: "", category: "", description: "", duration: "" });
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const router = useRouter();

    const fetchTrips = async () => {
        try {
            const response = await fetch(`${API_URL}/trips`);
            const data = await response.json();
            setTrips(data);
            setFilteredTrips(data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    };

    const handleSearch = () => {
        if (searchText.trim() === "") {
            setFilteredTrips(trips.filter(
                (trip) => selectedCategory === "all" || trip.category.toLowerCase() === selectedCategory.toLowerCase()
            ));
        } else {
            const filtered = trips.filter((trip) =>
                trip.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredTrips(filtered);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "all") {
            setFilteredTrips(trips);
        } else {
            const filtered = trips.filter(
                (trip) => trip.category.toLowerCase() === category.toLowerCase()
            );
            setFilteredTrips(filtered);
        }
    };

    const handleDeleteTrip = async (id) => {
        try {
            const response = await fetch(`${API_URL}/trips/${id}`, { method: "DELETE" });
            if (response.ok) {
                Alert.alert("Success", "Trip deleted successfully!");
                fetchTrips(); // Làm mới danh sách trips
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.error || "Failed to delete trip!");
            }
        } catch (error) {
            console.error("Error deleting trip:", error);
            Alert.alert("Error", "An unexpected error occurred while deleting the trip.");
        }
    };

    const confirmDeleteTrip = (id) => {
        Alert.alert(
            "Delete Trip",
            "Are you sure you want to delete this trip?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => handleDeleteTrip(id) },
            ],
            { cancelable: true }
        );
    };

    const handleEditTrip = (trip) => {
        setSelectedTrip(trip);
        setEditedTrip(trip);
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editedTrip.name || !editedTrip.location || !editedTrip.price || !editedTrip.image || !editedTrip.category || !editedTrip.description || !editedTrip.duration) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/trips/${selectedTrip.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedTrip),
            });

            if (response.ok) {
                Alert.alert("Success", "Trip updated successfully!");
                setEditModalVisible(false);
                fetchTrips(); // Làm mới danh sách trips
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.error || "Failed to update trip!");
            }
        } catch (error) {
            console.error("Error updating trip:", error);
            Alert.alert("Error", "An unexpected error occurred while updating the trip.");
        }
    };

    const handleAddTrip = async () => {
        if (!newTrip.name || !newTrip.location || !newTrip.price || !newTrip.image || !newTrip.category || !newTrip.description || !newTrip.duration) {
            Alert.alert("Error", "All fields except rating are required!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/trips`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTrip),
            });

            if (response.ok) {
                Alert.alert("Success", "Trip added successfully!");
                setAddModalVisible(false);
                setNewTrip({ name: "", location: "", price: "", image: "", category: "", description: "", duration: "", rating: 0 });
                fetchTrips();
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.error || "Failed to add trip!");
            }
        } catch (error) {
            console.error("Error adding trip:", error);
            Alert.alert("Error", "An unexpected error occurred while adding the trip.");
        }
    };

    const handlePickImage = async (setTripState) => {
        Alert.alert(
            "Choose Image",
            "Select an image source",
            [
                {
                    text: "From Library",
                    onPress: async () => {
                        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

                        if (!permissionResult.granted) {
                            Alert.alert("Permission Denied", "You need to allow access to your photos.");
                            return;
                        }

                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        if (!result.canceled) {
                            const selectedImage = result.assets[0].uri;
                            setTripState((prev) => ({ ...prev, image: selectedImage }));
                        }
                    },
                },
                {
                    text: "Enter URL",
                    onPress: () => {
                        Alert.prompt(
                            "Enter Image URL",
                            "Paste the image URL below:",
                            (url) => {
                                if (url) {
                                    setTripState((prev) => ({ ...prev, image: url }));
                                }
                            }
                        );
                    },
                },
                { text: "Cancel", style: "cancel" },
            ],
            { cancelable: true }
        );
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <View style={styles.container}>
            {/* Thanh Tìm Kiếm */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search trips..."
                    placeholderTextColor="gray"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <Ionicons name="search-outline" size={24} color={Colors.primaryColor} />
                </TouchableOpacity>
            </View>

            {/* CategoryBtn */}
            <CategoryBtn onCategoryChanged={handleCategoryChange} />

            <FlatList
                data={filteredTrips}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tripItem}>
                        <Image source={{ uri: item.image }} style={styles.tripImage} />
                        <View style={styles.tripInfo}>
                            <Text style={styles.tripName}>{item.name}</Text>
                            <Text style={styles.tripLocation}>{item.location}</Text>
                            <Text style={styles.tripPrice}>${item.price}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEditTrip(item)} style={styles.iconButton}>
                                <Ionicons name="create-outline" size={24} color={Colors.primaryColor} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDeleteTrip(item.id)} style={styles.iconButton}>
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            {/* Nút Add Trip */}
            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Ionicons name="add-circle" size={60} color={Colors.primaryColor} />
            </TouchableOpacity>

            {/* Modal Thêm Trip */}
            <Modal
                visible={addModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Trip</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Name"
                            placeholderTextColor="gray"
                            value={newTrip.name}
                            onChangeText={(text) => setNewTrip({ ...newTrip, name: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Location"
                            placeholderTextColor="gray"
                            value={newTrip.location}
                            onChangeText={(text) => setNewTrip({ ...newTrip, location: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Price"
                            placeholderTextColor="gray"
                            value={newTrip.price}
                            onChangeText={(text) => setNewTrip({ ...newTrip, price: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Duration"
                            placeholderTextColor="gray"
                            value={newTrip.duration}
                            onChangeText={(text) => setNewTrip({ ...newTrip, duration: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Description"
                            placeholderTextColor="gray"
                            value={newTrip.description}
                            onChangeText={(text) => setNewTrip({ ...newTrip, description: text })}
                        />
                        {/* Chọn Category */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Category"
                            placeholderTextColor="gray"
                            value={newTrip.category}
                            onChangeText={(text) => setNewTrip({ ...newTrip, category: text })}
                        />
                        {/* Hiển Thị Ảnh */}
                        {newTrip.image && (
                            <Image source={{ uri: newTrip.image }} style={styles.tripImagePreview} />
                        )}
                        {/* Nút Chọn Ảnh */}
                        <TouchableOpacity style={styles.imagePickerButton} onPress={() => handlePickImage(setNewTrip)}>
                            <Text style={styles.buttonText}>Choose Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddTrip}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: "red" }]}
                            onPress={() => setAddModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Chỉnh Sửa Trip */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Trip</Text>
                        {/* Name */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Name"
                            placeholderTextColor="gray"
                            value={editedTrip.name}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, name: text })}
                        />
                        {/* Location */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Location"
                            placeholderTextColor="gray"
                            value={editedTrip.location}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, location: text })}
                        />
                        {/* Price */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Price"
                            placeholderTextColor="gray"
                            value={editedTrip.price}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, price: text })}
                            keyboardType="numeric"
                        />
                        {/* Duration */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Duration"
                            placeholderTextColor="gray"
                            value={editedTrip.duration}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, duration: text })}
                        />
                        {/* Description */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Description"
                            placeholderTextColor="gray"
                            value={editedTrip.description}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, description: text })}
                        />
                        {/* Category */}
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Category"
                            placeholderTextColor="gray"
                            value={editedTrip.category}
                            onChangeText={(text) => setEditedTrip({ ...editedTrip, category: text })}
                        />
                        {/* Hiển Thị Ảnh */}
                        {editedTrip.image && (
                            <Image source={{ uri: editedTrip.image }} style={styles.tripImagePreview} />
                        )}
                        {/* Nút Chọn Ảnh */}
                        <TouchableOpacity style={styles.imagePickerButton} onPress={() => handlePickImage(setEditedTrip)}>
                            <Text style={styles.buttonText}>Choose Image</Text>
                        </TouchableOpacity>
                        {/* Nút Lưu */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        {/* Nút Hủy */}
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: "red" }]}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    tripItem: {
        flexDirection: "row",
        marginBottom: 15,
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    tripImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    tripInfo: {
        flex: 1,
        justifyContent: "center",
    },
    tripName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    tripLocation: {
        fontSize: 14,
        color: Colors.gray,
        marginBottom: 5,
    },
    tripPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primaryColor,
    },
    actions: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconButton: {
        marginBottom: 5,
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalInput: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ddd",
        backgroundColor: "#f5f5f5",
        marginBottom: 10,
    },
    saveButton: {
        width: "100%",
        padding: 15,
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    tripImagePreview: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    imagePickerButton: {
        width: "100%",
        padding: 15,
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    picker: {
        width: "100%",
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: "#000",
    },
    searchButton: {
        padding: 5,
    },
});