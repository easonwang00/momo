import React, { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import { navigationRef } from "@/router/navigation";
import { FlowLoadingContext } from "../../flow-loading/FlowLoadingContext";

// 重写成函数组件 用来使用useUser
const StartWander = props => {
  const showFlowLoading = useContext(FlowLoadingContext);

  const handleStartWander = () => {
    showFlowLoading(props.topic, props.link, props.writing);
    setTimeout(() => {
      navigationRef.current?.navigate("Wander");
    });
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleStartWander}>
      <Text style={{ color: "white" }}>Start Wander</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    color: "white",
    backgroundColor: "rgba(128, 128, 128, 0.1)", // 10%透明度的灰色
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
    textAlign: "center",
  },
};

export default StartWander;
