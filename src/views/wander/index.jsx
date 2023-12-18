import * as React from "react";
import { Animated, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Explore from "../explore";
import Express from "../express";
import Encounter from "../encounter";
//import "@fontsource/merriweather";
//import { useFonts, Merriweather_400Regular } from "@expo-google-fonts/merriweather";
import Constants from "expo-constants";

const width = Dimensions.get("window").width;

//this Screen is for the tab on the top tab navigation
export default class Wander extends React.Component {
  state = {
    index: 0,
    routes: [
      // { key: "page1", title: "Explore" },
      { key: "page1", title: "Express" },
      // { key: "page3", title: "Encounter" },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = props => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          // Set a static opacity for the single tab scenario
          const opacity =
            props.navigationState.routes.length === 1
              ? 1
              : props.position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.5],
                });

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}
              key={i}
            >
              <Animated.Text style={{ ...styles.tabText, opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    // page1: () => <Explore {...this.props} />,
    page1: () => <Express {...this.props} />,
    // page3: () => <Encounter {...this.props} />,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: "absolute",
    flexDirection: "row",
    marginTop: Constants.statusBarHeight == 0 ? 5 : Constants.statusBarHeight - 10, // for web there will be a extra space on the top
    //marginHorizontal: width * 0.1,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 2,
    //backgroundColor: "pink",
    alignSelf: "center",
  },
  tabText: {
    fontFamily: "Lato-Bold",
    //fontFamily: "Merriweather_400Regular",
    width: 75,
    fontWeight: 700,
    color: "white",
    fontSize: 16,
    //backgroundColor: "green",
    textAlign: "center",
  },
  tabItem: {
    //flex: 1,
    alignItems: "center",
    padding: 16,
    zIndex: 1,
  },
});
