import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5091/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Важно для работы с cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Проверяем, является ли ошибка связанной с аутентификацией
    if (
      error.response?.status === 401 &&
      (error.response?.data?.message?.includes("authentication") ||
        error.response?.config?.url?.includes("/auth/"))
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
