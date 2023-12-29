import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// Sample data for the feed
const posts = [
  {
    id: "1",
    image:
      "https://t3.ftcdn.net/jpg/02/95/44/22/360_F_295442295_OXsXOmLmqBUfZreTnGo9PREuAPSLQhff.jpg",
    text: "Post 1",
    views: 120,
    likes: 10,
    comments: 5,
  },
  {
    id: "2",
    image: "https://i.pinimg.com/736x/86/10/60/86106086e9594672ad7408913b5a3a24.jpg",
    text: "Post 2",
    views: 500,
    likes: 12,
    comments: 3,
  },
  {
    id: "3",
    image: "https://i.redd.it/rww55f5at2r41.jpg",
    text: "Post 1",
    views: 340,
    likes: 10,
    comments: 5,
  },
  {
    id: "4",
    image:
      "https://www.boredpanda.com/blog/wp-content/uploads/2022/09/relatable-funny-memes-23-63281fd2f1184__700.jpg",
    text: "Post 2",
    views: 67,
    likes: 12,
    comments: 3,
  },
  {
    id: "5",
    image: "https://img-9gag-fun.9cache.com/photo/aA3nQbo_460s.jpg",
    text: "Post 1",
    views: 590,
    likes: 10,
    comments: 5,
  },
  {
    id: "6",
    image:
      "https://thumbor.bigedition.com/funny-travel-memes/6oz5ttHNU4_zDXBVQHY0AnTYleI=/800x570/filters:format(webp):quality(80)/granite-web-prod/5d/ef/5def5cafcf3243bdab9be14d8427291e.jpeg",
    text: "Post 2",
    views: 300,
    likes: 12,
    comments: 3,
  },
  // ... more posts
];

const Feed = () => {
  const [imageHeights, setImageHeights] = useState({});
  const [imageOpacities, setImageOpacities] = useState({}); // Declare imageOpacities state

  const onImageLoad = (event, id) => {
    const { width, height } = event.nativeEvent.source;
    const screenWidth = Dimensions.get("window").width;
    const calculatedHeight = (height * (screenWidth / 2)) / width;
    setImageHeights(prevHeights => ({ ...prevHeights, [id]: calculatedHeight }));

    setImageOpacities(prevOpacities => ({ ...prevOpacities, [id]: 1 })); // Update opacity for the loaded image
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.feedContainer}>
          {posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <Image
                source={{ uri: post.image }}
                style={[
                  styles.image,
                  { height: imageHeights[post.id] || 150, opacity: imageOpacities[post.id] || 0 },
                ]}
                onLoad={event => onImageLoad(event, post.id)}
              />
              <Text style={styles.text}>{post.text}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity>
                  <Text style={styles.iconText}>👀 {post.views}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.iconText}>👍 {post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.iconText}>💬 {post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.iconText}>👭 Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Adjust this value as needed for your navigation bar
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postCard: {
    width: "49%",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    borderRadius: 8,
  },
  text: {
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconText: {
    marginHorizontal: 2, // Add horizontal margin for spacing
    fontSize: 13, // Reduce the font size to make the text smaller
  },
});

export default Feed;
