import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { useSignUp } from "@clerk/clerk-expo";
import Back_button from "../../../assets/svg/Back_button";

export default function VerifyCode({ route, navigation }) {
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  const onBack = () => {
    navigation.navigate("SignUp");
  };
  const onConfirmPress = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      Alert.alert(err.errors[0].message);
    }
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
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Magra-Bold",
            color: "white",
          }}
        >
          We have sent a verification code to:
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Magra-Bold",
            color: "white",
            alignSelf: "center",
            marginTop: 7,
            marginBottom: 10,
          }}
        >
          {signUp.emailAddress}
        </Text>
        <TextInput
          autoCapitalize="none"
          value={code}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Enter your code"
          placeholderTextColor="#8391A1"
          secureTextEntry={false}
          onChangeText={code => setCode(code)}
        />
        <TouchableOpacity
          style={{
            borderRadius: 999,
            backgroundColor: "#7461FF",
            alignItems: "center",
            paddingVertical: 10,
            marginTop: 50,
          }}
          onPress={onConfirmPress}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontFamily: "Lato-Bold",
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 2 }}></View>
      </View>
    </View>
  );
}
