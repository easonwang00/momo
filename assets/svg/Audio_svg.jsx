import { View } from "react-native";
import React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
export default function Audio_svg({ style }) {
  return (
    <View style={style}>
      <Svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Mask
          id="a"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={21}
          height={21}
        >
          <Path fill="#D9D9D9" d="M0 0H21V21H0z" />
        </Mask>
        <G mask="url(#a)">
          <Path
            d="M6.125 15.75V5.25h1.75v10.5h-1.75zm3.5 3.5V1.75h1.75v17.5h-1.75zm-7-7v-3.5h1.75v3.5h-1.75zm10.5 3.5V5.25h1.75v10.5h-1.75zm3.5-3.5v-3.5h1.75v3.5h-1.75z"
            fill="#575757"
          />
        </G>
      </Svg>
    </View>
  );
}
