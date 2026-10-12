import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** US30 — Đăng nhập trang quản trị riêng, tách biệt với giao diện khách hàng */
export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "admin@gvngaming.vn", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await adminLogin(form.identifier, form.password);
    setLoading(false);
    if (r.ok) navigate("/admin");
    else setError(r.message);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: 380 }}>
        <h1 className="center" style={{ fontSize: 20 }}>
          GVN<span style={{ color: "var(--red-600)" }}>ADMIN</span>
        </h1>
        <p className="center muted" style={{ fontSize: 13 }}>Trang quản trị hệ thống GVN Gaming</p>
        <form onSubmit={submit} className="mt-16">
          <div className="form-group">
            <label>Email quản trị</label>
            <input className="form-control" value={form.identifier} onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" className="form-control" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Đang đăng nhập…" : "Đăng nhập quản trị"}</button>
        </form>
        <p className="form-hint center mt-16">Demo: admin@gvngaming.vn / Admin@123</p>
        <p className="auth-switch"><Link to="/">← Về trang khách hàng</Link></p>
      </div>
    </div>
  );
}
