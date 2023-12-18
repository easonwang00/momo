import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, Alert } from "react-native";
import React from "react";
import { SignInWithOAuth } from "../../components";
import { useSignIn } from "@clerk/clerk-expo";
import Constants from "expo-constants";
export default function Login({ route, navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const onSignUp = () => {
    navigation.navigate("SignUp");
  };
  const onSignInPress = async () => {
    if (emailAddress == "") {
      Alert.alert("Enter email or username.");
      return;
    }
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      Alert.alert(err.errors[0].message);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");

  return (
    <View
      style={{
        backgroundColor: "#2B2B2B",
        width: "100%",
        height: "100%",
        paddingTop: Constants.statusBarHeight == 0 ? 5 : Constants.statusBarHeight - 10,
        paddingHorizontal: 40,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          marginLeft: -10,
          marginVertical: 30,
        }}
      >
        <Image
          style={{
            width: 60,
            height: 60,
            resizeMode: "cover",
            alignSelf: "center",
          }}
          source={require("../../../assets/wander_big.png")}
        />
        <Text
          style={{
            fontFamily: "Lato-Bold",
            fontSize: 30,
            color: "white",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          Wander
        </Text>
      </View>
      <View
        style={{
          paddingTop: 42,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontFamily: "Magra-Bold",
            color: "white",
          }}
        >
          Log in
        </Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 30,
          }}
          placeholder="Enter your email or username"
          placeholderTextColor="#8391A1"
          secureTextEntry={false}
          onChangeText={emailAddress => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          style={{
            backgroundColor: "white",
            fontSize: 15,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 25,
          }}
          placeholder="Enter your password"
          placeholderTextColor="#8391A1"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
        <TouchableOpacity
          style={{
            borderRadius: 999,
            backgroundColor: "#7461FF",
            alignItems: "center",
            paddingVertical: 10,
            marginTop: 50,
          }}
          onPress={onSignInPress}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontFamily: "Lato-Bold",
            }}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>
      <View
        name="oauth"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 80,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={{ borderColor: "white", borderWidth: 1, height: 0, flex: 1 }}></View>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontFamily: "Lato-Bold",
            }}
          >
            {"  Or Log in with  "}
          </Text>
          <View style={{ borderColor: "white", borderWidth: 1, height: 0, flex: 1 }}></View>
        </View>
        <View
          name="oauthBtn"
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 30,
          }}
        >
          <SignInWithOAuth strategy="oauth_google" route={route} navigation={navigation} />
          <SignInWithOAuth strategy="oauth_apple" route={route} navigation={navigation} />
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
          }}
          onPress={onSignUp}
        >
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "#BBBBBB",
            }}
          >
            {"Don't have an account?"}
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 14,
                color: "white",
              }}
            >
              {"   Sign Up"}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
