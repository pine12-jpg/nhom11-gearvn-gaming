import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gvn_token") || sessionStorage.getItem("gvn_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Khi server báo tài khoản bị khóa => phát sự kiện để hiện bảng thông báo (xem AuthContext + LockedModal)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const d = err?.response?.data;
    if (err?.response?.status === 403 && d?.code === "ACCOUNT_LOCKED") {
      window.dispatchEvent(new CustomEvent("gvn:locked", { detail: d }));
    }
    return Promise.reject(err);
  }
);

/** Trả về thông điệp lỗi thân thiện lấy từ response của backend */
export function errMsg(err, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  return err?.response?.data?.message || fallback;
}

export default api;
