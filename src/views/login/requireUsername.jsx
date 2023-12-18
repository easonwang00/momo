import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import Back_button from "../../../assets/svg/Back_button";

export default function RequireUsername({ route, navigation }) {
  const { signUp, setActive } = route.params;
  const [username, setUsername] = useState("");
  const onBack = () => {
    navigation.navigate("Login");
  };
  const onSignUpPress = async () => {
    //console.log(signUp, setActive, username);
    signUp.update({ username: username }).then(
      res => {
        console.log(res);
        setActive({ session: signUp.createdSessionId });
      },
      err => {
        Alert.alert(err.errors[0].message);
        console.log(err.errors[0].message);
      }
    );
    //console.log(signUp, setActive, username);
  };
  return (
    <View
      style={{
        backgroundColor: "#2B2B2B",
        width: "100%",
        height: "100%",
        paddingTop: Constants.statusBarHeight == 0 ? 5 : Constants.statusBarHeight - 10,
        paddingHorizontal: 40,
      }}
    >
      <TouchableOpacity onPress={onBack}>
        <Back_button
          style={{
            width: 35,
            height: 35,
            marginLeft: -10,
            marginTop: 30,
            color: "white",
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
        <View style={{ flex: 1 }}></View>
        <TextInput
          autoCapitalize="none"
          value={username}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Enter your username"
          placeholderTextColor="#8391A1"
          secureTextEntry={false}
          onChangeText={emailAddress => setUsername(emailAddress)}
        />
        <TouchableOpacity
          style={{
            borderRadius: 999,
            backgroundColor: "#7461FF",
            alignItems: "center",
            paddingVertical: 10,
            marginTop: 50,
          }}
          onPress={onSignUpPress}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontFamily: "Lato-Bold",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 2 }}></View>
      </View>
    </View>
  );
}
