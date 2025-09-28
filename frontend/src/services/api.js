import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://www.swavik.co.in/api"
    : "http://127.0.0.1:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;