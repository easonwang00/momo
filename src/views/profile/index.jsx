import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import UserExpressList from "../userExpressList";

export default function Profile({ route, navigation }) {
  const { user } = useUser();
  route.params = { userID: "user#" + user.id, userIcon: user.imageUrl, userName: user.username };
  //console.log(route, navigation);
  return <UserExpressList route={route} navigation={navigation} isProfile={true} />;
}
