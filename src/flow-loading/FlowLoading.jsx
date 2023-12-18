import React, { createContext } from "react";
import { View, Text } from "react-native";
export const FlowLoadingContext = createContext();

const FlowLoading = ({ message }) => {
  return (
    <View
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(116, 97, 255, 0.8)",
        paddingTop: 14,
        paddingBottom: 14,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        color: "#FFF",
      }}
    >
      <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>{message}</Text>
    </View>
  );
};

export default FlowLoading;
