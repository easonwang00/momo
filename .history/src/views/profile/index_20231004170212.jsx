import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  TextInput,
} from "react-native";
import { ListView, Header } from "@/components";
import { getWanderList } from "@/api";
import { SignOutButton, useUser } from "@clerk/clerk-react";

function UserInfo() {
  const { user } = useUser();
  return (
    <View style={styles.header} onClick={() => { localStorage.clear(); location.reload() }}>
      <View style={styles.user}>
        <Image style={styles.userIcon} source={user.imageUrl} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.email}>@{user.username}</Text>
        </View>
      </View>
    </View>
  );
}

const defaultImg = require("../../../assets/header/thumb_default.png");
const activeImg = require("../../../assets/header/thumb_active.png");
export default class Profile extends Component {
  scrollViewStartOffsetY = 0; //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
  constructor(props) {
    super(props);
    this.state = {
      selectCategoty: "",
      categorys: {},
      activeTab: 1,
    };
  }

  componentDidMount() { }
  tabClick(index) {
    this.setState({
      activeTab: index,
    });
  }
  getListData = (page, fetchEnd, fetchError) => {
    const params = {
      page,
      limit: 10,
    };

    getWanderList(params)
      .then(res => {
        fetchEnd(res.items, 10);
      })
      .catch(() => {
        fetchError();
      });
  };

  jump = (key, data) => {
    const { navigation } = this.props;
    navigation.navigate(key, data);
  };

  // renderItem = (item) => <WanderCard item={item} jump={this.jump} />;
  renderItem = (item, index) => (
    <View>
      <Text>
        {index}
        {item.topic}
      </Text>
    </View>
  );

  /**
   * ScrollView滑动回调事件
   * @param event
   * @private
   */
  _onScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (this.scrollViewStartOffsetY > offsetY) {
      //手势往下滑动，ScrollView组件往上滚动
      !this.listView.state.refreshing && DeviceEventEmitter.emit("list_scroll", "slideInUp");
    } else if (this.scrollViewStartOffsetY < offsetY) {
      //手势往上滑动，ScrollView组件往下滚动
      !this.listView.state.refreshing && DeviceEventEmitter.emit("list_scroll", "fadeOutDown");
    }
    this.scrollViewStartOffsetY = offsetY;
  };

  render() {
    const { activeTab } = this.state;
    return (
      <View style={styles.container}>
        <Header
          statusBar
          title="Profile"
          left={<></>}
          right={
            <TouchableOpacity>
              <View style={styles.rightBtn}>
                <Image
                  style={styles.searchIcon}
                  source={require("../../../assets/header/search.png")}
                />
              </View>
            </TouchableOpacity>
          }
        />
        <SignOutButton>
          <UserInfo />
        </SignOutButton>
        <View style={styles.inputContent}>
          <TextInput
            style={styles.input}
            placeholder="Add content for generating better flows"
            // onChangeText={onChangeText}
            clearButtonMode="always"
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
          />
          <View style={styles.addBtn}>
            <Text style={styles.btnTxt}>+</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => this.tabClick(0)}
            style={[
              styles.tab,
              activeTab == 0 && { backgroundColor: "#FFF", borderBottomRightRadius: 9 },
            ]}
          >
            <Image style={styles.tabIcon} source={activeTab == 0 ? activeImg : defaultImg} />
            <Text style={[styles.tabTxt, activeTab == 1 && { color: "#0052D9" }]}>Wanders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.tabClick(1)}
            style={[
              styles.tab,
              activeTab == 1 && {
                backgroundColor: "#FFF",
                borderTopLeftRadius: 9,
                borderTopColor: "#0052D9",
                borderTopWidth: 1,
              },
            ]}
          >
            <Image style={styles.tabIcon} source={activeImg} />
            <Text style={[styles.tabTxt, activeTab == 1 && { color: "#0052D9" }]}>Flows</Text>
          </TouchableOpacity>
        </View>
        <ListView
          firstLoader
          onScroll={this._onScroll}
          scrollEventThrottle={16}
          ref={ref => (this.listView = ref)}
          onFetch={this.getListData}
          renderSeparator={() => <View style={styles.separator}></View>}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginHorizontal: 16,
  },
  user: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: 700,
  },
  email: {
    paddingTop: 6,
  },
  inputContent: {
    marginHorizontal: 16,
    marginVertical: 24,
    gap: 4,
    borderRadius: 8,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "rgba(0, 0, 0, 0.10)",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    height: "100%",
  },
  addBtn: {
    width: 28,
    height: "100%",
    backgroundColor: "#C9FAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    fontSize: 24,
  },
  tab: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#EEE",
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
  },
  tabIcon: {
    width: 23,
    height: 23,
  },
  tabTxt: {
    fontSize: 14,
    fontWeight: 400,
  },

  separator: {
    height: 16,
  },
  rightBtn: {
    width: 32,
    height: 32,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E7E7E7",
    borderRadius: 16,
    borderWidth: 0.5,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
});
