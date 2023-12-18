// @ts-nocheck
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const createTokenCache = () => {
  return {
    getToken: key => {
      return Platform.OS == "web" ? localStorage.getItem(key) : SecureStore.getItemAsync(key);
    },
    saveToken: (key, token) => {
      return Platform.OS == "web"
        ? localStorage.setItem(key, token)
        : SecureStore.setItemAsync(key, token);
    },
  };
};

// SecureStore is not supported on the web
// https://github.com/expo/expo/issues/7744#issuecomment-611093485
export const tokenCache = createTokenCache();
