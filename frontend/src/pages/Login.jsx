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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await login(form.identifier, form.password);
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
              <input className="form-control" value={form.identifier} onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" className="form-control" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="flex justify-between items-center">
              <Link to="/quen-mat-khau" style={{ fontSize: 13 }}>Quên mật khẩu?</Link>
            </div>
            <button className="btn btn-primary btn-block mt-16" disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập"}</button>
          </form>

          <div className="divider-or">hoặc</div>

          {!showGoogle ? (
            <button className="btn-google" onClick={() => setShowGoogle(true)}>🇬 Đăng nhập nhanh bằng Google</button>
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
