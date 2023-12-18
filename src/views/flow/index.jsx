import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Image, TouchableOpacity, FlatList } from "react-native";
import { getFlowList } from "@/api";
import { Header } from "@/components";
import FlowDetail from "../flowDetail";
import * as Animatable from "react-native-animatable";
import PageLoading from "../../components/PageLoading";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class FlowList extends Component {
  constructor(props) {
    super(props);
    let top_flow_id = props.route?.params?.top_flow_id;
    this.state = {
      loading: false,
      animation: "",
      allData: [], // 存放所有flow的盒子
      pageIndex: 1, // 当前页
      top_flow_id: top_flow_id || "",
    };
  }
  componentDidMount() {
    this.getListData();
  }
  componentDidUpdate(prevProps) {
    let top_flow_id = this.props.route?.params?.top_flow_id;
    if (top_flow_id) {
      let prevTopFlowId = prevProps.route?.params?.top_flow_id;
      if (!prevTopFlowId || top_flow_id !== prevTopFlowId) {
        setTimeout(() => {
          this.setState(
            {
              loading: false,
              animation: "",
              allData: [], // 存放所有flow的盒子
              pageIndex: 1, // 当前页
              top_flow_id: top_flow_id,
            },
            () => {
              this.getListData();
            }
          );
        }, 10);
      }
    }
  }

  getListData = async () => {
    const { pageIndex, allData, loading, top_flow_id } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    const params = {
      page: pageIndex,
      pageSize: 4,
      top_flow_id: top_flow_id,
      preview_only: false,
    };
    const res = await getFlowList(params);
    const items = res.items;
    let all = [...allData, ...items];
    const page = pageIndex + 1;
    this.setState({
      loading: false,
      pageIndex: page,
      allData: all,
    });
  };

  onScroll = animation => {
    this.setState({ animation });
  };

  renderItem = ({ item, index }) => (
    <View style={{ width: windowWidth, height: windowHeight }}>
      <FlowDetail onScroll={this.onScroll} key={item ? item.flow_id : index} data={item} />
    </View>
  );

  render() {
    const { animation, allData, loading, pageIndex } = this.state;
    return (
      <View style={styles.container}>
        <Animatable.View
          animation={animation}
          style={{
            backgroundColor: "transparent",
            position: "fixed",
            width: "100%",
            zIndex: 99,
            height: 44,
          }}
        >
          {/* {animation == 'slideInDown' ? <Image resizeMode="cover" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} source={{ uri: 'https://www.politico.com/dims4/default/edb0dd3/2147483647/strip/true/crop/4000x2667+0+0/resize/1290x860!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2Fe9%2F97%2F42fcb5ef4bd3ac0720f05a59b5db%2Frepublican-presidential-debate-89277.jpg' }} /> : null} */}
          <Header
            style={{
              wrapper: {
                backgroundColor: "transparent",
                position: "fixed",
                width: "100%",
                zIndex: 99,
              },
              headerContent: styles.headerContent,
            }}
            statusBar
            title="Dive In "
            left={<></>}
            right={
              <TouchableOpacity>
                <View style={styles.rightBtn}>
                  <Image
                    style={styles.searchIcon}
                    source={require("../../../assets/header/search-FFF.png")}
                  />
                </View>
              </TouchableOpacity>
            }
          />
        </Animatable.View>
        <FlatList
          data={allData}
          removeClippedSubviews
          keyExtractor={(item, index) => `${index} - ${item}`}
          ref={ref => (this.listView = ref)}
          onEndReached={this.getListData}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          horizontal
          onEndReachedThreshold={0.8}
          renderItem={this.renderItem}
          getItemLayout={(item, index) => {
            return { length: windowHeight, offset: windowWidth * index, index };
          }}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50, // item滑动80%部分才会到下一个
          }}
        />
        {pageIndex == 1 && loading ? <PageLoading /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  swiper: {
    marginTop: -46,
  },
});
