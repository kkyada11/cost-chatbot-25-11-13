/**
 * Axios API 클라이언트 설정
 */

import axios from "axios";
import { API_CONFIG } from "./constants";
import { logger } from "./logger";

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.dev(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    logger.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.dev(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    logger.error("[API Response Error]", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
