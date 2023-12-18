import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabImage = {
  //Flow: require("../../../assets/tab/flow.png"),
  //Flow_active: require("../../../assets/tab/flow.png"),
  Wander: require("../../../assets/tab/wander_white.png"),
  Wander_active: require("../../../assets/tab/wander_active.png"),
  Message: require("../../../assets/tab/message.png"),
  Message_active: require("../../../assets/tab/message_active.png"),
  Profile: require("../../../assets/tab/profile_white.png"),
  Profile_active: require("../../../assets/tab/profile_active.png"),
};

const TabBar = props => {
  const bottomBarHeight = useSafeAreaInsets().bottom;
  const [animation, setAnimation] = useState("slideInUp");
  const { state, descriptors, navigation } = props;
  const { routes, index: activeRouteIndex } = state;

  // Disabled slide down animation
  // DeviceEventEmitter.addListener("list_scroll", message => {
  //   setTimeout(() => {
  //     if (animation != message) {
  //       //收到监听后想做的事情
  //       setAnimation(message);
  //     }
  //   });
  // });

  return (
    <Animatable.View animation={animation}>
      <View
        style={{
          paddingBottom: bottomBarHeight,
          backgroundColor: "#2B2B2B",
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <View style={[styles.tabBar]} nativeID="tabBar">
          {routes.map(({ name, key }, index) => {
            const focused = index === activeRouteIndex;
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate(name)}
                key={key}
                style={[styles.tabBtn, focused && styles.tabBtnActive]}
              >
                <Image
                  style={styles.tabBarImg}
                  source={focused ? tabImage[`${name}_active`] : tabImage[name]}
                />
                <Text style={[styles.tabTxt, focused && styles.tabTxtActive]}>{name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Animatable.View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    gap: 8,
    height: 56,
    paddingHorizontal: 8,
    paddingTop: 8,
    //paddingBottom: navbarHeight + 8,
    //borderRadius: 999,
    backgroundColor: "#2B2B2B",
    //shadowColor: "#F2F3FF", //设置阴影色
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // }, //设置阴影偏移,该值会设置整个阴影的偏移，width可以看做x,height可以看做y,x向右为正，y向下为正
    shadowOpacity: 0.08,
    borderWidth: 1,
    borderColor: "#2B2B2B", // 为了兼容web
  },
  tabBtn: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: "#2B2B2B",
  },
  tabBarImg: {
    width: 21,
    height: 21,
  },
  tabTxt: {
    color: "#fff",
    textAlign: "center",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 16,
  },
  tabTxtActive: {
    color: "#7461FF",
  },
});
