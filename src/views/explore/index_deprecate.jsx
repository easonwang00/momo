import React, { Component } from "react";
import { StyleSheet, View, FlatList, DeviceEventEmitter, Dimensions, Text } from "react-native";
import WanderItem from "./wanderItem";
import { getWanderFeedList } from "@/api";
import PageLoading from "../../components/PageLoading";

const windowHeight = Dimensions.get("window").height;

class Explore extends Component {
  scrollViewStartOffsetY = 0; //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      selectCategoty: "",
      categorys: {},
      refreshing: false,
      page: 1,
      listData: [],
    };
  }
  componentDidMount() {
    this.getListData();
  }
  getListData = async () => {
    const { page, listData, refreshing } = this.state;
    if (refreshing) return;
    const params = {
      page,
      pageSize: 10,
      category: "general",
    };
    this.setState({ refreshing: true });
    const res = await getWanderFeedList(params);
    let temp = listData.slice();
    temp = temp.concat(res.items || []);
    this.setState({
      refreshing: false,
      page: page + 1,
      listData: temp,
    });
  };

  questionClick = (item, question) => {
    this.props.navigation.navigate("WanderDetail", {
      item,
      question,
    });
  };

  renderItem = ({ item, index }) => {
    const { currentIndex } = this.state;
    return (
      <WanderItem item={item} connect={currentIndex == index} questionClick={this.questionClick} />
    );
  };

  /**
   * ScrollView滑动回调事件
   * @param event
   * @private
   */
  _onScroll = event => {
    const { refreshing, currentIndex } = this.state;
    if (refreshing) return;
    const offsetY = event.nativeEvent.contentOffset.y;
    if (this.scrollViewStartOffsetY > offsetY) {
      //手势往下滑动，ScrollView组件往上滚动
      DeviceEventEmitter.emit("list_scroll", "slideInUp");
    } else if (this.scrollViewStartOffsetY < offsetY) {
      //手势往上滑动，ScrollView组件往下滚动
      DeviceEventEmitter.emit("list_scroll", "fadeOutDown");
    }
    this.scrollViewStartOffsetY = offsetY;
  };
  _onPageClick() {
    DeviceEventEmitter.emit("list_scroll", "slideInUp");
  }

  _onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length === 1) {
      this.setState({ currentIndex: viewableItems[0].index });
    }
  };

  render() {
    const { refreshing, page } = this.state;

    return (
      <View style={styles.container} onClick={this._onPageClick}>
        <FlatList
          data={this.state.listData}
          removeClippedSubviews
          onScroll={this._onScroll}
          keyExtractor={(item, index) => `${index} - ${item}`}
          ref={ref => (this.listView = ref)}
          onEndReached={this.getListData}
          pagingEnabled={true}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={500}
          renderItem={this.renderItem}
          getItemLayout={(item, index) => {
            return { length: windowHeight, offset: windowHeight * index, index };
          }}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 80, // item滑动80%部分才会到下一个
          }}
          onViewableItemsChanged={this._onViewableItemsChanged}
        />
        {page == 1 && refreshing ? <PageLoading /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sortBtn: {
    marginRight: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FA",
  },
  sortBtnTxt: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
  },
  selectedBtn: {
    backgroundColor: "#0052D9",
  },
  selectedTxt: {
    color: "#FFF",
    fontWeight: "700",
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

export default Explore;
