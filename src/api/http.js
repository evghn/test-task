import axios from "axios";

const API_BASE_URL = "http://max220mm.beget.tech/api";
export const API_URLS = {
  login: `${API_BASE_URL}/login`,
  tasks: `${API_BASE_URL}/tasks`,
  edit: `${API_BASE_URL}/tasks/`,
  login: `${API_BASE_URL}/login`,
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {},
});
