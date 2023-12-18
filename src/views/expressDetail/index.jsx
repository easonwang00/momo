import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect } from "react";
import Back_button from "../../../assets/svg/Back_button";
import { useUser } from "@clerk/clerk-react";
import { createExpression, getExpressionList } from "@/api";
import { UserMessage } from "@/components";
import Constants from "expo-constants";
import config from "../../config";
//import { testCreateExpressionData, expressItem, expression } from "./testData";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ExpressDetail({ route, navigation }) {
  const {
    item: expressItem,
    textValue: expression,
    deleteListItemByPK,
    ifCreateExpression,
  } = route.params;
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const theme = useColorScheme();
  const { user } = useUser();
  const userId = __DEV__ ? config.test_userid : "user#" + user.id;
  const onBack = () => {
    if (ifCreateExpression) {
      navigation.navigate("Wander");
    } else {
      navigation.goBack();
    }
  };
  const fetchData = () => {
    setIsLoading(true);

    // test with static data
    // const simulateRequest = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(testCreateExpressionData);
    //   }, 2000);
    // });
    // simulateRequest.then(res => {
    //   setItems(res.data.list);
    //   console.log("====onloaded expressdetail", res);
    //   setIsLoading(false);
    // });
    if (ifCreateExpression) {
      const params = {
        expression_answer: expression,
        creator: userId, // user_pk
        expression_image: "", // leave here empty string
        express_pk: expressItem.PK,
      };
      console.log("=====onload expressdetail createExpress", params);
      createExpression(params).then(
        res => {
          console.log("====createExpression Res", res);
          setCurrentUser({
            current_avatar: res.current_avatar,
            current_expression: res.current_expression,
            current_user_name: res.current_user_name,
            current_upvotes: res.current_upvotes,
            current_upvote_bool: res.current_upvote_bool,
            current_expression_pk: res.current_expression_pk,
          });
          setItems(res.list);
          deleteListItemByPK(expressItem.PK);
          setIsLoading(false);
        },
        error => {
          console.log("====createExpression Error", error);
          setIsLoading(false);
        }
      );
    } else {
      const params = {
        express_pk: expressItem.PK,
        creator: userId,
      };
      console.log("=====onload expressdetail getExpressionList", params);
      getExpressionList(params).then(
        res => {
          console.log("====getExpressionList", res);
          setCurrentUser({
            current_avatar: res.current_avatar,
            current_expression: res.current_expression,
            current_user_name: res.current_user_name,
            current_upvotes: res.current_upvotes,
            current_upvote_bool: res.current_upvote_bool,
            current_expression_pk: res.current_expression_pk,
          });
          setItems(res.list);
          setIsLoading(false);
        },
        error => {
          console.log("====getExpressionList Error", error);
          setIsLoading(false);
        }
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const renderResonatingIndicator = () => {
    return (
      <View
        name="resonatingIndicator"
        style={{
          backgroundColor: "#404040",
          paddingVertical: 8,
          marginHorizontal: 12,
          marginBottom: 12,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 25,
            backgroundColor: "white",
            marginHorizontal: 12,
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={require("../../../assets/wander.png")}
          />
        </View>
        <Text style={{ color: "white", fontSize: 14, fontWeight: 600, fontFamily: "Lato-Bold" }}>
          Resonating comments are in{" "}
          <Text style={{ color: "#5BBAFF", fontFamily: "Lato-Bold" }}>blue</Text>
        </Text>
      </View>
    );
  };
  const renderMessages = () => {
    return (
      <ScrollView>
        {renderResonatingIndicator()}
        {isLoading ? (
          <></>
        ) : (
          <UserMessage
            ifLeftAvatar={false}
            ifBlue={true}
            name={currentUser.current_user_name}
            messageUserId={userId} // if need other one display the first, need its userid
            icon={currentUser.current_avatar}
            text={currentUser.current_expression}
            navigation={navigation}
            isUpVoted={currentUser.current_upvote_bool}
            upVoteNum={currentUser.current_upvotes}
            expressionId={currentUser.current_expression_pk}
          />
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
        ) : (
          items.map((item, i) => (
            <UserMessage
              key={i}
              name={item.user_name}
              //userID = {}
              icon={item.avatar}
              text={item.comment}
              ifLeftAvatar={true}
              ifBlue={item.score > 0.5}
              navigation={navigation}
              isUpVoted={item.upvote_bool}
              upVoteNum={item.upvotes}
              expressionId={item.expression_pk}
              messageUserId={item.user_pk}
            />
          ))
        )}
      </ScrollView>
    );
  };
  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight,
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
        {/* question topic */}
        <Text
          style={{
            flex: 1,
            fontSize: 21,
            marginLeft: 10,
            fontWeight: 700,
            color: "white",
            fontFamily: "Merriweather-Bold",
          }}
        >
          {expressItem.express_question}
        </Text>
      </View>
      {renderMessages()}
    </View>
  );
}
