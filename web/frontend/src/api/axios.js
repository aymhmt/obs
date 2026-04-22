import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes("/auth/login");
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("kullanici");

      const path = window.location.pathname;
      if (path.startsWith("/ogretmen")) window.location.href = "/teacher";
      else if (path.startsWith("/admin"))   window.location.href = "/admin";
      else                                   window.location.href = "/student";
    }
    return Promise.reject(err);
  }
);

export default api;
