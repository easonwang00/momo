import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Swiper from "react-native-web-swiper";

export default class WanderSwiper extends Component {
  render() {
    return (
      <Swiper ref={ref => (this.swiperRef = ref)}>

      </Swiper>
    )
  }
}