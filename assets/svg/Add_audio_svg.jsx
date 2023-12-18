import { View } from "react-native";
import React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
export default function Add_audio_svg({ style }) {
  return (
    <View style={style}>
      {/* <Svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Mask
          id="a"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
        >
          <Path fill="#D9D9D9" d="M0 0.5H24V24.5H0z" />
        </Mask>
        <G mask="url(#a)">
          <Path
            d="M7 18.5v-12h2v12H7zm4 4v-20h2v20h-2zm-8-8v-4h2v4H3zm12 4v-12h2v12h-2zm4-4v-4h2v4h-2z"
            fill="#575757"
          />
        </G>
      </Svg> */}
      <Svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M15 7.5v15m-3.75-11.25v7.5m11.25-5v2.5m-15-2.5v2.5m11.25-7.5v12.5M7.5 3.75H3.75V7.5M22.5 3.75h3.75V7.5M7.5 26.25H3.75V22.5m18.75 3.75h3.75V22.5"
          stroke="#959595"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
