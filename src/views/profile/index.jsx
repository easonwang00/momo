import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();

  // Static fake data for demonstration
  const userInfo = {
    name: "Yi Hao",
    age: "18",
    university: "University of Toronto",
    followers: "5.1万",
    likes: "4393",
    avatar: "https://cdn.dribbble.com/users/3305260/screenshots/6570213/ord_4x.jpg?resize=400x0", // Replace with actual image path
    backgroundImage:
      "https://garden.spoonflower.com/c/14309294/p/f/m/jKNg2IAJxsG3QifT-NWmUClLBvFW8i2vGSF8NdgaH6F26Ke8b7Ka/Rainbow%20baby%20%20yellow%20solid.jpg", // Replace with actual image path
    posts: [
      {
        id: "1",
        image:
          "https://i.guim.co.uk/img/static/sys-images/Film/Pix/pictures/2009/12/17/1261051924334/Scene-from-Avatar-2009-001.jpg?width=465&dpr=1&s=none",
      }, // Replace with actual image paths
      {
        id: "2",
        image:
          "https://variety.com/wp-content/uploads/2022/02/Screen-Shot-2022-05-09-at-10.04.13-AM.png",
      },
      // ... More posts
    ],
  };

  const renderHeader = () => (
    <View>
      <Image source={{ uri: userInfo.backgroundImage }} style={styles.backgroundImage} />
      <View style={styles.header}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.details}>Age: {userInfo.age}</Text>
          <Text style={styles.details}>{userInfo.university}</Text>
          <View style={styles.stats}>
            <Text style={styles.statItem}>{userInfo.followers} 关注</Text>
            <Text style={styles.statItem}>{userInfo.likes} 赞</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPost = ({ item }) => <Image source={{ uri: item.image }} style={styles.postImage} />;

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={userInfo.posts}
      renderItem={renderPost}
      keyExtractor={item => item.id}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  header: {
    alignItems: "center",
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  details: {
    fontSize: 16,
    color: "#555",
  },
  stats: {
    flexDirection: "row",
    marginTop: 10,
  },
  statItem: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  postImage: {
    width: "33.33%",
    aspectRatio: 1,
    margin: 1,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  // Add more styles as needed
});
