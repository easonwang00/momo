import React, { Component, userState, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  DeviceEventEmitter,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import ExpressItem from "./ExpressItem";
import { getExpressQuestionList } from "@/api";
import PageLoading from "../../components/PageLoading";
import { useUser } from "@clerk/clerk-react";
const windowHeight = Dimensions.get("window").height;
function Express(props) {
  const [scrollViewStartOffsetY, setScrollViewStartOffsetY] = useState(0); //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState([]);
  const { user } = useUser();
  const getListData = async () => {
    if (refreshing) return;
    const params = {
      page: page,
      pageSize: 10,
      user: __DEV__ ? undefined : "user#" + user.id, //for the filter of expressed question
    };
    setRefreshing(true);
    const res = await getExpressQuestionList(params);
    console.log("====express fetch data");
    //console.log("==states", this.state);
    let temp = listData.slice();
    temp = temp.concat(res.items || []);
    setRefreshing(false);
    setPage(page + 1);
    setListData(temp);
  };
  useEffect(() => {
    getListData();
  }, []);
  const deleteListItemByPK = pk => {
    const newListData = listData.filter(item => item.PK != pk);
    setListData(newListData);
  };
  const createExpress = item => {
    props.navigation.navigate("CreateExpress", {
      item,
      deleteListItemByPK: deleteListItemByPK,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <ExpressItem item={item} connect={currentIndex == index} createExpress={createExpress} />
    );
  };

  /**
   * ScrollView滑动回调事件
   * @param event
   * @private
   */
  const _onScroll = event => {
    if (refreshing) return;
    const offsetY = event.nativeEvent.contentOffset.y;
    if (scrollViewStartOffsetY > offsetY) {
      //手势往下滑动，ScrollView组件往上滚动
      DeviceEventEmitter.emit("list_scroll", "slideInUp");
    } else if (scrollViewStartOffsetY < offsetY) {
      //手势往上滑动，ScrollView组件往下滚动
      DeviceEventEmitter.emit("list_scroll", "fadeOutDown");
    }
    setScrollViewStartOffsetY(offsetY);
  };
  const _onPageClick = () => {
    console.log("_onPageClick");
    DeviceEventEmitter.emit("list_scroll", "slideInUp");
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length === 1) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View style={styles.container} onPress={_onPageClick}>
      <FlatList
        data={listData}
        removeClippedSubviews
        onScroll={_onScroll}
        keyExtractor={(item, index) => `${index} - ${item}`}
        //ref={ref => (listView = ref)}
        onEndReached={getListData}
        pagingEnabled={true}
        onEndReachedThreshold={0.2}
        scrollEventThrottle={500}
        renderItem={renderItem}
        getItemLayout={(item, index) => {
          return { length: windowHeight, offset: windowHeight * index, index };
        }}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 80, // item滑动80%部分才会到下一个
        }}
        onViewableItemsChanged={_onViewableItemsChanged}
      />
      {page == 1 && refreshing ? <PageLoading /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Express;
