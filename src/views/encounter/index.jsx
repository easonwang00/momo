import { View, Text, Image } from "react-native";
import React from "react";
import Constants from "expo-constants";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Encounter() {
  const bottomBarHeight = useSafeAreaInsets().bottom + 56;
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Image
        resizeMode="cover"
        style={{ width: "100%", height: "100%", position: "absolute" }}
        defaultSource={require("../../../assets/encounter_bg.png")}
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
          Encounter based on Resonance & Mutual Appreciation.
        </Text>
        <Text style={{ color: "white", fontSize: 14, fontFamily: "Magra-Regular", marginTop: 50 }}>
          {"Explore and express more to unlock your soulmates!"}
        </Text>
      </View>
    </View>
  );
}
