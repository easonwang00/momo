import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import DM_svg from "../../../assets/svg/DM_svg";
import Heart_svg from "../../../assets/svg/Heart_svg";
import { upvote } from "../../api";
import config from "../../config";
import {
  connectUser,
  fetchChatChannels,
  createChannelWithUser,
} from "@/views/chatPage/sendbird_helper.js";
import SendBird from "sendbird";
// the message chat component
export default function UserMessage({
  ifLeftAvatar,
  ifBlue,
  isUpVoted: isUpVotedin,
  upVoteNum: upVoteNumin,
  expressionId,
  name,
  icon,
  text,
  messageUserId,
  navigation,
  isFirstMessage,
}) {
  const [isUpVoted, setIsUpVoted] = useState(isUpVotedin);
  const [upVoteNum, setUpVoteNum] = useState(upVoteNumin);
  const [allowDM, setAllowDM] = useState(isUpVotedin);
  const [isRequest, setIsRequest] = useState(false);
  const [isOnDM, setIsOnDM] = useState(false);
  const { user } = useUser();
  const userId = __DEV__ ? config.test_userid : "user#" + user.id;
  useEffect(() => {
    if (isRequest) {
      //console.log("onChange");
      const params = {
        user: userId,
        expression_id: expressionId,
      };
      upvote(params).then(res => {
        console.log("===upvote", res);
        setUpVoteNum(res.upvotes);
        setIsUpVoted(res.upvoters[userId]);
        setAllowDM(res.upvoters[userId]);
      });
      setIsRequest(false);
    }
  }, [isRequest]);
  useEffect(() => {
    if (isOnDM) {
      onDM();
    }
  }, [isOnDM]);
  const onOpenUserDetail = () => {
    if (messageUserId) {
      navigation.push("UserExpressList", { userID: messageUserId, userIcon: icon, userName: name });
    }
  };
  const onDM = async () => {
    if (!allowDM) {
      console.log("not allow DM");
      setIsOnDM(false);
      return;
    }
    console.log(
      "establish chat channel of (current user, user going to chat):",
      userId,
      messageUserId
    );

    try {
      // Assuming you have a way to get or create an sbInstance
      const sbInstance = await getOrCreateSbInstance(userId);
      const newChannel = await createChannelWithUser(sbInstance, userId, messageUserId);
      navigation.navigate("ChatWindow", { channel: newChannel });
    } catch (error) {
      console.error("Error in createChannelWithUser:", error);
    }
    setIsOnDM(false);
  };

  // This function gets or creates a SendBird instance
  const getOrCreateSbInstance = async userId => {
    const APP_ID = config.sendbird_app_id; // Replace with your actual APP_ID
    const currentUserUuid = userId; // Replace with the current user's ID
    const currentUserNickname = userId; // Replace with the current user's nickname

    // Here you either get your existing SendBird instance or create a new one
    let sbInstance = SendBird.getInstance();
    if (!sbInstance) {
      sbInstance = await connectUser(APP_ID, currentUserUuid, currentUserNickname);
    }
    return sbInstance;
  };
  // ifLeftAvatar can determine if its the user itself message or others message
  return (
    <View
      style={{
        width: "100%",
        marginBottom: 15,
        flexDirection: ifLeftAvatar ? "row" : "row-reverse",
      }}
    >
      {/* user icon row */}
      <TouchableOpacity style={{ height: 36 }} onPress={onOpenUserDetail}>
        <View
          name="icon"
          style={{
            width: 36,
            height: 36,
            borderRadius: 36,
            marginHorizontal: 10,
            overflow: "hidden",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 36 }}
            source={{ uri: icon }}
          />
        </View>
      </TouchableOpacity>
      {/* message row */}
      <View
        name="middle"
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        {/* text white area */}
        <Text
          style={{
            color: "white",
            fontSize: 14,
            alignSelf: ifLeftAvatar ? "flex-start" : "flex-end",
            fontWeight: 500,
            paddingVertical: 2,
          }}
        >
          {name}
        </Text>

        <View
          name="message"
          style={{
            flex: 1,
            backgroundColor: "#404040",
            marginTop: 3,
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 10,
            borderColor: "#5BBAFF",
            borderWidth: ifBlue ? 2 : 0,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: ifBlue ? "#5BBAFF" : "white",
              fontFamily: ifBlue ? "Lato-Bold" : "Lato-Regular",
            }}
          >
            {text}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 8 }}>
          {messageUserId != userId && ( // Check if it's not the first message
            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => setIsOnDM(true)}>
              <DM_svg isEnabled={allowDM} style={{ width: 20, height: 20, color: "#5F5F5F" }} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            style={{ alignSelf: "center", flexDirection: "row" }}
            onPress={() => {
              setIsRequest(true);
            }}
          >
            <Text
              style={{
                color: isUpVoted ? "#F36262" : "white",
                fontSize: 16,
                alignSelf: "center",
                marginRight: 2,
              }}
            >
              {upVoteNum}
            </Text>

            <Heart_svg isFilled={isUpVoted} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
      {/* row for same space of avatar */}
      <View
        name="dummyView"
        style={{
          width: 36,
          height: 36,
          marginHorizontal: 10,
        }}
      ></View>
    </View>
  );
}
