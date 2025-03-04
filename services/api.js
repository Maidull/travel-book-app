import axios from "axios";

const API_URL = "http://10.0.2.2:8000/api";

export const register = async (email, password, name) => {
  return axios.post(`${API_URL}/register`, { email, password, name });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
