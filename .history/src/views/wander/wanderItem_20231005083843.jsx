import React, { useEffect, useState, Component } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WanderItem = ({ item, questionClick }) => {
  const [ask, setAsk] = useState("");
  // if (!item.image) {
  //   item.image = require("../../../assets/wander-bg.png");
  // }

  return (
    <View style={{ width: windowWidth, height: windowHeight, backgroundColor: "#000000" }}>
      <ImageBackground
        resizeMode="cover"
        style={{ flex: 1, width: windowWidth, height: windowHeight }}
        source={{ uri: item.image }}
        defaultSource={require("../../../assets/wander-bg.png")}
      >
        <View
          style={{
            backgroundColor: "rgba(51, 51, 51, 0.55)",
            width: windowWidth,
            height: windowHeight,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#FFF",
              marginHorizontal: 22,
              marginTop: 130,

              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.40)",
            }}
          >
            {item.topic}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 13,
              marginHorizontal: 22,
              marginTop: 90,
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.40)",
            }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../../assets/wanderflow.png")}
            />
            <Text style={{ color: "#FFF", fontSize: 16, lineHeight: 20, fontWeight: 600 }}>
              Howdy! I picked some interesting bits for you. Swipe up and explore, or select a
              prompt to dive in!
            </Text>
          </View>

          <View
            style={{
              marginLeft: 22,
              marginRight: 22,
              flexDirection: "column",
              gap: 26,
              marginTop: 34,
            }}
          >
            {(item.wander_question || []).map(q => (
              <TouchableOpacity key={q} onPress={() => questionClick(item, q)}>
                <View
                  style={{
                    borderRadius: 12,
                    opacity: 0.8,
                    backgroundColor: "#FFF",
                    paddingHorizontal: 8,
                    paddingVertical: 16,
                  }}
                >
                  <Text style={{ color: "#1529C7", fontSize: 16, lineHeight: 20, fontWeight: 600 }}>
                    {q}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              flexDirection: "row",
              padding: 20,
              paddingTop: 40,
              paddingRight: 50,
            }}
          >
            <TextInput
              placeholder="I am curious about something else"
              style={{
                height: 24,
                width: 320,
                color: "#FFF",
                paddingRight: 6,
                textAlign: "right",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.40)",
              }}
              onChangeText={t => setAsk(t)}
            />
            <TouchableOpacity onPress={() => questionClick(item, ask)}>
              <Image
                style={{ width: 18, height: 18 }}
                source={require("../../../assets/edit.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default React.memo(WanderItem);
