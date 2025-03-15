import axios from "axios";
import API_URL from "./config";

//const API_URL = "http://10.0.2.2:8000/api";
//const API_URL = "http://192.168.68.108:8000/api";

export const register = async (email, password, name) => {
  return axios.post(`${API_URL}/register`, { email, password, name });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
