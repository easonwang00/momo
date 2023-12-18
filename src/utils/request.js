// @ts-nocheck
import config from "@/config/index.js"
import axios from "axios"
import Toast from 'react-native-root-toast' // 引入类库

const baseURL = __DEV__ ? config.api_test : config.api_prd

// 创建axios实例
const request = axios.create({
  baseURL,
  timeout: 20000, // 超时时间
})

// request拦截器
request.interceptors.request.use(
  async config => {
    return config
  },
  error => Promise.reject(error)
)

// respone拦截器
request.interceptors.response.use(
  response => {
    // code为非100是抛错
    const res = response.data
    if (res.code === 0 && res.data) {
      return res.data
    }
    // Toast.show(res?.msg, { placement: "top", offset: 30 });
    return Promise.reject(res)
  },
  error => {
    let defaultMessage = "server is busy, try later..."
    let errorMessage = error.message || defaultMessage
    if (error.message.includes("timeout")) {
      errorMessage = defaultMessage
    }
    // toast.show(errorMessage, {
    //   placement: "top",
    //   offset: 30,
    // });
    return Promise.reject(error)
  }
)

export default request
