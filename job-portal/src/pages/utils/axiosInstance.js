import axio from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axio.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//====Request interceptor=====
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// ====Response interceptor=====
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    // handle common error globally
    if (err.response) {
      if (err.response.status === 401) {
        // redirect to login page
        window.location.href = "/";
      } else if (err.response.status === 500) {
        console.error("Server error. Please try again later.", err.response.data);
      } else if (err.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.");
      }
      //return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
export default axiosInstance;
