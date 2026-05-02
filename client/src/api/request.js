import axios from 'axios';
import { getToken, clearAuth } from '../utils/auth';
import { getApiBaseUrl } from '../utils/runtimeConfig';

const request = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      '请求失败';

    return Promise.reject(new Error(message));
  }
);

export default request;
