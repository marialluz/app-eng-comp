import axios from "axios";
import { getUserStore } from "../stores/user";

const API_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const newConfig = { ...config, headers: { ...config?.headers } };
    const accessToken = getUserStore().accessToken;

    if (accessToken) {
      newConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (): Promise<string> => {
  const userStore = getUserStore();
  const refreshToken = userStore.accessToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post<{ refresh: string }>(
      `${API_URL}/auth/token/refresh/`,
      {
        refresh: refreshToken,
      }
    );

    const newAccessToken = response.data?.refresh;
    userStore.setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    throw new Error("Failed to refresh token");
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        getUserStore().clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
