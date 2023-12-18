import config from "@/config";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Header } from "@/components";
import { getConnection } from "@/utils/socket";
import { tokenCache } from "@/utils/tokenCache";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
function WanderCard(props) {
  const content = props.content;
  const question = props.question;
  return (
    <View style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.questionTxt}>{question}</Text>
      </View>
      <View style={styles.card}>
        <img
          src={config.loadingPrompts}
          width="100%"
          height="100%"
          style={{ display: content ? "none" : "block" }}
        />
        <Text style={styles.contentTxt}>{content}</Text>
      </View>
    </View>
  );
}
function QuestionList(props) {
  const ques = props.ques;
  return (
    <View style={styles.quesContent}>
      {ques.map((q, i) => (
        <View style={styles.card} key={i} onClick={() => props.onClick(q)}>
          <Text style={styles.questionTxt}>{q}</Text>
        </View>
      ))}
    </View>
  );
}

const WanderDetail = props => {
  const { item, question } = props.route.params;
  const [wanderList, setWanderList] = useState([]);
  const [preContentID, setPreContentID] = useState("");
  const [ques, setQues] = useState([]);
  const [quesKey, setQuesKey] = useState("");
  const [rKey, setRKey] = useState("");
  const user = tokenCache?.getToken("user_id");
  const [ask, setAsk] = useState("");

  useEffect(() => {
    getData(question);
  }, []);

  const getData = question => {
    if (!question) return;
    setRKey(() => +new Date());
    let newWander = {
      content: "",
      question: question,
    };
    setWanderList(oldWanderList => [...oldWanderList, newWander]);
    setAsk(() => "");
    setQues(() => []);
    setTimeout(() => {
      let socket = getConnection();
      let printArr = [];
      let typingTimer;
      let startPrint = () => {
        typingTimer = setInterval(() => {
          if (printArr.length > 0) {
            setWanderList(oldWanderList => {
              let lastCard = oldWanderList[oldWanderList.length - 1];
              lastCard["content"] = lastCard["content"] + printArr.shift();
              return [...oldWanderList];
            });
          }
        }, 80);
      };
      let stopPrint = () => typingTimer && clearInterval(typingTimer);
      startPrint();

      let socketPack = {
        event: "message",
        type: "user_ask",
        data: {
          flow: item.flow_id,
          content: {
            topic: item.topic,
            user,
            pre_content_id: preContentID,
            user_question: question,
          },
          timestamp: new Date(),
        },
      };
      socket.send(JSON.stringify(socketPack));
      socket.onData(data => {
        let d = JSON.parse(data);
        if (!d.isDone) {
          printArr.push(d.data);
        } else {
          setTimeout(() => {
            stopPrint();
          }, 20000);
          socket.disconnect();
          setPreContentID(() => d.content_id);
          setTimeout(() => {
            getQuestion(d.content_id);
          }, 1000);
        }
      });
    }, 500);
  };

  const getQuestion = pre_content_id => {
    let socket = getConnection();
    let printArr = [];
    let socketPack = {
      event: "message",
      type: "question_generation",
      data: {
        flow: item.flow_id,
        content: {
          topic: item.topic,
          user,
          pre_content_id: pre_content_id,
        },
        timestamp: new Date(),
      },
    };
    console.log("start gen question:", socketPack);
    socket.send(JSON.stringify(socketPack));
    socket.onData(data => {
      let d = JSON.parse(data);
      if (!d.isDone) {
        printArr.push(d.data);
        setQues(printArr);
      } else {
        setQues(printArr);
        socket.disconnect();
        console.log("end gen question:", socketPack);
        setQuesKey(+new Date());
      }
    });
  };

  function onQuestionClick(question) {
    getData(question);
  }

  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={{ flex: 1, width: windowWidth, height: windowHeight, position: "fixed" }}
        source={{ uri: item.image }}
      >
        <View
          style={{
            backgroundColor: "rgba(51, 51, 51, 0.55)",
            width: windowWidth,
            height: windowHeight,
            overflow: "auto",
          }}
        >
          <Header
            style={{
              wrapper: styles.headerContentWrp,
              headerContent: styles.headerContent,
            }}
            statusBar
            title="Dive In "
            left={
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <View style={styles.rightBtn}>
                  <Image
                    style={styles.searchIcon}
                    source={require("../../../assets/header/chevron-left.png")}
                  />
                </View>
              </TouchableOpacity>
            }
          />
          {wanderList.map(item => {
            return <WanderCard content={item.content} question={item.question} />;
          })}
          {/* what is next */}
          {!!ques && (
            <View style={styles.row1}>
              <Image style={styles.iconDesc} source={require("../../../assets/wanderflow.png")} />
              <Text style={styles.row1txt}>what’s next</Text>
            </View>
          )}
          {/* question 列表 */}
          <QuestionList ques={ques} onClick={onQuestionClick} key={quesKey} />
          {/* write something */}
          {!!ques && (
            <View style={styles.row2} key={rKey}>
              <TextInput
                placeholder="I am curious about something else"
                style={{
                  height: 24,
                  width: 320,
                  color: "#FFF",
                  paddingRight: 6,
                  textAlign: "right",
                  //textShadow: "0px 4px 4px rgba(0, 0, 0, 0.40)",
                }}
                onChangeText={t => setAsk(t)}
              />
              <TouchableOpacity onPress={() => onQuestionClick(ask)}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require("../../../assets/edit.png")}
                />
              </TouchableOpacity>

              {/* <Text style={styles.row2txt}>I am curious about something else</Text>
              <Image style={styles.iconEdit} source={require("../../../assets/edit.png")} /> */}
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default WanderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconEdit: { width: 18, height: 18 },
  iconDesc: { width: 20, height: 20 },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 22,
    marginVertical: 19,
  },
  row1txt: { color: "#FFF", fontSize: 16, lineHeight: 20, fontWeight: 600 },
  row2: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    paddingTop: 40,
    paddingRight: 50,
  },
  row2txt: {
    color: "#FFF",
    paddingRight: 6,
    //textShadow: "0px 4px 4px rgba(0, 0, 0, 0.40)",
  },
  headerContentWrp: {
    backgroundColor: "transparent",
    position: "fixed",
    width: "100%",
    zIndex: 99,
  },
  headerContent: {
    width: 109,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "rgba(231, 231, 231, 0.50)",
    backgroundColor: "rgba(34, 34, 34, 0.50)",
    color: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 32,
    display: "flex",
    fontFamily: "Merriweather",
  },

  rightBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(34, 34, 34, 0.50)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  content: {
    marginTop: 48,
    flexDirection: "column",
    gap: 21,
    marginHorizontal: 21,
  },
  questionTxt: {
    color: "#1529C7",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 600,
  },
  card: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
  },
  contentTxt: {
    color: "#333",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
  },
  quesContent: {
    flexDirection: "column",
    gap: 12,
    marginHorizontal: 21,
  },
});
