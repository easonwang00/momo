import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef, StackActions } from "@react-navigation/native";
import React from "react";
import Login from "./login";
import RequireUsername from "./requireUsername";
import SignUp from "./signUp";
import VerifyCode from "./verifyCode";
const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();
export default function LoginIndex() {
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ height: "100%", width: "100%" }}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen
            name="requireUsername"
            component={RequireUsername}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
