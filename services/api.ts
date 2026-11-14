import axios from 'axios';

import { API_TIMEOUT_MS, API_URL, STORAGE_KEYS } from '@/constants/config';

import { AppStorage } from './storage';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AppStorage.getItem(STORAGE_KEYS.userToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
