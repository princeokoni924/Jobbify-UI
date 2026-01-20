import axio from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axio.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false
});

//====Request interceptor=====
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// ====Response interceptor=====
axiosInstance.interceptors.response.use(
  // (response) => {
  //   return response;
  // },
  (response)=>response,
  (err) => {
    // handle common error globally
    // if (err.response) {
    //   if (err.response.status === 401) {
    //     // redirect to login page
    //      window.location.href = "/";
    //   //   localStorage.removeItem('accessToken');
    //   // localStorage.removeItem('user');
    //   // window.location.href = '/login';
    //   } else if (err.response.status === 500) {
    //     console.error("Server error. Please try again later.", err.response.data);
    //   } else if (err.code === "ECONNABORTED") {
    //     console.error("Request timeout. Please try again.");
    //   }
    //   //return Promise.reject(err);
    // }

    const status = err.response?.status
    if(status ===401){
      const isLoginRequest = err.config?.url?.includes('/login');
       if (!isLoginRequest) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    if (status === 500) {
      console.error("Server error:", err.response.data);
    }

    if (err.code === "ECONNABORTED") {
      console.error("Request timeout");
    }
    return Promise.reject(err);
  }
  }

);
export default axiosInstance;
