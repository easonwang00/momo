import React, { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-expo"
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native"
import Back_button from "../../../assets/svg/Back_button"
import { getUserInfo } from "@/api"
import SendBird from "sendbird"

export default function ChatWindow ({ route, navigation }) {
  const { channel } = route.params
  const { user } = useUser()
  //console.log("channel", channel)
  const onBack = () => {
    navigation.goBack()
  }
  // TODO get user detail name and avatar, need backend  - Mingzhe Piao 
  const { url: channelUrl } = channel
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [currentUserId, setCurrentUserId] = useState(null)
  const [otherUserId, setOtherUserId] = useState(" ")
  const [otherUser, setOtherUser] = useState()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const scrollViewRef = useRef()
  useEffect(() => {
    const sb = SendBird.getInstance()
    setCurrentUserId(sb.currentUser.userId)
    const userId = (channel.members[0].userId == sb.currentUser.userId) ? (channel.members[1] ? channel.members[1].userId : sb.currentUser.userId) : channel.members[0].userId
    //console.log("channel", channel)
    //console.log(userId)
    //console.log(sb.currentUser.userId)
    setOtherUserId(userId)
    const param = {
      userId: userId
    }
    getUserInfo(param).then((res) => {
      console.log(res)
      setOtherUser(res.data[0])
    }, (err) => {
      console.log("err", err)
    })

    const channelHandler = new sb.ChannelHandler()

    // Load previous messages
    loadPreviousMessages(channelUrl)

    // Receive new messages
    channelHandler.onMessageReceived = (channel, message) => {
      setMessages(prevMessages => [message, ...prevMessages,])
    }
    sb.addChannelHandler(`handler-${channelUrl}`, channelHandler)
    return () => {
      sb.removeChannelHandler(`handler-${channelUrl}`)
    }
  }, [channelUrl])
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true) // or some other action
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false) // or some other action
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])
  useEffect(() => {
    if (isKeyboardVisible) {
      scrollToEnd()
    }
  }, [isKeyboardVisible])
  const scrollToEnd = () => {
    scrollViewRef.current.scrollTo({ animated: true })
  }
  //TODO open user detail page need all this variables
  const onOpenUserDetail = (userID, userIcon, userName) => {
    navigation.push("UserExpressList", { userID, userIcon, userName })
  }
  const loadPreviousMessages = channelUrl => {
    const sb = SendBird.getInstance()
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        console.error("Error getting channel:", error)
        return
      }

      const messageListQuery = channel.createPreviousMessageListQuery()
      messageListQuery.load(20, true, (messages, error) => {
        if (error) {
          console.error("Error loading previous messages:", error)
          return
        }
        setMessages(messages)
      })
    })
  }

  const sendMessage = () => {
    const sb = SendBird.getInstance()
    console.log("Sending message to channel:", channelUrl)

    if (!sb.currentUser) {
      console.error("Can't send message. User is not connected.")
      return
    }

    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        console.error("Error getting channel:", error)
        return
      }

      if (!channel) {
        console.error("Channel is null. Channel URL may be incorrect:", channelUrl)
        return
      }

      channel.sendUserMessage(text, (message, error) => {
        if (error) {
          console.error("Error sending message:", error)
          return
        }
        setMessages(prevMessages => [message, ...prevMessages,])
        setText("")
      })
    })
  }
  const renderMessageItem = (msg, index) => {
    const isMyMessage = msg.sender.userId === currentUserId
    // TODO no need to use if else
    if (isMyMessage) {
      return <UserChatMessage key={index} isMyMessage={isMyMessage} icon={user.imageUrl} text={msg.message} />
    } else {
      //TODO change the imageUrl to 
      return <UserChatMessage key={index} isMyMessage={isMyMessage} icon={otherUser?.avatar} text={msg.message} />
    }
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#2b2b2b",
    }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "space-between",
          //backgroundColor: "pink"
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View name="toptab" style={{
          flexDirection: "row",
          //backgroundColor: "green",
          marginVertical: 5,
          justifyContent: "flex-start"
        }}>
          {/* back button */}
          <Text style={{
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: 24,
            fontFamily: "Lato-Bold",
            alignSelf: "center",
            justifyContent: "center"
          }}> {otherUser ? otherUser.user_name : otherUserId.slice(-6, -1)}</Text>
          <TouchableOpacity style={{
            position: "absolute",
            height: "100%",
            paddingHorizontal: 10,
          }} onPress={onBack}>
            <Back_button
              style={{
                width: 24,
                height: 24,
                marginTop: 2,
                color: "white",
                flex: 1,
              }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{
          flex: 1,
          marginTop: 15,
          transform: [{ scaleY: -1 }]
        }}
          ref={scrollViewRef}>
          <View style={{ height: 25, width: "100%" }}></View>
          {messages.map(renderMessageItem)}

        </ScrollView>
        <View>
          <View style={{
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            paddingHorizontal: 12
          }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              style={{
                backgroundColor: "#404040",
                color: "white",
                fontFamily: "Lato-Regular",
                borderColor: "#818181",
                borderWidth: 2,
                fontSize: 14,
                flex: 1,
                borderRadius: 12,
                paddingHorizontal: 12
              }}
              placeholderTextColor="#D5D5D5"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            {/* user icon row */}
            <TouchableOpacity style={{ height: 36 }}>
              <View
                name="icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  marginRight: -3,
                  marginLeft: 10,
                  overflow: "hidden",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%", borderRadius: 36 }}
                  source={{ uri: user.imageUrl }}
                />
              </View>
            </TouchableOpacity>
            {/* <Button title="Send" onPress={sendMessage} /> */}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
function UserChatMessage ({ icon, isMyMessage, text }) {
  return <View
    style={{
      width: "100%",
      marginBottom: 20,
      flexDirection: !isMyMessage ? "row" : "row-reverse",
      transform: [{ scaleY: -1 }]
    }}
  >
    {/* user icon row */}
    <TouchableOpacity style={{ height: 36 }}>
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
      <View
        name="message"
        style={{
          flex: 1,
          backgroundColor: isMyMessage ? "#D7DCF9" : "#404040",
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: isMyMessage ? "black" : "white",
            fontFamily: "Lato-Regular",
          }}
        >
          {text}
        </Text>
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
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // or any other background color you want for the safe area
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  backButtonContainer: {
    flex: 1,
    padding: 100,
    // other styling properties as needed
  },
  messagesContainer: {
    flex: 1,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
  },
  sender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 100,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 50,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  message: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
})
