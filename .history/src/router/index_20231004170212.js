import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClerkLoaded,useUser ,SignIn} from "@clerk/clerk-react";
import BottomTab from "./bottomTab";
import {View} from 'react-native';
import { tokenCache } from "@/utils/tokenCache";
import { navigationRef } from "./navigation";
import { WanderDetail } from "@/views";

import config from "@/config";
let CLERK_PUBLISHABLE_KEY = config["clerk_key_online"]; //线上
if (__DEV__) {
  CLERK_PUBLISHABLE_KEY = config["clerk_key_dev"]; // 本地测试
}

const Stack = createNativeStackNavigator();

const Router = props => {
  const { user, isLoading } = useUser();
    if (isLoading) {
    return <div>Loading...</div>;
  }
  if(!user) return <View style={{alignItems:'center'}}><SignIn redirectUrl="/"/></View>;  
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
      <ClerkLoaded>
        <Stack.Navigator initialRouteName={props.root}>
          <Stack.Screen name="Tab" component={BottomTab} options={{ headerShown: false }} />
          <Stack.Screen name="WanderDetail" component={WanderDetail} options={{ headerShown: false }} />       
        </Stack.Navigator>
      </ClerkLoaded>      
    </NavigationContainer>      
  );
};

export default Router;
