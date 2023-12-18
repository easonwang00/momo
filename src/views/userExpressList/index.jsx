import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { getUserExpressQuestionList } from "@/api";
import Back_button from "../../../assets/svg/Back_button";
import Constants from "expo-constants";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "../../config";
export default function UserExpressList({ route, navigation, isProfile }) {
  //for static test
  //let userID = "user#user_2YaweNj36RjSiEBpNpgbJ9BszQc";
  //const userIcon =
  //"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWUZJWVNLSnJzU1VhR1JuMXNNNEtVNG5CQmEifQ";
  //const userName = "piaomz";
  let { userID, userIcon, userName } = route.params;
  const { signOut } = useAuth();
  const { user } = useUser();
  const currentUserId = __DEV__ ? config.test_userid : "user#" + user.id;
  const bottomBarHeight = useSafeAreaInsets().bottom + 56;
  //for dev
  if (__DEV__ && isProfile) {
    userID = config.test_userid;
  }
  //console.log("===UserExpressList:", userID, userIcon, userName);
  const [isLoading, setIsLoading] = useState(false);
  const [expressList, setExpressList] = useState([]);
  const [isLoadingOwn, setIsLoadingOwn] = useState(false);
  const [currentUserExperssList, setCurrentUserExpressList] = useState([]);
  const onPressExpression = express_item => {
    if (currentUserExperssList.includes(express_item.PK)) {
      navigation.push("ExpressDetail", {
        ifCreateExpression: false,
        item: express_item,
        user_id: userID,
      });
    } else {
      navigation.push("CreateExpress", {
        item: express_item,
        deleteListItemByPK: () => {}, // do nothing, fix by every time refresh question list when going to express index
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    setIsLoadingOwn(true);
    getUserExpressQuestionList({
      user: userID,
    }).then(
      res => {
        setExpressList(res);
        setIsLoading(false);
        console.log("====getUserExpressQuestionList");
      },
      error => {
        console.log("====getUserExpressQuestionList Error", error);
        setIsLoading(false);
      }
    );
    //get own list
    getUserExpressQuestionList({ user: currentUserId }).then(
      res => {
        setCurrentUserExpressList(res.map(item => item.PK));
        //console.log(res.map(item => item.PK));
        setIsLoadingOwn(false);
        console.log("====getUserExpressQuestionListOwn");
      },
      error => {
        console.log("====getUserExpressQuestionListOwn Error", error);
        setIsLoadingOwn(false);
      }
    );
  }, []);
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        marginBottom: isProfile ? bottomBarHeight : 0,
        backgroundColor: "#2B2B2B",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          marginBottom: 20,
          marginHorizontal: 12,
          //backgroundColor: "pink",
          flexDirection: "row",
          marginTop: Constants.statusBarHeight == 0 ? 20 : Constants.statusBarHeight + 20, // for web there will be a extra space on the top
        }}
      >
        {/* back button */}
        {isProfile ? (
          <View
            style={{
              width: 24,
              height: 5,
              marginTop: 2,
            }}
          />
        ) : (
          <TouchableOpacity onPress={onBack}>
            <Back_button
              style={{
                width: 24,
                height: 24,
                marginTop: 2,
                color: "white",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View name="avatarAndName" style={{ flexDirection: "row", marginHorizontal: 20 }}>
        <View
          name="icon"
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => {
              if (isProfile) {
                signOut();
              }
            }}
          >
            <Image style={{ width: "100%", height: "100%" }} source={{ uri: userIcon }} />
          </TouchableOpacity>
        </View>
        <View
          name="userName"
          style={{
            flex: 1,
            marginLeft: 16,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            {userName}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 15,
            }}
          >
            User ID @{userName}
          </Text>
        </View>
      </View>
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 10,
          marginHorizontal: 15,
          marginTop: 40,
          fontFamily: "Merriweather-Bold",
        }}
      >
        {isProfile ? "My Wanders...." : "His/Her Wanders...."}
      </Text>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}
      >
        {isLoading || isLoadingOwn ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          expressList.map((item, i) => (
            <RenderExpress key={i} item={item} onPressExpression={onPressExpression} />
          ))
        )}
        <View
          name="paddingEnd"
          style={{
            width: "100%",
            height: 12,
          }}
        ></View>
      </ScrollView>
    </View>
  );
}

function RenderExpress({ item, onPressExpression }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        marginVertical: 6,
        paddingHorizontal: 15,
        paddingVertical: 18,
      }}
      onPress={() => {
        onPressExpression(item);
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "Merriweather-Regular",
        }}
      >
        {item.express_question}
      </Text>
    </TouchableOpacity>
  );
}
