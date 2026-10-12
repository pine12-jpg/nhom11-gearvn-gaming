import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/client";

/** US04 — Quên mật khẩu / đặt lại mật khẩu qua email */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestReset(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
      if (data.devResetToken) setToken(data.devResetToken); // chỉ có ở môi trường dev, phục vụ demo không có SMTP thật
      setStep(2);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  async function doReset(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập…");
      setTimeout(() => navigate("/dang-nhap"), 1200);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container">
      <div className="auth-page">
        <div className="card">
          <h1 style={{ fontSize: 20 }} className="center">Quên mật khẩu</h1>

          {step === 1 && (
            <form onSubmit={requestReset} className="mt-16">
              <p className="muted" style={{ fontSize: 13.5 }}>Nhập email đã đăng ký, hệ thống sẽ gửi mã đặt lại mật khẩu.</p>
              <div className="form-group">
                <label>Email</label>
                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Đang gửi…" : "Gửi mã đặt lại"}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={doReset} className="mt-16">
              {message && <div className="alert alert-info">{message}</div>}
              <div className="form-group">
                <label>Mã đặt lại (gửi qua email)</label>
                <input className="form-control" value={token} onChange={(e) => setToken(e.target.value)} required />
                <p className="form-hint">Đồ án chưa cấu hình SMTP thật nên mã được tự điền sẵn ở đây để demo — xem thêm trong console/log của backend.</p>
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button className="btn btn-primary btn-block" disabled={loading}>{loading ? "Đang xử lý…" : "Đặt lại mật khẩu"}</button>
            </form>
          )}

          <p className="auth-switch"><Link to="/dang-nhap">← Quay lại đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}
