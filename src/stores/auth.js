import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { http, API_URLS } from "@/api/http";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref("");
  const error = ref(null);

  const isGuest = computed(() => {
    return !token.value.length;
  });

  const setAuth = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem("token", authToken);
    http.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    delete http.defaults.headers.common["Authorization"];
  };

  const login = async (credentials) => {
    try {
      const response = await http.post(API_URLS.login, credentials);
      if (response?.data.token) {
        setAuth(credentials, response.data.token);
        // router.push("/tasks");
        return true;
      }

      return false;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      // isLoading.value = false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const checkAuth = async () => {
    if (token.value) {
      try {
        isLoading.value = true;
        http.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
        const response = await http.get("/api/auth/me");
        user.value = response.data.user;
      } catch (err) {
        clearAuth();
      } finally {
        isLoading.value = false;
      }
    }
  };

  return {
    user,
    token,

    error,
    login,
    logout,
    isGuest,
  };
});
