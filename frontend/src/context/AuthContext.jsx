import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { errMsg } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("gvn_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("gvn_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  function applySession(data) {
    localStorage.setItem("gvn_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(identifier, password) {
    try {
      const { data } = await api.post("/auth/login", { identifier, password });
      return { ok: true, user: applySession(data) };
    } catch (err) {
      return { ok: false, message: errMsg(err, "Đăng nhập thất bại.") };
    }
  }

  async function adminLogin(identifier, password) {
    try {
      const { data } = await api.post("/auth/admin-login", { identifier, password });
      return { ok: true, user: applySession(data) };
    } catch (err) {
      return { ok: false, message: errMsg(err, "Đăng nhập thất bại.") };
    }
  }

  async function loginWithGoogleDemo(email, name) {
    try {
      const { data } = await api.post("/auth/google", { email, name });
      return { ok: true, user: applySession(data) };
    } catch (err) {
      return { ok: false, message: errMsg(err, "Đăng nhập Google thất bại.") };
    }
  }

  async function register(payload) {
    try {
      const { data } = await api.post("/auth/register", payload);
      return { ok: true, user: applySession(data) };
    } catch (err) {
      return { ok: false, message: errMsg(err, "Đăng ký thất bại.") };
    }
  }

  function logout() {
    localStorage.removeItem("gvn_token");
    setUser(null);
  }

  async function refreshMe() {
    const { data } = await api.get("/auth/me");
    setUser(data);
    return data;
  }

  const value = {
    user, loading, isAuthenticated: !!user, isAdmin: user?.role === "admin",
    login, adminLogin, loginWithGoogleDemo, register, logout, refreshMe,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
