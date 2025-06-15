import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { http, API_URLS } from "@/api/http";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") ?? "");

  const userLocal = localStorage.getItem("user");

  if (token.value && userLocal) {
    const parsed = JSON.parse(userLocal);
    user.value = { login: parsed.login };
  }

  const error = ref(null);

  let isGuest = computed(() => {
    return !token.value.length;
  });

  const setAuth = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify({ login: user.value.login }));
    http.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    http.defaults.withCredentials = true;
  };

  const login = async (credentials) => {
    try {
      const response = await http.post(API_URLS.login, credentials);
      if (response?.data.token) {
        setAuth(credentials, response.data.token);
        // router.push("/tasks");
        return response;
      }
      error.value = response.data;
      return false;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
    }
  };

  const clearAuth = () => {
    user.value = null;
    token.value = "";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete http.defaults.headers.common["Authorization"];
    http.defaults.withCredentials = false;
  };

  const logout = async () => {
    try {
      const response = await http.post(API_URLS.logout, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 204) {
        clearAuth();
        return true;
      }
    } catch (error) {
      // console.log(error);
      return false;
    }
  };

  const setAuthHeader = (token = token.value) => {
    if (token) {
      token.value = token;
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      http.defaults.withCredentials = true; // Включаем отправку credentials
    } else {
      clearAuth();
    }
  };

  const checkAuth = async () => {
    if (token.value) {
      try {
        setAuthHeader();
        const response = await http.post(API_URLS.auth);
        if (response.status == 200) {
          user.value = response.data.user;
          console.log(user.value);
          return true;
        } else {
          clearAuth();
          return false;
        }
      } catch (err) {
        clearAuth();
        return false;
      }
    }
  };

  // Инициализируем при старте приложения
  checkAuth();

  return {
    user,
    token,
    error,
    login,
    logout,
    isGuest,
    checkAuth,
  };
});
