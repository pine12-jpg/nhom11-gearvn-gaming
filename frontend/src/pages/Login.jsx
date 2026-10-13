import PasswordInput from "../components/PasswordInput";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** US02 + US03 — Đăng nhập bằng email/SĐT hoặc đăng nhập nhanh Google (mô phỏng) */
export default function Login() {
  const { login, loginWithGoogleDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await login(form.identifier, form.password, remember);
    setLoading(false);
    if (r.ok) navigate(from, { replace: true });
    else setError(r.message);
  }

  async function submitGoogle(e) {
    e.preventDefault();
    setError("");
    if (!googleEmail.trim()) return;
    setLoading(true);
    const r = await loginWithGoogleDemo(googleEmail.trim(), googleEmail.split("@")[0]);
    setLoading(false);
    if (r.ok) navigate(from, { replace: true });
    else setError(r.message);
  }

  return (
    <div className="page container">
      <div className="auth-page">
        <div className="card">
          <h1 style={{ fontSize: 20 }} className="center">Đăng nhập</h1>
          <form onSubmit={submit} className="mt-16">
            <div className="form-group">
              <label>Email hoặc số điện thoại</label>
              <input className="form-control" placeholder="name@email.com hoặc 0xxxxxxxxx" autoComplete="username" value={form.identifier} onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <PasswordInput placeholder="Nhập mật khẩu" autoComplete="current-password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
            </div>
            <div className="auth-options">
              <label>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
            </div>
            {error && <div className="alert alert-error mt-16">{error}</div>}
            <button className="btn btn-primary btn-block mt-16" disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập"}</button>
          </form>

          <div className="divider-or">hoặc</div>

          {!showGoogle ? (
            <button className="btn-google" onClick={() => setShowGoogle(true)}><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.5 7l7.1 5.5c4.2-3.8 6.6-9.5 6.6-17z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.9 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg> Đăng nhập nhanh bằng Google</button>
          ) : (
            <form onSubmit={submitGoogle}>
              <div className="form-hint mb-8">
                Demo mô phỏng Google OAuth (không gọi Google thật). Nhập email để tạo/đăng nhập tài khoản liên kết.
              </div>
              <input className="form-control" placeholder="ban@gmail.com" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} required />
              <button className="btn btn-dark btn-block mt-8">Tiếp tục với Google</button>
            </form>
          )}

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
          </p>
          <p className="auth-switch">
            <Link to="/admin/login" className="muted">Đăng nhập trang quản trị →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
