// @ts-nocheck
import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import EmptyBox from "../empty-box";

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  done: 3, // 请求完成
};

export default class RefreshList extends Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.page = 1;
    this._flatList = null;
    this.rows = [];
    this.state = {
      refreshing: false,
      dataSource: [],
      paginationStatus: PaginationStatus.firstLoad,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { firstLoader } = this.props;
    if (firstLoader) {
      this.setState(
        {
          refreshing: true,
        },
        () => {
          this.props.onFetch(this.getPage(), this.endFetch, this.fetchError);
        }
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setPage = (page) => (this.page = page);

  getPage = () => this.page;

  setRows = (rows = []) => (this.rows = rows);

  getRows = () => this.rows;

  endFetch = (rows = [], pageLimit = 20) => {
    if (this.mounted) {
      let paginationStatus = PaginationStatus.done;
      if (rows.length < pageLimit) {
        paginationStatus = PaginationStatus.allLoaded;
      }
      this.updateRows(rows, paginationStatus);
    }
  };

  updateRows = (rows, paginationStatus) => {
    const dataSource = rows && rows.length ? this.getRows().concat(rows) : this.getRows().slice();
    this.setState({
      dataSource,
      refreshing: false,
      paginationStatus,
    });
    this.setRows(dataSource);
  };

  onRefresh = () => {
    if (this.mounted) {
      this._flatList?.scrollToOffset({ animated: true, offset: 0 });
      this.setPage(1);
      this.setRows([]);
      this.setState(
        {
          refreshing: true,
        },
        () => {
          this.props.onFetch(this.getPage(), this.endFetch, this.fetchError);
        }
      );
    }
  };

  fetchError = () => {
    this.setState({
      refreshing: false,
    });
  };

  onEndReached = () => {
    const { refreshing, paginationStatus } = this.state;
    if (
      !refreshing
      &&
      paginationStatus !== PaginationStatus.waiting &&
      paginationStatus !== PaginationStatus.allLoaded
    ) {
      this.setPage(this.getPage() + 1);
      this.setState({ refreshing: true, paginationStatus: paginationStatus.waiting }, () => {
        this.props.onFetch(this.getPage(), this.endFetch, this.fetchError);
      });
    }
  };

  renderItem = ({ item = {}, index, separators }) => {
    const { renderItem = null } = this.props;
    return renderItem ? renderItem(item, index, separators) : null;
  };

  renderSeparator = () => {
    const { renderSeparator } = this.props;
    return renderSeparator ? renderSeparator() : null;
  };

  renderHeader = () => {
    const { renderHeader } = this.props;
    return renderHeader ? renderHeader() : null;
  };

  renderFooter = () => {
    const { refreshing } = this.state;
    return (
      <View style={styles.footer}>
        {refreshing && this.getRows().length ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.footerTitle}>{this.getRows().length ? "No more data" : null}</Text>
        )}
      </View>
    );
  };

  renderEmptyView = () => {
    return <EmptyBox />;
  };

  render() {
    const { dataSource, refreshing } = this.state;
    return (
      <FlatList
        data={dataSource}
        {...this.props}
        ref={ref => (this._flatList = ref)}
        refreshing={refreshing}
        keyExtractor={(item, index) => `${index} - ${item}`}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        estimatedItemSize={150}
        progressViewOffset={20}
        extraData={this.state}
        onEndReached={this.onEndReached}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.renderEmptyView}
      />
    );
  }
}

const styles = StyleSheet.create({
  footer: {},
  footerTitle: {
    textAlign: "center",
    padding: 20,
    color: "#CCC",
  },
});
