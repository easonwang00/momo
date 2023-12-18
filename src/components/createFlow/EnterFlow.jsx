import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { navigationRef } from "../../router/navigation";
import { FlowLoadingContext } from "../../flow-loading/FlowLoadingContext";

function EnterFlow(props) {
  const showFlowLoading = useContext(FlowLoadingContext);
  const handleEnterFlow = () => {
    showFlowLoading(props.topic, props.link, props.writing);
    setTimeout(() => {
      navigationRef.current?.navigate("Flow");
    });
  };
  return (
    <TouchableOpacity style={styles.btn} onPress={handleEnterFlow}>
      <Text style={{ color: "white" }}>Enter Flow</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    color: "white",
    backgroundColor: "rgba(128, 128, 128, 0.1)", // 10%透明度的灰色
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
    textAlign: "center",
  },
});

export default EnterFlow;
