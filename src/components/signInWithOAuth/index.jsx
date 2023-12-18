import React from "react";
import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
//import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const SignInWithOAuth = ({ strategy, route, navigation }) => {
  useWarmUpBrowser();
  const redirectUrl = AuthSession.makeRedirectUri({
    path: "/oauth-native-callback",
  });
  const { startOAuthFlow } = useOAuth({ strategy: strategy });
  const openRequireUsername = (signUp, setActive) => {
    navigation.navigate("requireUsername", {
      signUp,
      setActive,
    });
  };
  const onPress = React.useCallback(async () => {
    console.log("onOAuth");
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
        //await signUp.update({ username: "piaomz1999111" });
        //setActive({ session: signUp.createdSessionId });
        //console.log(signUp, signIn);
        if (signUp.status) {
          openRequireUsername(signUp, setActive);
        }

        //console.log(signUp, signIn);
        //throw new Error("There are unmet requirements, modifiy this else to handle them");
      }
    } catch (err) {
      console.error("OAuth error", err.toString());
    }
  }, []);
  return (
    <TouchableOpacity
      style={{
        borderRadius: 999,
        backgroundColor: "white",
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
      }}
      onPress={onPress}
    >
      <Image
        style={{
          width: 25,
          height: 25,
          resizeMode: "cover",
          alignSelf: "center",
        }}
        source={
          strategy == "oauth_apple"
            ? require("../../../assets/apple.png")
            : require("../../../assets/google.png")
        }
      />
    </TouchableOpacity>
  );
};

export default SignInWithOAuth;
