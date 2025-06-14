import axios from "axios";

// export const API_BASE_URL = "/api-tasks";
export const API_BASE_URL = "https://sferum-rtk.infobox.vip/api";
export const API_URLS = {
  login: `${API_BASE_URL}/login`,
  tasks: `${API_BASE_URL}/login`,
  edit: `${API_BASE_URL}/tasks/`,
  logout: `${API_BASE_URL}/logout`,
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {},
});
