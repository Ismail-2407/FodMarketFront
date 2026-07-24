import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5091/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? "";
      const isAuthCheck = url.includes("/auth/check");
      const isCart = url.includes("/cart");

      if (
        !isAuthCheck &&
        !isCart &&
        !window.location.pathname.includes("/login")
      ) {
        console.warn("401 Unauthorized — redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
