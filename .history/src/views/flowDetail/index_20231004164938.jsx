import config from "@/config";
import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  TextInput,
} from "react-native";
import * as SVG from "react-native-svg";
import { getHotWander, getContentHotWander, creatWander } from "@/api";
import { getConnection } from "@/utils/socket";
import { tokenCache } from "@/utils/tokenCache";
import EZSwiper from "react-native-ezswiper/src/EZSwiper";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default class FlowDetail extends Component {
  scrollViewStartOffsetY = 0;
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      selectTxt: "",
      nopeClick: 0,
      aweSomeClick: 0,
      pre_content_id: "", // 生成的Wander时的content_id
      flowWander: [],
      contentWander: [],
      contentIndex: "", // 选中的content下标
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    const { data } = this.state;
    if (nextProps.data && nextProps.data.flow_id != data.flow_id) {
      this.setState(
        {
          data: nextProps.data,
          selectTxt: "",
          wander: {},
          flowWander: [],
          contentWander: [],
        },
        () => {
          // this.getFlowHotWande();
        }
      );
    }
  }

  // TODO 暂时不用整个flow的热门wander
  getFlowHotWande = async () => {
    const { data } = this.state;
    const res = await getHotWander({ flow_id: data.SK });
    this.setState({ flowWander: res });
  };

  // 小灯泡点击事件
  getContentHotWander = async (content, cIndex) => {
    const res = await getContentHotWander({ content_id: content.PK });
    content["hot_wander"] = [...res.wander_list];
    const temp = data.contents;
    temp.splice(cIndex, 1, content);
    this.setState({
      data: {
        ...data,
        contents: [...temp],
      },
    });
  };

  // 文字选中事件
  onTxtSelect = async (event, cIndex, txt, content, type) => {
    const user_id = await tokenCache?.getToken("user_id");
    const { data, wander, selectTxt, nopeClick, aweSomeClick, pre_content_id } = this.state;
    if (selectTxt != txt) {
      this.top = 0;
      this.setState(
        {
          selectTxt: txt,
          contentIndex: cIndex, // 选中的content下标
          nopeClick: 0,
          aweSomeClick: 0,
          pre_content_id: "",
        },
        () => {
          setTimeout(() => {
            this.top &&
              this.listView.scrollTo({
                y: this.top + 200,
                animated: true,
              });
          }, 300);
        }
      );
      // TODO 滚动置顶
      // this.listView.scrollTo({
      //   y: event.pageY - Number(this.scrollViewStartOffsetY),
      //   animated: true,
      // });
    }
    if (type == "Nope") {
      this.setState({
        nopeClick: nopeClick + 1,
      });
    }
    if (type == "Awesome") {
      this.setState({
        aweSomeClick: aweSomeClick + 1,
      });
    }
    if (type) {
      const temp = data.contents;
      content["creat_wander"] = " ";
      temp.splice(cIndex, 1, content);
      setTimeout(() => {
        this.setState({
          data: {
            ...data,
            contents: [...temp],
          },
        });
      }, 0);
    }

    let typingTimer;
    let printArr = [];
    let startPrint = () => {
      typingTimer = setInterval(() => {
        if (printArr.length > 0) {
          content["creat_wander"] =
            (content["creat_wander"] ? content["creat_wander"] : "") + printArr.shift();
          const temp = data.contents;
          temp.splice(cIndex, 1, content);
          this.setState({
            data: {
              ...data,
              contents: [...temp],
            },
          });
        }
      }, 80);
    };
    let stopPrint = () => typingTimer && clearInterval(typingTimer);
    startPrint();

    let socket = getConnection();
    let socketPack = {
      event: "message",
      type: "rag_query",
      data: {
        flow: content.original_flow_id,
        content: {
          topic: data.topic,
          creator: user_id,
          pre_content_id, // 第一次点击时为空、后续传socket返回的contentId
          original_content_id: content.original_content_id,
          selected_text: txt,
          ask: "",
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
        this.setState({
          pre_content_id: d.content_id,
        });
        socket.disconnect();
        this.top &&
          this.listView.scrollTo({
            y: this.top + 200,
            animated: true,
          });
        setTimeout(() => {
          stopPrint();
        }, 20000);
      }
    });
  };

  /**
   * ScrollView滑动回调事件
   * @param event
   * @private
   */
  _onScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (this.scrollViewStartOffsetY > offsetY) {
      //手势往下滑动，ScrollView组件往上滚动
      DeviceEventEmitter.emit("list_scroll", "slideInUp");
      this.props.onScroll("fadeOutUp");
    } else if (this.scrollViewStartOffsetY < offsetY) {
      //手势往上滑动，ScrollView组件往下滚动
      DeviceEventEmitter.emit("list_scroll", "fadeOutDown");
      this.props.onScroll("slideInDown");
    }
    this.scrollViewStartOffsetY = offsetY;
  };

  _onLayout = e => {
    this.top = e.nativeEvent.layout.y;
  };

  render() {
    const {
      contentIndex,
      data: { image, contributors = [], contents = [], topic = "" },
      flowWander,
      selectTxt,
      nopeClick,
      aweSomeClick,
    } = this.state;
    const tempContributors = contributors.slice(0, 3);
    return (
      <ScrollView
        bounces
        scrollEventThrottle={20}
        style={styles.scrollView}
        ref={ref => (this.listView = ref)}
        onScroll={this._onScroll}
      >
        <View style={{ flex: 1 }}>
          <Image
            style={styles.bg}
            source={{ uri: image }}
            defaultSource={require("../../../assets/image.png")}
          />
          {flowWander.length ? (
            <EZSwiper
              style={{
                width: windowWidth,
                height: 160,
                marginTop: -80,
                backgroundColor: "transparent",
              }}
              dataSource={flowWander}
              width={320}
              height={160}
              offset={12}
              // ratio={0.95}
              renderRow={obj => (
                <View style={[styles.containerStyle]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{ color: "#7461FF", fontSize: 14, fontWeight: 700, lineHeight: 21 }}
                    >
                      Explain
                    </Text>
                    <Image
                      style={{ width: 24, height: 24 }}
                      source={require("../../../assets/fire.png")}
                    />
                  </View>
                  <View style={{ overflow: "hidden" }}>
                    {obj.primary_card.map(c => (
                      <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 24 }}>{c}</Text>
                    ))}
                  </View>
                </View>
              )}
            // onPress={this.onPressRow}
            />
          ) : null}
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            marginTop: 22,
            marginBottom: 16,
          }}
        >
          {topic}
        </Text>
        {contributors ? (
          <View style={styles.contributor}>
            {tempContributors.map((c, index) => (
              <Image
                key={index}
                style={styles.userIcon}
                source={{ uri: c.avatar }}
                defaultSource={require("../../../assets/contributor.png")}
              />
            ))}
            <Text style={styles.contributorTxt}>+{contributors.length}sources</Text>
          </View>
        ) : null}
        <View style={styles.contents}>
          {contents.map((c, cIndex) => {
            return (
              <>
                <View style={styles.content} key={cIndex}>
                  {c.primary_card.map((txt, pIndex) => {
                    return (
                      <Text
                        suppressHighlighting={true}
                        style={[styles.flowTxt, selectTxt == txt && styles.activeTxt]}
                        key={pIndex}
                        onPress={event => this.onTxtSelect(event, cIndex, txt, c)}
                      >
                        {txt}
                      </Text>
                    );
                  })}
                  {c.wander_count ? (
                    <TouchableOpacity
                      style={styles.lightbulb}
                      onPress={() => this.getContentHotWander(c, cIndex)}
                    >
                      <Image
                        source={require("../../../assets/lightbulb-outline.png")}
                        style={styles.lightbulbOutline}
                      />
                      <Text style={styles.wanderCount}>{c.wander_count}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                {/** 小灯泡轮播 */}
                {c.hot_wander && c.hot_wander.length ? (
                  <View>
                    <EZSwiper
                      style={{ width: windowWidth, height: 160, backgroundColor: "transparent" }}
                      dataSource={c.wander}
                      width={320}
                      height={160}
                      offset={12}
                      // ratio={0.95}
                      renderRow={obj => (
                        <View style={[styles.containerStyle]}>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                              style={{
                                color: "#7461FF",
                                fontSize: 14,
                                fontWeight: 700,
                                lineHeight: 21,
                              }}
                            >
                              Explain
                            </Text>
                            <Image
                              style={{ width: 24, height: 24 }}
                              source={require("../../../assets/fire.png")}
                            />
                          </View>
                          <View style={{ overflow: "hidden" }}>
                            {obj.primary_card.map(c => (
                              <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 24 }}>
                                {c}
                              </Text>
                            ))}
                          </View>
                        </View>
                      )}
                    // onPress={this.onPressRow}
                    />
                  </View>
                ) : null}
                {/** 创建 */}
                {contentIndex === cIndex ? (
                  <>
                    <View style={styles.wanderCard} onLayout={this._onLayout}>
                      <View style={styles.header}>
                        <Image
                          source={require("../../../assets/wander.png")}
                          style={{ width: 20, height: 20 }}
                        />
                        <Text style={styles.cardTitle}>I guess you are looking for this?</Text>
                      </View>
                      <View style={styles.body}>
                        <img
                          src={config.loadingPrompts}
                          width="100%"
                          height="100%"
                          style={{ display: c.creat_wander ? "none" : "block" }}
                        />
                        <Text style={styles.bodyTxt}>{c.creat_wander}</Text>
                      </View>
                      <View style={styles.footer}>
                        <TouchableOpacity
                          onPress={() => this.onTxtSelect(null, cIndex, selectTxt, c, "Nope")}
                          style={[
                            styles.footerBtn,
                            { backgroundColor: "#F2F6FD", borderBottomLeftRadius: 12 },
                          ]}
                        >
                          <Text style={styles.footerBtnTxt}>Nope, try again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.onTxtSelect(null, cIndex, selectTxt, c, "Awesome")}
                          style={[
                            styles.footerBtn,
                            {
                              backgroundColor: "rgba(0, 82, 217, 0.20)",
                              borderBottomRightRadius: 12,
                            },
                          ]}
                        >
                          <Text style={styles.footerBtnTxt}>Awesome</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {nopeClick == 2 || aweSomeClick == 6 ? (
                      <TouchableOpacity>
                        <View style={styles.writeBtn}>
                          {nopeClick == 2 && aweSomeClick != 6 ? (
                            <Text>Would you like to write a better version?</Text>
                          ) : null}
                          {aweSomeClick == 6 && nopeClick != 2 ? (
                            <TextInput
                              style={{ height: 24, width: 320, borderBottomColor: "#FFF" }}
                              onChangeText={t => this.setState({ ask: t })}
                            />
                          ) : null}
                          <Image
                            style={{ width: 24, height: 24, marginLeft: 10 }}
                            source={require("../../../assets/arrow-right.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}
              </>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wanderCard: {
    borderRadius: 12,
    borderColor: "#EEE",
    borderWidth: 0.5,
    marginHorizontal: 17,
    marginVertical: 16,
    marginTop: 0,
  },
  header: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  cardTitle: {
    marginLeft: 13,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 600,
  },
  body: {
    paddingHorizontal: 8,
    // maxHeight: 72,
    // overflow: "hidden",
  },
  bodyTxt: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
  },
  footerBtn: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBtnTxt: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 22,
  },
  writeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B4AAFA",
    borderRadius: 12,
    marginTop: 10,
    height: 64,
    marginTop: -10,
    marginHorizontal: 17,
    marginBottom: 17,
  },

  containerStyle: {
    width: 320,
    height: 160,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: "#F2F3FF", //设置阴影色
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginLeft: 24,
    borderWidth: 1,
    borderColor: "#F2F3FF", // 为了兼容web
  },

  scrollView: {
    flex: 1,
  },
  bg: {
    height: 300,
    width: windowWidth,
  },
  contributor: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userIcon: {
    width: 20,
    height: 20,
    marginRight: -5,
    borderRadius: 90,
  },
  contributorTxt: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 16,
  },
  contents: {
    // paddingHorizontal:24,
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 8,
    display: "block",
  },
  flowTxt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
    color: "#333",
  },
  activeTxt: {
    backgroundColor: "rgba(181, 255, 118, 0.5)",
  },
  lightbulb: {
    width: 39,
    height: 33,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "#C9FAFA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: -20,
  },
  lightbulbOutline: {
    width: 16,
    height: 16,
  },
  wanderCount: {
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 15,
  },
});
