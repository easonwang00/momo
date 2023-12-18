import React, { createContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
export const FlowLoadingContext = createContext();

const FlowSummary = ({ visible, title, content, onIgnorePress, onTakeALookPress, flowId }) => {
  const [slideAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.popup}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={onIgnorePress}>
            <Text style={{ color: "#999999", backgroundColor: "#FFFFFF" }}>Ignore</Text>
          </TouchableOpacity>
          {flowId ? (
            <TouchableOpacity style={styles.button2} onPress={onTakeALookPress}>
              <Text style={{ color: "#FFFFFF", backgroundColor: "#645FA9" }}>Take a Look</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    bottom: 0,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#7461FF",
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button1: {
    padding: 10,
    backgroundColor: "#fff",
    color: "#999999",
    borderRadius: 5,
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  button2: {
    padding: 10,
    backgroundColor: "#645FA9",
    borderRadius: 100,
    color: "#FFF",
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
});

export default FlowSummary;
