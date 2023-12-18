import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { navigationRef } from "../../router/navigation";
import purplebg from "../../../assets/purplebg.png";
import addBtn from "../../../assets/add-btn.png";
import { Header } from "../../components";

export default class AddLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: props.route.params.topic,
      link: "",
    };
  }

  handleNext = () => {
    const { topic, link } = this.state;
    // 这里可以添加其他逻辑，例如验证输入等
    navigationRef.current?.navigate("Summary", { topic, link });
  };

  render() {
    // WORKING...
    return (
      <ImageBackground source={{ uri: purplebg }} style={styles.backgroundImage}>
        <Header
          statusBar
          title="Add Link"
          titleStyle={{ color: "white" }}
          wrpStyle={{ color: "white", backgroundColor: "transparent" }}
        />
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              value={this.state.link}
              onChangeText={text => this.setState({ link: text })}
              placeholder="Paste the link here..."
              style={styles.input}
            />
            <TouchableOpacity style={styles.goButton} onPress={this.handleNext}>
              <Image source={addBtn} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
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
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
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
    color: "white",
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
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
  goButton: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(128, 128, 128, 0.1)", // 10%透明度的灰色
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
