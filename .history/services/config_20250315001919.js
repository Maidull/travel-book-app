import { Platform } from "react-native";
import Constants from "expo-constants";

let API_URL = "http://localhost:8000/api";

if (Platform.OS === "android") {
  API_URL = "http://10.0.2.2:8000/api";
} else if (Platform.OS === "ios") {
  const { manifest } = Constants;
  const debuggerHost = manifest?.debuggerHost?.split(":").shift();
  API_URL = `http://${debuggerHost}:8000/api`;
}

export default API_URL;