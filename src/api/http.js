import axios from "axios";

const API_BASE_URL = "/api";
export const API_URLS = {
  login: `${API_BASE_URL}/login`,
  tasks: `${API_BASE_URL}/tasks`,
  edit: `${API_BASE_URL}/tasks/`,
  login: `${API_BASE_URL}/login`,
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  baseURL: import.meta.env.DEV
    ? API_BASE_URL // будет использовать прокси в development
    : "https://max220mm.beget.tech", // прямое обращение в production
  timeout: 10000,
  headers: {},
});
