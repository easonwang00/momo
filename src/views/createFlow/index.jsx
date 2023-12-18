import React, { Component } from "react";
import {
  ImageBackground,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { navigationRef } from "@/router/navigation";
import { default as AddLink } from "./AddLink";
import { default as AddWriting } from "./AddWriting";
import { default as Summary } from "./Summary";
import { default as AddOptional } from "./AddOptional";
import BackBtn from "../../components/createFlow";
import purplebg from "../../../assets/purplebg.png";
import arrowRight from "../../../assets/arrow-right.png";
import { Header } from "@/components";

// CreateFlow landing page: 用户输入一个topic，点击Next后，跳转到AddOptional页面
class CreateFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      showEmptyTopicWarning: false, // 是否显示 空topic的警告
    };
  }

  handleNext = () => {
    const { topic } = this.state;
    // 验证用户输入是否为空
    if (topic === "") {
      this.setState({ showEmptyTopicWarning: true });
    } else {
      this.setState({ showEmptyTopicWarning: false });
      navigationRef.current?.navigate("AddOptional", { topic });
    }
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
          <Text style={styles.heading}>Topic</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={this.state.topic}
              onChangeText={text => this.setState({ topic: text })}
              placeholder="type..."
              style={styles.input}
            />
            <TouchableOpacity style={styles.goButton} onPress={this.handleNext}>
              <Image source={arrowRight} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
          {this.state.showEmptyTopicWarning && (
            <Text style={{ color: "red" }}>Please enter a topic</Text>
          )}
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
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 16,
  },
  heading: {
    fontSize: 24,
    justifyContent: "center",
    color: "white",
    width: "100%",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
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
  goButton: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(128, 128, 128, 0.1)", // 10%透明度的灰色
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateFlow;
export { CreateFlow, AddLink, AddWriting, Summary, AddOptional };
