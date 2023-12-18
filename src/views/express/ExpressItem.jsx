import React from "react";
import {
  Dimensions,
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Add_audio_svg from "../../../assets/svg/Add_audio_svg";
import Add_photo_svg from "../../../assets/svg/Add_photo_svg";
import { BlurView } from "expo-blur";
import { useUser } from "@clerk/clerk-react";
import { LinearGradient } from "expo-linear-gradient";
//import ExpressTextEditor from "../../components/ExpressTextEditor";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ExpressItem = ({ item, createExpress }) => {
  //console.log(item);
  const { user } = useUser();
  const bottomBarHeight = useSafeAreaInsets().bottom + 56;
  //Deperacated Dialog View to Creact Express
  //const [isShowDialog, setIsShowDialog] = useState(false);
  const renderContent = () => {
    return (
      <>
        <View name="answerBox" style={styles.answerBox}>
          <TouchableOpacity style={styles.answerBoxWhite} onPress={() => createExpress(item)}>
            <View style={styles.svg}>
              <Add_audio_svg style={{ flex: 1, justifyContent: "center" }} />
              {/* <Add_photo_svg style={{ flex: 1, justifyContent: "center", marginRight: 5 }} /> */}
            </View>
            <View style={styles.answerBoxText}>
              <Text style={{ fontSize: 14, color: "#7F7F7F" }}>Answer to see who resonates...</Text>
            </View>
          </TouchableOpacity>
          <Image style={styles.userIcon} source={{ uri: user.imageUrl ? user.imageUrl : "" }} />

          {/* Deperacated Dialog View to Creact Express */}
          {/* <ExpressTextEditor
                  item={item}
                  isShowDialog={isShowDialog}
                  setIsShowDialog={setIsShowDialog}
                  createExpress={createExpress}
                /> */}
        </View>

        <LinearGradient
          colors={["rgba(255,255,255,0.3)", "transparent"]}
          style={{
            height: 8,
            marginHorizontal: 15,
            //borderRadius: 10,
            marginBottom: 12,
            //backgroundColor: "rgba(255,255,255,0.8)",
            zIndex: 3,
          }}
        ></LinearGradient>
        <View name="expressionBoxHidden" style={styles.expressionBoxHidden}>
          <LinearGradient
            name="hiddenWhiteGradient"
            colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.3)"]}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              //backgroundColor: "rgba(255,255,255,0.8)",
            }}
          ></LinearGradient>
          <Image style={styles.expressionUserIcon} source={{ uri: item.creator_image_2 }} />
          <View name="expressionTextView" style={styles.expressionTextView}>
            <Text style={styles.expressionText}>{item.express_answer_locked}</Text>
          </View>
        </View>

        <View name="expressionBox" style={styles.expressionBox}>
          <Image style={styles.expressionUserIcon} source={{ uri: item.creator_image }} />
          <View name="expressionTextView" style={styles.expressionTextView}>
            <Text style={styles.expressionText} numberOfLines={2} ellipsizeMode="tail">
              {item.express_answer}
            </Text>
          </View>
        </View>

        <View name="expressionBoxWander" style={styles.expressionBoxWander}>
          <View name="expressionTextViewWander" style={styles.expressionTextView}>
            <Text style={styles.expressionTextWander}>{item.wander_word}</Text>
          </View>
        </View>

        <View name="wanderAvatar" style={styles.wanderAvatarView}>
          <Image style={styles.wanderIcon} source={require("../../../assets/wander.png")} />
          <Text style={{ color: "white", fontSize: 14 }}>Wander</Text>
        </View>

        <View name="questionView" style={styles.questionView}>
          <Text
            style={{
              color: "white",
              fontSize: 25,
              textAlign: "center",
              fontWeight: 600,
              fontFamily: "Magra-Bold",
            }}
          >
            {item.express_question}
          </Text>
        </View>
      </>
    );
  };
  return (
    <View style={{ width: "100%", height: windowHeight }}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <View
          name="backgroundLayer"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <Image
            resizeMode="cover"
            style={{ width: windowWidth * 1.3, height: windowWidth * 1.3 }}
            source={{ uri: item.express_image ? item.express_image : "" }}
            defaultSource={require("../../../assets/wander-bg.png")}
          ></Image>
          <View
            style={{
              width: windowWidth,
              height: "100%",
              position: "absolute",
              flexDirection: "column",
            }}
          >
            <View
              name="dummyView"
              style={{
                width: windowWidth,
                height: windowWidth * 0.75,
              }}
            ></View>
            <LinearGradient
              colors={["transparent", "#383838"]}
              style={{
                width: windowWidth,
                height: windowWidth * 0.5,
              }}
            />
            <View style={{ flex: 1, width: windowWidth, backgroundColor: "#383838" }}></View>
          </View>
        </View>
        <View style={[styles.shadowBackgroundView, { paddingBottom: 12 + bottomBarHeight }]}>
          <View style={styles.darkLayer}>
            <View
              style={{
                width: "100%",
                flexDirection: "column-reverse",
              }}
            >
              <BlurView
                name="blurLayerButtom"
                intensity={30}
                style={[styles.blurLayer, { zIndex: 1 }]}
              ></BlurView>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  borderRadius: 10,
                  zIndex: 3,
                  backgroundColor: "rgba(0, 0, 0, 0.42)",
                }}
              ></View>
              <BlurView
                name="blurLayerForHidden"
                intensity={10}
                style={[styles.blurLayer, { zIndex: 4 }]}
              ></BlurView>

              {renderContent()}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBackgroundView: {
    backgroundColor: "rgba(51, 51, 51, 0.1)",
    width: "100%",
    height: "100%",
    flexDirection: "column-reverse",
  },
  blurLayer: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: "absolute",
  },
  darkLayer: {
    //flex: 1,
    marginHorizontal: 12,
    //borderRadius: 10,
    //backgroundColor: "rgba(51, 51, 51, 0.3)",
    flexDirection: "column-reverse",
    //overflow: "hidden",
  },
  answerBox: {
    height: 42,
    marginHorizontal: 15,
    marginBottom: 20,
    flexDirection: "row",
    zIndex: 5,
    //backgroundColor: "pink",
  },
  answerBoxWhite: {
    flex: 1,
    backgroundColor: "white",
    //marginRight: 8,
    borderRadius: 10,
    flexDirection: "row-reverse",
    justifyContent: "center",
  },
  answerBoxText: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },
  svg: {
    height: 30,
    width: 30,
    marginHorizontal: 13,
    alignSelf: "center",
    flexDirection: "row-reverse",
  },
  userIcon: {
    width: 42,
    height: 42,
    borderRadius: 42,
    marginLeft: 8,
  },
  expressionUserIcon: {
    width: 36,
    height: 36,
    borderRadius: 36,
    marginHorizontal: 13,
    marginVertical: 13,
  },
  wanderIcon: {
    width: 23,
    height: 23,
    borderRadius: 23,
    marginLeft: 15,
    marginRight: 5,
    marginVertical: 5,
    backgroundColor: "white",
    resizeMode: "cover",
  },
  expressionBox: {
    backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
  expressionBoxHidden: {
    //backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 15,
    //borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 0,
    height: 37,
    //height: 40,
    flexDirection: "row",
    //alignItems: "center",
    overflow: "hidden",
    zIndex: 3,
  },
  expressionTextView: {
    flex: 1,
  },
  expressionBoxWander: {
    backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    zIndex: 5,
  },
  expressionText: {
    marginRight: 10,
    marginVertical: 10,
    fontSize: 14,
  },
  expressionTextWander: {
    marginHorizontal: 15,
    marginVertical: 15,
    fontSize: 14,
    flexWrap: "wrap",
  },
  wanderAvatarView: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
  questionView: {
    marginHorizontal: 25,
    marginTop: 30,
    marginBottom: 15,
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});

export default React.memo(ExpressItem);
