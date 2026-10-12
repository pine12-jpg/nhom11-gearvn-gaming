import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gvn_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Trả về thông điệp lỗi thân thiện lấy từ response của backend */
export function errMsg(err, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  return err?.response?.data?.message || fallback;
}

export default api;
