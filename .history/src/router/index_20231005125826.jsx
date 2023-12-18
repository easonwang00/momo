import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useUser } from "@clerk/clerk-expo";
import { SignIn,useUser } from "@clerk/clerk-react";

import BottomTab from "./bottomTab";
import { View ,Text, Platform} from "react-native";
import { tokenCache } from "@/utils/tokenCache";
import { navigationRef } from "./navigation";
import { WanderDetail } from "@/views";

const Stack = createNativeStackNavigator();

const Router = props => {
  const { user ,isLoaded,isSignedIn} = useUser();  
  console.log('=====user',user,isLoaded,isSignedIn)   
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
        <Stack.Navigator initialRouteName={props.root}>
          <Stack.Screen name="Tab" component={BottomTab} options={{ headerShown: false }} />
          <Stack.Screen
            name="WanderDetail"
            component={WanderDetail}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>      
    </NavigationContainer>
  );
};

export default Router;
