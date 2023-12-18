import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/tokenCache";
import Router from "@/router";


import config from "@/config";
let CLERK_PUBLISHABLE_KEY = config["clerk_key_online"]; //线上
if (__DEV__) {
  CLERK_PUBLISHABLE_KEY = config["clerk_key_dev"]; // 本地测试
}

let redirectUrl = config["onlineDomain"];
if (__DEV__) {
  redirectUrl = "/";
}

const App = props => {
  return (
    <ClerkProvider
      afterSignInUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}>
      <SafeAreaProvider>
        <StatusBar />
        <Router />
      </SafeAreaProvider>
    </ClerkProvider >
  );
};

export default App;
