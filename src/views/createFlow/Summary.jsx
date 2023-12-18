import React, { Component } from "react";
import { Button, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { navigationRef } from "../../router/navigation";
import BackBtn from "../../components/createFlow";
import purplebg from "../../../assets/purplebg.png";
import EnterFlow from "../../components/createFlow/EnterFlow.jsx";
import StartWander from "../../components/createFlow/StartWander.jsx";
import { Header } from "../../components";

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: props.route.params.topic,
      link: props.route.params?.link,
      writing: props.route.params?.writing,
    };
  }

  handleEnterFlowOnPress = () => {
    //  TO DO: .....
    console.log("enter flow");
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

          <View style={styles.linksContainer}>
            {this.state.link && <Text style={styles.bottomNote}>🔗link {this.state.link}</Text>}
            {this.state.writing && (
              <Text style={styles.bottomNote}>✍️writing {this.state.writing}</Text>
            )}
          </View>
          <View>
            <StartWander
              topic={this.state.topic}
              link={this.state.link}
              writing={this.state.writing}
            />
            <EnterFlow
              topic={this.state.topic}
              link={this.state.link}
              writing={this.state.writing}
            />
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
  heading: {
    fontSize: 48,
    justifyContent: "center",
    color: "white",
    width: "100%",
    textAlign: "center",
    marginVertical: 48,
  },
  container: {
    color: "white",
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  linksContainer: {
    color: "white",
    width: "100%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginVertical: 48,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  bottomNote: {
    color: "white",
    alignSelf: "center",
    textAlign: "center",
  },
});
