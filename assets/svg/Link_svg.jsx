import { View } from "react-native";
import React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
export default function Link_svg({ style }) {
  return (
    <View style={style}>
      <Svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M11.25 18.75l7.5-7.5m-5-3.75l.579-.67a6.25 6.25 0 018.839 8.84l-.668.58m-6.25 6.25l-.496.668a6.335 6.335 0 01-8.909 0 6.215 6.215 0 010-8.839l.655-.579"
          stroke="#959595"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
