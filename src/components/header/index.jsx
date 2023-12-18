import React from "react";
import { View, Text, TouchableWithoutFeedback, Image, StyleSheet } from "react-native";
import deepmerge from "deepmerge";
import { goBack } from "../../router/navigation";

const Back = ({ onPress = () => {}, text = "", styles = {} }) => (
  <View style={styles.left}>
    <TouchableWithoutFeedback
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../../../assets/header/back.png")}
          style={{ width: 32, height: 32, marginRight: 4 }}
        />
        {text ? <Text style={styles.headerSubText}>{text}</Text> : null}
      </View>
    </TouchableWithoutFeedback>
  </View>
);

/**
 * @param title   页面标题，若不传title可直接使用内嵌子组件
 * @param left    左侧按钮，支持text及React, 默认为后退箭头
 * @param onPressLeft 左侧按钮
 * @param right   右侧，支持text及React
 * @param style
 * @param children
 * @param restProps
 * @returns {*}
 * @constructor
 */
const Header = ({
  title,
  left,
  multiline = false,
  onPressLeft,
  right,
  style = {},
  wrpStyle = {},
  titleStyle = {},
  statusBar = true,
  children,
  ...restProps
}) => {
  const onDefaultGoBack = () => {
    goBack();
  };
  const styles = deepmerge(headerStyles, style);
  const titleDom =
    title === undefined ? null : React.isValidElement(title) ? (
      <View style={{ flex: 1 }}>{title}</View>
    ) : multiline ? (
      <Text style={[styles.headerContent]}>{title}</Text>
    ) : (
      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.headerContent, titleStyle]}>
        {title}
      </Text>
    );

  const leftDom =
    left === undefined ? (
      <Back onPress={onPressLeft || onDefaultGoBack} styles={styles} />
    ) : React.isValidElement(left) ? (
      <View style={{ flex: 1, justifyContent: "center" }}>{left}</View>
    ) : (
      <Back onPress={onPressLeft || onDefaultGoBack} text={left} styles={[styles, titleStyle]} />
    );

  const rightDom =
    right === undefined ? null : React.isValidElement(right) ? (
      right
    ) : (
      <Text style={styles.headerSubText}>{right}</Text>
    );
  return (
    <View style={[styles.wrapper, wrpStyle, !statusBar && { paddingTop: 0 }]}>
      {title && (
        <View style={[styles.main]}>
          {leftDom}
          <View style={[styles.headerTitle, titleStyle]}>{titleDom}</View>
          <View style={styles.right}>{rightDom}</View>
        </View>
      )}
      {children}
    </View>
  );
};

export default Header;

const headerStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF",
  },
  main: {
    height: 44,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubText: {
    fontSize: 16,
    color: "#333",
  },
  headerContent: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 22,
    textAlign: "center",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
});
