// axiosInstance.js
import axios from 'axios';
import config from '../config';

console.log('Base URL:', config.apiUrl);
const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
