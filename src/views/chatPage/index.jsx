import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { getUserInfo } from "@/api";
import { useUser } from "@clerk/clerk-expo";
import config from "@/config";
import { useFocusEffect } from "@react-navigation/native";
import {
  connectUser,
  fetchChatChannels,
  createChannelWithUser,
} from "@/views/chatPage/sendbird_helper.js";

export default function ChatPage({ route, navigation }) {
  const APP_ID = config.sendbird_app_id;
  const { user } = useUser();
  const currentUserId = __DEV__ ? config.test_userid : "user#" + user.id;
  const [sbInstance, setSbInstance] = useState(null);
  const [channels, setChannels] = useState([]); // Define channels state here

  useFocusEffect(
    useCallback(() => {
      const fetchChannels = async () => {
        if (sbInstance) {
          try {
            var channelList = await fetchAllChatChannels(sbInstance);
            //channelList = channels.concat(channelList);   //TODO ?? what is this for, eason?
            console.log("channelList length", channelList.length);
            setChannels(channelList);
            //console.log("==onFetchChannels", channelList);
          } catch (error) {
            console.error("Error fetching channels:", error);
          }
        }
      };

      fetchChannels();
    }, [sbInstance])
  );
  useEffect(() => {
    console.log("currentUserId", currentUserId);
    const initializeConnection = async () => {
      try {
        const sb = await connectUser(APP_ID, currentUserId, currentUserId);
        setSbInstance(sb);
      } catch (error) {
        console.error("Error initializing SendBird connection:", error);
      }
    };

    initializeConnection();

    return () => {
      if (sbInstance) {
        sbInstance.disconnect();
      }
    };
  }, []);

  const fetchAllChatChannels = async sbInstance => {
    if (sbInstance) {
      sbInstance.disconnect();
    }
    const sb = await connectUser(APP_ID, currentUserId, currentUserId);
    setSbInstance(sb);
    return new Promise(async (resolve, reject) => {
      let allChannels = [];
      const channelListQuery = sbInstance.GroupChannel.createMyGroupChannelListQuery();
      channelListQuery.includeEmpty = true;
      channelListQuery.order = "latest_last_message";

      try {
        while (channelListQuery.hasNext) {
          const channels = await channelListQuery.next();
          allChannels = allChannels.concat(channels);
        }
        console.log(`Fetched ${allChannels.length} channels in total`);
        resolve(allChannels);
      } catch (error) {
        console.error("Error fetching all channels:", error);
        reject(error);
      }
    });
  };
  const handleCreateChannel = async otherUserUuid => {
    if (!sbInstance) {
      console.error("SendBird instance is not initialized.");
      return;
    }
    try {
      const newChannel = await createChannelWithUser(sbInstance, currentUserId, otherUserUuid);
      navigation.navigate("ChatWindow", { channel: newChannel });
    } catch (error) {
      console.error("Error in createChannelWithUser:", error);
    }
  };

  const renderChannelItem = ({ item }) => {
    return <ChannelItem item={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2b2b2b",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          marginBottom: 56,
        }}
      >
        {/*       
      <Text>{`${currentUserId}的Chat List`}</Text> */}
        <Text
          style={{
            color: "white",
            fontFamily: "Lato-Bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Wander
        </Text>
        <TextInput
          style={{
            marginHorizontal: 15,
            backgroundColor: "#404040",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 12,
            color: "white",
            textAlign: "center",
            fontSize: 14,
            fontFamily: "Lato-Regular",
            marginVertical: 15,
          }}
          placeholder="Search (Not Available)"
          placeholderTextColor="#ABABAB"
        ></TextInput>
        {channels.length == 0 ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ABABAB",
                fontSize: 16,
                fontFamily: "Lato-Bold",
              }}
            >
              No message
            </Text>
          </View>
        ) : (
          <FlatList
            data={channels}
            renderItem={renderChannelItem}
            keyExtractor={item => item.url}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function ChannelItem({ item, navigation }) {
  // TODO use useEffect to request nickname in our backend, I can do this, but need api from backend - Mingzhe Piao
  const { user } = useUser();
  const currentUserId = __DEV__ ? config.test_userid : "user#" + user.id;
  //console.log(item);
  const userId =
    item.members[0].userId == currentUserId
      ? item.members[1]
        ? item.members[1].userId
        : currentUserId
      : item.members[0].userId;
  const [itemUser, setItemUser] = useState();
  useEffect(() => {
    getUserInfo({ userId }).then(
      res => {
        //console.log(res.data[0]);
        setItemUser(res.data[0]);
      },
      err => {
        console.log("error when get User info", err);
      }
    );
  }, []);
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
      }}
      onPress={() => {
        navigation.navigate("ChatWindow", {
          channel: item,
        });
      }}
    >
      <View
        name="icon"
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          marginRight: 10,
          overflow: "hidden",
        }}
      >
        <Image
          style={{ width: "100%", height: "100%", borderRadius: 36 }}
          source={{ uri: itemUser?.avatar }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Lato-Bold",
              color: "white",
              textAlignVertical: "center",
            }}
          >
            {itemUser?.user_name}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Lato-Bold",
              color: "#a7a7a7",
              textAlignVertical: "center",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage?.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  item: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
    color: "black",
  },
});
