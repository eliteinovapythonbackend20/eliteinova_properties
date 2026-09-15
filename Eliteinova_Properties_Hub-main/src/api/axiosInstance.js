import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://eliteinova-properties-backend.vercel.app' || 'http://localhost:8000';
const VERSION = '/api/v1';

export const AUTH_EVENTS = {
  TOKEN_REFRESHED: 'auth:token_refreshed',
  LOGGED_OUT: 'auth:logged_out',
};

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}${VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

function clearSessionAndRedirect() {
  storage.remove('accessToken');
  storage.remove('refreshToken');
  storage.remove('user');
  delete axiosInstance.defaults.headers.common.Authorization;
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGGED_OUT));

  // Avoid redirect loops if we're already on the login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

// Endpoints where a 401 means "bad credentials", not "expired token" —
// these should NEVER trigger a refresh attempt.
const CREDENTIAL_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/oauth'];
const REFRESH_ENDPOINT = '/auth/refresh';

const isCredentialEndpoint = (url = '') =>
  CREDENTIAL_ENDPOINTS.some((path) => url.includes(path));
const isRefreshEndpoint = (url = '') => url.includes(REFRESH_ENDPOINT);

const MAX_NETWORK_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];
const MAX_SERVER_ERROR_RETRIES = 2;
const SERVER_ERROR_RETRY_DELAY = 2000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (!error.response) {
      originalRequest._networkRetryCount = originalRequest._networkRetryCount || 0;

      if (originalRequest._networkRetryCount >= MAX_NETWORK_RETRIES) {
        return Promise.reject(error);
      }

      originalRequest._networkRetryCount += 1;
      const delay = RETRY_DELAYS[originalRequest._networkRetryCount - 1] ?? 5000;
      await wait(delay);
      return axiosInstance(originalRequest);
    }

    const { status, config: req } = error.response ? error : { config: originalRequest };
    const statusCode = error.response.status;

    if (statusCode === 401 && !originalRequest._authRetry) {
      // Wrong credentials on login/register — never refresh, just surface the error.
      if (isCredentialEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      // The refresh call itself failed — session is truly dead.
      if (isRefreshEndpoint(originalRequest.url)) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._authRetry = true;

      // Another request already triggered a refresh — queue behind it.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshTokenValue = storage.get('refreshToken');
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        const { data } = await axiosInstance.post(REFRESH_ENDPOINT, {
          refreshToken: refreshTokenValue,
        });

        const newAccessToken = data.accessToken;
        if (!newAccessToken) {
          throw new Error('Refresh response missing accessToken');
        }

        storage.set('accessToken', newAccessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        window.dispatchEvent(
          new CustomEvent(AUTH_EVENTS.TOKEN_REFRESHED, { detail: { accessToken: newAccessToken } })
        );

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (statusCode >= 500 && statusCode < 600) {
      originalRequest._serverRetryCount = originalRequest._serverRetryCount || 0;

      if (originalRequest._serverRetryCount < MAX_SERVER_ERROR_RETRIES) {
        originalRequest._serverRetryCount += 1;
        await wait(SERVER_ERROR_RETRY_DELAY);
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;