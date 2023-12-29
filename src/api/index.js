import request from "@/utils/request";
import config from "@/config/index.js";
import axios from "axios";

//export const getCategorys = () => request.get("/fields/category")
//explore
//export const getWanderFeedList = param => request.post("/get_wander_feed_list", param)
//export const getWanderList = param => request.post("/get_wander_list", param)

//express
//export const getExpressQuestionList = param => request.post(config.express_backend + "/get_express_question_list", param)
//export const createExpression = param => request.post(config.express_backend + "/create_expression", param)
//export const getUserExpressQuestionList = param => request.post(config.express_backend + "/get_user_express_question_list", param)
//export const getExpressionList = param => request.post(config.express_backend + "/get_expression_list", param)
//export const upvote = param => request.post(config.express_backend + "/upvote", param)

//export const getUserInfo = param => request.post(config.express_backend + "/user", param)   //TODO need have localstorage cache, or there will be many request

//export const getFlowList = param => request.post("/get_flow_list", param)
//export const getHotWander = param => request.post("/flow_wander", param)
//export const getContentHotWander = param => request.post("/content_wander", param)
//export const creatWander = param => request.post("/wander", param)

//export const creatUserWanderFlow = param => request.post("/create_user_wander_flow", param)

// create flow
const createFlowRequest = axios.create({
  baseURL: config.scraper_backend,
  timeout: 1000000, // 超时时间
});
export const createFlow = param =>
  createFlowRequest.post("/create_flow", param, {
    timeout: 0, // 设置一个非常大的值 防止浏览器因为timeout而中断请求
  });
