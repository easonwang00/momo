import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser as useUserExpo, SignIn as SignInExpo } from "@clerk/clerk-expo";
import { SignIn, useUser } from "@clerk/clerk-react";
import config from "@/config";
import BottomTab from "./bottomTab";
import { Platform, View, Text } from "react-native";
import { tokenCache } from "@/utils/tokenCache";
import { navigationRef } from "./navigation";
import {
  WanderDetail,
  ExpressDetail,
  CreateExpress,
  UserExpressList,
  Login,
  ChatWindow,
} from "@/views";

// import {
//   CreateFlow,
//   AddOptional,
//   AddLink,
//   AddWriting,
//   Summary,
// } from "@/views/createFlow/index.jsx";

const Stack = createNativeStackNavigator();

const Router = props => {
  const { user, isLoaded, isSignedIn } = Platform.OS === "web" ? useUser() : useUserExpo();
  console.log("=====user", user, isLoaded, isSignedIn);
  if (!user) {
    if (Platform.OS === "web") {
      return (
        <View style={{ alignItems: "center" }}>
          <SignIn redirectUrl={__DEV__ ? "/" : config["onlineDomain"]} />
        </View>
      );
    } else {
      return <Login />;
    }
  }

  tokenCache?.saveToken("user_id", user?.id);

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          background: "#FFF",
          border: "transparent",
          primary: "#1529C3",
          card: "#FFF",
          text: "#333",
          notification: "",
        },
      }}
      ref={navigationRef}
    >
      <View style={{ height: "100%", width: "100%" }}>
        <Stack.Navigator initialRouteName={props.root}>
          <Stack.Screen name="Tab" component={BottomTab} options={{ headerShown: false }} />
          <Stack.Screen
            name="WanderDetail"
            component={WanderDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExpressDetail"
            component={ExpressDetail}
            options={{ headerShown: false }}
          />

          {/* createExpressScreen */}
          <Stack.Screen
            name="CreateExpress"
            component={CreateExpress}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ChatWindow" component={ChatWindow} options={{ headerShown: false }} />
          <Stack.Screen
            name="UserExpressList"
            component={UserExpressList}
            options={{ headerShown: false }}
          />
          {/* region: create flow */}
          {/* <Stack.Screen name="CreateFlow" component={CreateFlow} options={{ headerShown: false }} />
          <Stack.Screen
            name="AddOptional"
            component={AddOptional}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={"AddLink"} component={AddLink} options={{ headerShown: false }} />
          <Stack.Screen
            name={"AddWriting"}
            component={AddWriting}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Summary" component={Summary} options={{ headerShown: false }} /> */}
          {/* end region */}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};
export default Router;
