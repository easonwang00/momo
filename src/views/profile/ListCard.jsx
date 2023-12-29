import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo"; // Import useAuth hook
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import useSafeAreaInsets

const ListCard = ({ data }) => {
  const { signOut } = useAuth(); // Use the signOut function from useAuth
  const insets = useSafeAreaInsets(); // Get safe area insets

  const handleSignOut = async () => {
    try {
      await signOut();
      // Add any additional actions you want to perform after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Logout Failed", "Unable to sign out at this time.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {/* Additional content can go here */}
    </View>
  );

  return (
    <View style={{ paddingBottom: insets.bottom }}>
      {/* Apply bottom inset for safe area */}
      <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff6347", // Example color, change as needed
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // Add more styles as needed
});

export default ListCard;
