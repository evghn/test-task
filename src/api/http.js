import axios from "axios";

export const API_BASE_URL = "/api";
export const API_URLS = {
  login: `${API_BASE_URL}/login`,
  tasks: `${API_BASE_URL}/login`,
  edit: `${API_BASE_URL}/tasks/`,
  login: `${API_BASE_URL}/login`,
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {},
});
