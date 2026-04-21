import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { accessTokenService } from "../services/accessTokenService";
import { authService } from "../services/authService";

type RequestWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "",
});

instance.interceptors.request.use((config) => {
  const accessToken = accessTokenService.get();

  if (accessToken) {
    config.headers.authorization = `Bearer ${accessToken}`;
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestWithRetry | undefined;

    if (!error.response || error.response.status !== 401) {
      throw error;
    }

    if (!originalRequest) {
      throw error;
    }

    const requestUrl = String(originalRequest.url ?? "");
    if (requestUrl.includes("/refresh")) {
      accessTokenService.remove();
      throw error;
    }

    if (originalRequest._retry) {
      accessTokenService.remove();
      throw error;
    }

    originalRequest._retry = true;

    try {
      const { accessToken } = await authService.refresh();
      accessTokenService.save(accessToken);
      return instance.request(originalRequest);
    } catch {
      accessTokenService.remove();
      await authService.logout();
    }
  },
);

export const useHttp = instance;
