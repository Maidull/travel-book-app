import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../services/config";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsByPost, setCommentsByPost] = useState({});
  const [user, setUser] = useState({ name: "User", image: null });

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL + "/posts");
      const data = await response.json();

      const commentsData = {};
      for (const post of data) {
        const commentsResponse = await fetch(`${API_URL}/comments/${post.id}`);
        const comments = await commentsResponse.json();
        commentsData[post.id] = comments.slice(0, 2);
      }

      setPosts(data);
      setCommentsByPost(commentsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async (postId, loadMore = false) => {
    try {
      const response = await fetch(`${API_URL}/comments/${postId}`);
      const data = await response.json();

      setCommentsByPost((prev) => {
        const existingComments = prev[postId] || [];
        const newComments = loadMore
          ? [...existingComments, ...data].filter(
            (comment, index, self) =>
              index === self.findIndex((c) => c.id === comment.id)
          )
          : data.slice(0, 2);
        return {
          ...prev,
          [postId]: newComments,
        };
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const getUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    };
    getUserInfo();
  }, []);

  const handlePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert("Error", "Please enter some content!");
      return;
    }

    try {
      const response = await fetch(API_URL + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          content: newPostContent,
          image_url: newPostImage,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        setNewPostContent("");
        setNewPostImage(null);
        fetchPosts();
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to create post!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const pickImage = async () => {
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
      setNewPostImage(result.assets[0].uri);
    }
  };

  const handleLike = async (postId, liked) => {
    try {
      const url = `${API_URL}/likes`;
      const method = liked ? "DELETE" : "POST";

      const response = await fetch(
        liked ? `${url}/${postId}/${user.id}` : url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: !liked ? JSON.stringify({ post_id: postId, user_id: user.id }) : null,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                ...post,
                liked: !liked, 
                likes_count: liked ? post.likes_count - 1 : post.likes_count + 1, 
              }
              : post
          )
        );
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || (liked ? "Failed to unlike post!" : "Failed to like post!"));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment!");
      return;
    }

    try {
      const response = await fetch(API_URL + "/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: selectedPostId,
          user_id: user.id,
          content: newComment,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Comment added successfully!");
        setNewComment("");
        fetchComments(selectedPostId);
        fetchPosts();
      } else {
        Alert.alert("Error", "Failed to add comment!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Đã xóa bài đăng thành công!");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        Alert.alert("Error", data.error || "Không thể xóa bài đăng!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Đã xảy ra lỗi khi xóa bài đăng!");
    }
  };

  const confirmDeletePost = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeletePost(postId),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Phần Đầu Trang Blog */}
      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{
            uri: user.image || "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp",
          }}
          style={styles.avatar}
        />
        <TextInput
          style={styles.input}
          placeholder={`Hey ${user.name} what's on your mind?`}
          placeholderTextColor="gray"
          editable={false}
        />
      </TouchableOpacity>

      {/* Hộp Thoại Đăng Bài */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What's on your mind?"
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Ionicons name="image" size={30} color="gray" />
              <Text style={styles.imagePickerText}>Pick Image</Text>
            </TouchableOpacity>
            {newPostImage && (
              <Image source={{ uri: newPostImage }} style={styles.previewImage} />
            )}
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.postButton, { backgroundColor: "red" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.postButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hộp Thoại Comment */}
      <Modal
        visible={commentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What do you think?"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.postButton} onPress={handleComment}>
              <Text style={styles.postButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.postButton, { backgroundColor: "red" }]}
              onPress={() => setCommentModalVisible(false)}
            >
              <Text style={styles.postButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Danh Sách Bài Viết */}
      <ScrollView style={styles.container}>
        {posts.map((item) => (
          <View key={item.id} style={styles.postItem}>
            <View style={styles.postHeader}>
              <Image
                source={{
                  uri: item.user_image || "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp",
                }}
                style={styles.postAvatar}
              />
              <Text style={styles.postAuthor}>{item.name}</Text>

              {item.user_id === user.id && (
                <TouchableOpacity
                  onPress={() => confirmDeletePost(item.id)}
                  style={styles.trashIcon}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>

            {/* Nội Dung Bài Viết */}
            < Text style={styles.postContent} > {item.content}</Text>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.postImage} />
            )}

            {/* Hành Động */}
            <View style={styles.postActions}>
              <TouchableOpacity onPress={() => handleLike(item.id, item.liked)}>
                <Ionicons
                  name={item.liked ? "heart" : "heart-outline"} 
                  size={24}
                  color={item.liked ? "red" : "gray"} 
                />
                <Text>{item.likes_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPostId(item.id);
                  fetchComments(item.id);
                  setCommentModalVisible(true);
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="gray" />
                <Text>{item.comments_count}</Text>
              </TouchableOpacity>
            </View>

            {/* Danh Sách Comment */}
            <FlatList
              data={commentsByPost[item.id] || []}
              renderItem={({ item: comment }) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>{comment.name}</Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              )}
              keyExtractor={(comment) => comment.id.toString()}
              style={styles.commentList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              onEndReached={() => fetchComments(item.id, true)}
              onEndReachedThreshold={0.5}
            />
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    color: "gray",
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
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    marginLeft: 10,
    color: "gray",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#6ad1f5",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  postAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentContent: {
    color: "gray",
  },
  commentList: {
    maxHeight: 100,
    marginTop: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  trashIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});