import { View, ImageBackground, Dimensions, ActivityIndicator } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function (props) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        source={require("../../assets/wander-bg.png")}
      >
        <ActivityIndicator size="large" />
      </ImageBackground>
    </View>
  );
}
