import { View } from "react-native";
import React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
//actrually same as chevron-left.png
export default function Back_button({ style }) {
  return (
    <View style={style}>
      <Svg
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 512 512"
      >
        <Path
          d="M352 128.4L319.7 96 160 256 160 256 160 256 319.7 416 352 383.6 224.7 256z"
          fill={style.color}
        />
      </Svg>
    </View>
  );
}
