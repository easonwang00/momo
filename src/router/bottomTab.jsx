import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, Platform } from "react-native";
import { TabBar } from "../components";
import { Wander, Flow, Profile, ChatPage } from "@/views";

const Tab = createBottomTabNavigator();
const tabImage = {
  //Flow: require("../../assets/tab/flow.png"),
  //Flow_active: require("../../assets/tab/flow.png"),
  Wander: require("../../assets/tab/wander.png"),
  Wander_active: require("../../assets/tab/wander.png"),
  Message: require("../../assets/tab/message.png"),
  Message_active: require("../../assets/tab/message_active.png"),
  Profile: require("../../assets/tab/profile.png"),
  Profile_active: require("../../assets/tab/profile.png"),
};

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Wander"
      tabBar={props => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Wander"
        component={Wander}
        options={{
          headerShown: false,
          tabBarLabel: "Wander",
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerShown: false,
          tabBarLabel: "Message",
          lazy: false,
        }}
      />
      {/* Deprecated Page Flow*/}
      {/* <Tab.Screen
        name="Flow"
        component={Flow}
        options={{
          tabBarLabel: "Flow",
          freezeOnBlur: true,
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

// const styles = StyleSheet.create({
//   tabbarStyle: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     // paddingBottom: 0,
//     height: 56,
//     borderRadius: 999,
//     backgroundColor: "#FFF",
//     shadowColor: "#F2F3FF", //设置阴影色
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     }, //设置阴影偏移,该值会设置整个阴影的偏移，width可以看做x,height可以看做y,x向右为正，y向下为正
//     shadowOpacity: 0.5,

//     borderWidth: 1,
//     borderColor: "#F2F3FF", // 为了兼容web
//     // borderColor: Platform.OS == "web" ? "#E1E1E1" : "#FFF",
//     backgroundColor: "red",
//   },
//   tabBarItemStyle: {
//     height: 40,
//     paddingVertical: 4,
//     // marginVertical: 8,
//     borderRadius: 999,
//     // paddingTop: 4,
//     // paddingBottom: 4,
//   },
// });
