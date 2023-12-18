import { View, Text, Image } from "react-native";
import React from "react";
import Constants from "expo-constants";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Explore() {
  const bottomBarHeight = useSafeAreaInsets().bottom + 56;
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Image
        resizeMode="cover"
        style={{ width: "100%", height: "100%", position: "absolute" }}
        defaultSource={require("../../../assets/explore_bg.png")}
      ></Image>
      <BlurView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.35)",
          position: "absolute",
        }}
        intensity={30}
      ></BlurView>
      <View
        style={{
          width: "100%",
          height: "100%",
          marginTop: Constants.statusBarHeight == 0 ? 5 : Constants.statusBarHeight - 10,
          paddingTop: 35,
          paddingBottom: bottomBarHeight,
          paddingHorizontal: 30,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 30, fontFamily: "Magra-Bold", lineHeight: 45 }}>
          {"Explore your world,\nyour way\nfun but also deep"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontFamily: "Magra-Regular",
            marginTop: 50,
            lineHeight: 20,
          }}
        >
          {"Be ready to dive into your “life\nencyclopedia”, coming soon!"}
        </Text>
      </View>
    </View>
  );
}
