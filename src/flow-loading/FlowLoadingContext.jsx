import { tokenCache } from "@/utils/tokenCache";
import React, { createContext, useContext, useState, useEffect } from "react";
export const FlowLoadingContext = createContext();
import { createFlow } from "@/api";
import { navigationRef } from "../router/navigation";
import FlowLoading from "./FlowLoading";
import FlowSummary from "./FlowSummary";

export const FlowLoadingProvider = ({ children }) => {
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [flowId, setFlowId] = useState("");

  const reset = () => {
    setLoadingVisible(false);
    setSummary("");
    setLoadingMessage("");
    setCurrentTopic('");');
  };

  const showFlowLoading = (topic, link, writing) => {
    setCurrentTopic(topic);
    const loadingMsg = "Loading " + topic; //+ link + writing;
    setLoadingMessage(loadingMsg);
    setLoadingVisible(true);
    const user = tokenCache?.getToken("user_id");
    let params = {};
    params["user"] = user;
    params["topic"] = topic;
    if (link) {
      params["type"] = "url";
      params["arg"] = link;
    } else {
      params["type"] = "keyword";
      params["arg"] = writing || topic;
    }

    createFlow(params)
      .then(ret => {
        let data = ret.data || {};
        let summary = "";
        if (data.code === 0) {
          data = data.data || data.Data;
          summary = data.preview;
          let top_flow_id = data["flow_id"];
          setFlowId(top_flow_id);
        } else {
          summary = data.msg || "server error";
        }
        if (summary.length > 500) {
          summary = summary.substring(0, 500) + "...";
        }
        setSummary(summary);
        setLoadingMessage("");
      })
      .catch(err => {
        setSummary("server error");
        setLoadingMessage("");
      });
  };

  const onIgnorePress = () => {
    reset();
  };

  const onTakeALookPress = () => {
    reset();
    navigationRef.current?.navigate("Flow", { top_flow_id: flowId });
  };

  return (
    <FlowLoadingContext.Provider value={showFlowLoading}>
      {children}
      {loadingVisible && loadingMessage && <FlowLoading message={loadingMessage} />}
      <FlowSummary
        content={summary}
        title={currentTopic}
        visible={loadingVisible && summary}
        onIgnorePress={onIgnorePress}
        onTakeALookPress={onTakeALookPress}
        flowId={flowId}
      />
    </FlowLoadingContext.Provider>
  );
};
