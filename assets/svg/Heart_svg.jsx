import { View } from "react-native";
import React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
export default function Heart_svg({ style, isFilled }) {
  return (
    <View style={style}>
      {isFilled ? (
        <Svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path
            d="M6.251 4.316A4.583 4.583 0 001.668 8.9c0 4.583 5.417 8.75 8.333 9.719 2.917-.97 8.334-5.136 8.334-9.72A4.583 4.583 0 0010 6.265a4.578 4.578 0 00-3.75-1.948z"
            fill="#F36262"
            stroke="#F36262"
            strokeWidth={1.66667}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path
            d="M6.251 3.367a4.583 4.583 0 00-4.583 4.584c0 4.583 5.417 8.75 8.333 9.719 2.917-.97 8.334-5.136 8.334-9.72A4.583 4.583 0 0010 5.316a4.578 4.578 0 00-3.75-1.948z"
            stroke="#fff"
            strokeWidth={1.66667}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
}
