import PasswordInput from "../components/PasswordInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** US01 — Đăng ký tài khoản bằng email hoặc số điện thoại */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.email && !form.phone) return setError("Vui lòng nhập email hoặc số điện thoại.");
    if (form.password !== form.confirm) return setError("Mật khẩu nhập lại không khớp.");
    setLoading(true);
    const r = await register(form);
    setLoading(false);
    if (r.ok) navigate("/");
    else setError(r.message);
  }

  return (
    <div className="page container">
      <div className="auth-page">
        <div className="card">
          <h1 style={{ fontSize: 20 }} className="center">Tạo tài khoản mới</h1>
          <form onSubmit={submit} className="mt-16">
            <div className="form-group">
              <label>Họ và tên</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0xxxxxxxxx" />
              </div>
            </div>
            <p className="form-hint" style={{ marginTop: -8, marginBottom: 12 }}>Nhập ít nhất 1 trong 2: email hoặc số điện thoại.</p>
            <div className="form-row">
              <div className="form-group">
                <label>Mật khẩu</label>
                <PasswordInput value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <PasswordInput value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} required />
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary btn-block mt-16" disabled={loading}>{loading ? "Đang tạo tài khoản…" : "Đăng ký"}</button>
          </form>
          <p className="auth-switch">Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}
