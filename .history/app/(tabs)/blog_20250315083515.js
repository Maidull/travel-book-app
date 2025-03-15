import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function Blog() {
  const [posts, setPosts] = useState([]); // Danh sách bài viết
  const [newPostContent, setNewPostContent] = useState(""); // Nội dung bài viết mới
  const [newPostImage, setNewPostImage] = useState(""); // Link ảnh bài viết mới

  const fetchPosts = async () => {
    try {
      const response = await fetch('${API_URL}/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPostContent.trim()) {
      alert("Please enter some content!");
      return;
    }

    try {
      const response = await fetch("${API_URL}/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, // Thay bằng ID người dùng hiện tại
          title: "New Post",
          content: newPostContent,
          image_url: newPostImage,
          location: "Unknown", // Có thể thêm trường location nếu cần
        }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        setNewPostContent("");
        setNewPostImage("");
        fetchPosts(); // Reload danh sách bài viết
      } else {
        alert("Failed to create post!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hộp Đăng Bài */}
      <View style={styles.postBox}>
        <TextInput
          style={styles.postInput}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <TextInput
          style={styles.postInput}
          placeholder="Image URL (optional)"
          value={newPostImage}
          onChangeText={setNewPostImage}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Danh Sách Bài Viết */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postAuthor}>{item.username}</Text>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.postImage} />
            )}
            <View style={styles.postActions}>
              <TouchableOpacity>
                <Text style={styles.postAction}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.postAction}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  postBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  postInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
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
  postAction: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});