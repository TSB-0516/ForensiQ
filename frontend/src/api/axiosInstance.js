import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every outgoing request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ueiip_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling: expired/invalid token -> force back to login.
// Every other error is passed through so each caller can show its own
// toast/message rather than this file guessing what happened.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ueiip_token");
      localStorage.removeItem("ueiip_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;