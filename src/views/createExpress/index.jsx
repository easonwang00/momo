import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  KeyboardEvent,
  Image,
  Switch,
} from "react-native";
import useKeyboardHeight from "react-native-use-keyboard-height";
import Audio_svg from "../../../assets/svg/Audio_svg";
import Add_audio_svg from "../../../assets/svg/Add_audio_svg";
import Add_photo_svg from "../../../assets/svg/Add_photo_svg";
import Link_svg from "../../../assets/svg/Link_svg";
import Back_button from "../../../assets/svg/Back_button";
import Constants from "expo-constants";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from "react-native-audio-recorder-player";
import RNFetchBlob from "rn-fetch-blob";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const audioRecorderPlayer = new AudioRecorderPlayer();

const path = Platform.select({
  ios: "hello.m4a",
  android: "sdcard/hello.mp4", // should give extra dir name in android. Won't grant permission to the first level of dir.
});
const audioSet = {
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.low,
  AVNumberOfChannelsKeyIOS: 1,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};
export default function CreateExpress({ route, navigation }) {
  const { item, deleteListItemByPK } = route.params; // the express item
  //const [keyboardHeight, setKeyboardHeight] = useState(0); // not in use in web platform
  //const keyboardHeight = useKeyboardHeight();
  const [textValue, setTextValue] = useState(""); // text input value
  const [isShowRecording, setIsShowRecording] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState("00:00");
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayingRecord, setIsPlayingRecord] = useState(false);
  const toggleAnonymousSwitch = () => setIsAnonymous(!isAnonymous);
  const textInputRef = useRef();
  const onWander = () => {
    if (textValue.length !== 0) {
      console.log("===onWander, textValue:", textValue);
      onBack();
      navigation.navigate("ExpressDetail", {
        item,
        textValue,
        deleteListItemByPK,
        ifCreateExpression: true,
      });
    }
  };
  const onShowRecording = () => {
    if (isShowRecording) {
      onStopRecord();
    } else {
      setRecordTime("00:00");
      onStartRecord();
    }
    setIsShowRecording(!isShowRecording);
  };
  const onFinishRecording = () => {
    onStopRecord();
    setIsShowRecording(false);
  };
  const onStartRecord = async () => {
    let uri;
    try {
      uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    } catch (e) {
      console.log("ERR audioRecorderPlayer.startRecorder: ", e);
    }
    audioRecorderPlayer.addRecordBackListener(e => {
      const recordtimeDisplay = audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000));
      setRecordTime(recordtimeDisplay);
      setRecordSecs(Math.floor(e.currentPosition / 1000));
    });
    console.log("uri: ", uri);
  };
  onStopRecord = async () => {
    let result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    //setRecordTime("00:00");
    setHasRecorded(true);
    console.log("stopRecord:", result);
    if (Platform.OS === "ios") {
      result = result.replace("file:", "");
    }
    RNFetchBlob.fs.readFile(result, "base64").then(data => {
      // handle the data ..
      //console.log(data);
    });
  };
  togglePlayRecord = () => {
    if (isPlayingRecord) {
      onStopPlay();
      setIsPlayingRecord(false);
    } else {
      onStartPlay();
      setIsPlayingRecord(true);
    }
  };
  onStartPlay = async () => {
    console.log("onStartPlay");
    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.currentPosition == e.duration) {
        setIsPlayingRecord(false);
      }
    });
    console.log(msg);
  };
  onStopPlay = async () => {
    console.log("onStopPlay");
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  const onBack = () => {
    navigation.navigate("Wander");
  };

  const renderRecordingView = () => {
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          height: isShowRecording ? 150 : 0,
          backgroundColor: "#595959",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
        onPress={onFinishRecording}
      >
        <View
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            borderRadius: 999,
            backgroundColor: "#303030",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../../../assets/recording_btn.png")}
            style={{
              width: 24,
              height: 24,
              marginRight: 10,
            }}
            resizeMode="cover"
          ></Image>
          <Text
            style={{
              fontSize: 17,
              color: "white",
              fontWeight: 700,
            }}
          >
            Tap to stop recording
          </Text>
        </View>
        <Text
          style={{
            position: "absolute",
            fontSize: 17,
            color: "white",
            justifyContent: "flex-start",
            alignSelf: "flex-start",
            marginTop: 10,
            marginLeft: 5,
            height: "100%",
          }}
        >
          {recordTime}
        </Text>
      </TouchableOpacity>
    );
  };
  // keyboardTrackingView now is not tracking, just for reusing from dialog, contain the three button at the bottom
  const renderKeyboardTrackingView = () => {
    return (
      <View
        style={{
          width: "100%",
          height: 50,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity style={{ marginLeft: 20, alignSelf: "center" }}>
            <Add_photo_svg style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 10, alignSelf: "center" }}
            onPress={onShowRecording}
          >
            <Add_audio_svg style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ marginLeft: 10, alignSelf: "center" }}>
            <Link_svg style={{ width: 30, height: 30 }} />
          </TouchableOpacity> */}
          <View
            justifyContent="center"
            alignItems="center"
            style={{ marginLeft: 10, flexDirection: "row" }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#888888",
              }}
            >
              Anonymous
            </Text>
            <Switch
              trackColor={{ false: "#FFFFFF", true: "#959595" }}
              thumbColor={isAnonymous ? "#FFFFFF" : "#959595"}
              ios_backgroundColor="#FFFFFF"
              onValueChange={toggleAnonymousSwitch}
              value={isAnonymous}
              style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }], marginHorizontal: -10 }}
            />
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={{
              height: 30,
              width: 65,
              backgroundColor: textValue.length == 0 ? "gainsboro" : "black",
              alignSelf: "center",
              marginRight: 20,
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onWander}
            enabled={textValue.length != 0}
          >
            <Text style={{ color: "white", fontSize: 14, fontFamily: "Lato-Bold" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        height: windowHeight,
        width: windowWidth,
        backgroundColor: "#F8F8F8",
        alignSelf: "center",
        //borderTopRightRadius: 15,
        //borderTopLeftRadius: 15,
        flexDirection: "column",
      }}
    >
      <View
        style={{
          marginBottom: 10,
          marginHorizontal: 12,
          //backgroundColor: "pink",
          flexDirection: "row",
          marginTop: Constants.statusBarHeight == 0 ? 20 : Constants.statusBarHeight + 20, // for web there will be a extra space on the top
        }}
      >
        {/* back button */}
        {/* <TouchableOpacity onPress={onBack}>
          <Back_button
            style={{
              width: 24,
              height: 24,
              marginTop: 2,
            }}
          />
        </TouchableOpacity> */}
        {/* question topic */}
        <Text
          style={{
            flex: 1,
            fontSize: 21,
            marginLeft: 10,
            fontWeight: 700,
            fontFamily: "Merriweather-Bold",
          }}
        >
          {item.express_question}
        </Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal={false}
        style={{
          flexDirection: "row",
        }}
      >
        {/* the indicator, when no text is in input, it will appear */}
        <View style={{ width: windowWidth }}>
          <Text
            style={{
              fontSize: 14,
              marginTop: 5,
              marginHorizontal: 20,
              marginBottom: 10,
              fontWeight: 900,
              color: "#646464",
              fontFamily: "Lato-Bold",
              lineHeight: 25,
            }}
          >
            {"Express, whatever comes to your mind, "}
            <Text
              style={{
                fontSize: 14,
                fontWeight: 100,
                color: "#646464",
              }}
            >
              and connect with like-minded wanderers!
            </Text>
          </Text>
        </View>
        {hasRecorded & !isShowRecording ? (
          <View
            name="recordingDisplay"
            style={{
              marginHorizontal: 20,
              height: 150,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#B7B7B7",
                width: 75,
                height: 30,
                borderRadius: 7,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={togglePlayRecord}
            >
              <Text style={{ flex: 1, textAlign: "center", color: "#575757", fontSize: 14 }}>
                {recordSecs}s
              </Text>
              <Audio_svg
                style={{
                  width: 21,
                  height: 21,
                  marginRight: 8,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : isShowRecording ? (
          <View
            style={{
              width: windowWidth - 40,
              height: 150,
              backgroundColor: "white",
              marginVertical: 5,
              marginHorizontal: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#888888", alignSelf: "center" }}>
              Recording...
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: windowWidth - 40,
              height: 150,
              backgroundColor: "white",
              marginVertical: 5,
              marginHorizontal: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              // autoFocus={true}
              multiline
              maxLength={1000}
              rows={10}
              onChangeText={text => setTextValue(text)}
              value={textValue}
              style={{
                width: "100%",
                flex: 1,
                fontSize: 16,
                color: "black",
                alignSelf: "flex-start",
                fontWeight: 500,
              }}
              ref={textInputRef}
              placeholder="Type here to answer..."
              placeholderTextColor={"#888888"}
              //backgroundColor="pink"
            />

            <Text
              style={{
                alignSelf: "flex-end",
                fontSize: 15,
                color: "#888888",
              }}
            >
              {textValue.length}/1000
              {/* isKeyboardShow{isKeyboardShow.toString()} Platform.OS === "web"{" "}
          {(Platform.OS === "web").toString()} */}
            </Text>
          </View>
        )}

        {renderKeyboardTrackingView()}
      </ScrollView>
      {renderRecordingView()}
    </View>
  );
}
