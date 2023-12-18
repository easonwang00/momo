import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ClerkProvider as ClerkProviderExpo,
  ClerkLoaded as ClerkLoadedExpo,
} from "@clerk/clerk-expo";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-react";
import { tokenCache } from "@/utils/tokenCache";
import Router from "@/router/index.jsx";
import { FlowLoadingProvider } from "./src/flow-loading/FlowLoadingContext";
import config from "@/config";
//import { setCustomTextInput, setCustomText } from "react-native-global-props";
//import { Lato_400Regular } from "@expo-google-fonts/lato";
import { useFonts } from "expo-font";
import setDefaultProps from "react-native-simple-default-props";

let CLERK_PUBLISHABLE_KEY = config["clerk_key_online"]; //线上
if (__DEV__) {
  CLERK_PUBLISHABLE_KEY = config["clerk_key_dev"]; // 本地测试
}
console.log("===Platform", Platform);

let redirectUrl = config["onlineDomain"];
if (__DEV__) {
  redirectUrl = "/";
}

// set default font
const defaultText = {
  style: [{ fontFamily: "Lato-Regular" }],
};
setDefaultProps(Text, defaultText);

const App = props => {
  const [fontsLoaded] = useFonts({
    "Magra-Regular": require("./assets/fonts/Magra-Regular.ttf"),
    "Magra-Bold": require("./assets/fonts/Magra-Bold.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Merriweather-Regular": require("./assets/fonts/Merriweather-Regular.ttf"),
    "Merriweather-Bold": require("./assets/fonts/Merriweather-Bold.ttf"),
  });

  // For not web platform adapter
  const renderContent = () => {
    if (fontsLoaded) {
      return (
        <FlowLoadingProvider>
          <StatusBar style="light" />
          <Router />
          {/* <Router root={"ChatPage"} /> */}
        </FlowLoadingProvider>
      );
    } else {
      return <></>;
    }
  };
  if (Platform.OS !== "web") {
    return (
      <SafeAreaProvider>
        <ClerkProviderExpo publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
          <ClerkLoadedExpo>{renderContent()}</ClerkLoadedExpo>
        </ClerkProviderExpo>
      </SafeAreaProvider>
    );
  }
  // Web platform :
  return (
    <ClerkProvider
      afterSignInUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>{renderContent()}</ClerkLoaded>
    </ClerkProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default App;
