import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import Back_button from "../../../assets/svg/Back_button";
import momo_backend from "@/config";
export default function SignUp({ route, navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { isLoaded, signUp } = useSignUp();
  const onBack = () => {
    navigation.navigate("Login");
  };
  const onSignUpPress = async () => {
    if (username == "" || email == "" || password == "" || passwordConfirm == "") {
      Alert.alert("Please fill all the fields.");
    } else {
      if (password != passwordConfirm) {
        Alert.alert("Password not match!");
      } else {
        if (!isLoaded) {
          return;
        }
        // test the communcation with teh backend
        try {
          await signUp.create({
            username,
            emailAddress: email,
            password,
          });
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          console.log(signUp);
          navigation.navigate("VerifyCode");

          // After successful signup, make a GET request to the Flask endpoint
          const response = await fetch({ momo_backend } + "/test");
          const responseData = await response.text();
          console.log(responseData); // Log the response from the Flask server
        } catch (err) {
          Alert.alert(err.errors[0].message);
        }
      }
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
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Magra-Bold",
              color: "white",
            }}
          >
            Sign up
          </Text>
        </View>
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
          placeholder="Username"
          placeholderTextColor="#8391A1"
          secureTextEntry={false}
          onChangeText={res => setUsername(res)}
        />
        <TextInput
          autoCapitalize="none"
          value={email}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Email"
          placeholderTextColor="#8391A1"
          secureTextEntry={false}
          onChangeText={res => setEmail(res)}
        />
        <TextInput
          autoCapitalize="none"
          value={password}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Password"
          placeholderTextColor="#8391A1"
          secureTextEntry={true}
          onChangeText={res => setPassword(res)}
        />
        <TextInput
          autoCapitalize="none"
          value={passwordConfirm}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Confirm password"
          placeholderTextColor="#8391A1"
          secureTextEntry={true}
          onChangeText={res => setPasswordConfirm(res)}
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
        <TouchableOpacity
          style={{
            paddingVertical: 25,
            alignSelf: "center",
          }}
          onPress={onBack}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "#BBBBBB",
            }}
          >
            {"Already have an account? "}
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 14,
                color: "white",
              }}
            >
              {" Log in"}
            </Text>
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 2 }}></View>
      </View>
    </View>
  );
}
