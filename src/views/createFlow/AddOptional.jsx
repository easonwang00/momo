import React, { Component } from "react";
import {
  ImageBackground,
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { navigationRef } from "../../router/navigation";
import BackBtn from "../../components/createFlow";
import purplebg from "../../../assets/purplebg.png";
import { Header } from "@/components";
import arrowRight from "../../../assets/arrow-right.png";
import whiteLink from "../../../assets/white-link.png";
import edit from "../../../assets/edit2.png";
import upload from "../../../assets/upload.png";
import StartWander from "../../components/createFlow/StartWander.jsx";
import EnterFlow from "../../components/createFlow/EnterFlow.jsx";

export default class AddOptional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: props.route.params.topic,
    };
  }

  handleLinksNext = () => {
    const { topic } = this.state;
    // 这里可以添加其他逻辑，例如验证输入等
    navigationRef.current?.navigate("AddLink", { topic });
  };

  handleWritingNext = () => {
    const { topic } = this.state;
    // 这里可以添加其他逻辑，例如验证输入等
    navigationRef.current?.navigate("AddWriting", { topic });
  };

  render() {
    return (
      <ImageBackground source={{ uri: purplebg }} style={styles.backgroundImage}>
        <Header
          statusBar
          title="Create"
          titleStyle={{ color: "white" }}
          wrpStyle={{ color: "white", backgroundColor: "transparent" }}
        />
        <View style={styles.container}>
          <Text style={styles.heading}>{this.state.topic}</Text>
          <View>
            <StartWander topic={this.state.topic} />
            <EnterFlow topic={this.state.topic} />
          </View>
          <View style={styles.addOptionalContainer}>
            <TouchableOpacity style={styles.addBtnContainer} onPress={this.handleLinksNext}>
              <Image source={whiteLink} style={styles.icon} />
              <Text style={styles.iconCaption}>Links</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtnContainer} onPress={this.handleWritingNext}>
              <Image source={edit} style={styles.icon} />
              <Text style={styles.iconCaption}>Writing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addBtnContainer, { opacity: 0.4 }]}>
              <Image source={upload} style={styles.icon} />
              <Text style={styles.iconCaption}>Files</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomNoteContainer}>
          <Text style={styles.bottomNote}>without furthermore info</Text>
          <Text style={styles.bottomNote}>the content generated will be very generic</Text>
          <Text style={styles.bottomNote}>so let’s add more</Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  container: {
    color: "white",
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  heading: {
    fontSize: 48,
    justifyContent: "center",
    color: "white",
    width: "100%",
    textAlign: "center",
    marginVertical: 48,
  },
  addOptionalContainer: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "1fr 1fr 1fr",
    margin: 0,
    paddingHorizontal: 16,
    marginVertical: 72,
  },
  addBtnContainer: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  icon: {
    alignSelf: "center",
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  iconCaption: {
    color: "white",
    alignSelf: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  btn: {
    color: "white",
    backgroundColor: "rgba(128, 128, 128, 0.1)", // 10%透明度的灰色
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  bottomNoteContainer: {
    color: "white",
    alignSelf: "center",
    textAlign: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
  },
  bottomNote: {
    color: "white",
    alignSelf: "center",
    textAlign: "center",
  },
});
