import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api, { errMsg } from "../api/client";

/** US05 — Cập nhật thông tin cá nhân + đổi mật khẩu; US22 — Xác thực HSSV */
export default function Account() {
  const { user, refreshMe } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [hssv, setHssv] = useState({ school: "", studentId: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setErrors((s) => ({ ...s, profile: "" }));
    setLoading((s) => ({ ...s, profile: true }));
    try {
      await api.put("/auth/me", profile);
      await refreshMe();
      toast.success("Cập nhật thông tin cá nhân thành công.");
    } catch (err) {
      setErrors((s) => ({ ...s, profile: errMsg(err) }));
    } finally {
      setLoading((s) => ({ ...s, profile: false }));
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setErrors((s) => ({ ...s, pwd: "" }));
    if (pwd.newPassword !== pwd.confirm) return setErrors((s) => ({ ...s, pwd: "Mật khẩu mới nhập lại không khớp." }));
    setLoading((s) => ({ ...s, pwd: true }));
    try {
      await api.put("/auth/password", pwd);
      setPwd({ oldPassword: "", newPassword: "", confirm: "" });
      toast.success("Đổi mật khẩu thành công.");
    } catch (err) {
      setErrors((s) => ({ ...s, pwd: errMsg(err) }));
    } finally {
      setLoading((s) => ({ ...s, pwd: false }));
    }
  }

  async function verifyHssv(e) {
    e.preventDefault();
    setErrors((s) => ({ ...s, hssv: "" }));
    setLoading((s) => ({ ...s, hssv: true }));
    try {
      const { data } = await api.post("/auth/hssv", hssv);
      await refreshMe();
      toast.success(data.message);
    } catch (err) {
      setErrors((s) => ({ ...s, hssv: errMsg(err) }));
    } finally {
      setLoading((s) => ({ ...s, hssv: false }));
    }
  }

  if (!user) return null;

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>Thông tin tài khoản</h1>
      <div className="cart-layout mt-16">
        <div>
          <div className="card">
            <h3 className="panel-title">Thông tin cá nhân</h3>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input className="form-control" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email {user.email && <span className="muted">(không thể đổi)</span>}</label>
                  <input className="form-control" value={user.email || "—"} disabled />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input className="form-control" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <input className="form-control" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} />
              </div>
              {errors.profile && <div className="alert alert-error">{errors.profile}</div>}
              <button className="btn btn-primary" disabled={loading.profile}>{loading.profile ? "Đang lưu…" : "Lưu thay đổi"}</button>
            </form>
          </div>

          <div className="card mt-16">
            <h3 className="panel-title">Đổi mật khẩu</h3>
            <form onSubmit={changePassword}>
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input type="password" className="form-control" value={pwd.oldPassword} onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input type="password" className="form-control" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Nhập lại mật khẩu mới</label>
                  <input type="password" className="form-control" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} required />
                </div>
              </div>
              {errors.pwd && <div className="alert alert-error">{errors.pwd}</div>}
              <button className="btn btn-outline" disabled={loading.pwd}>{loading.pwd ? "Đang xử lý…" : "Đổi mật khẩu"}</button>
            </form>
          </div>
        </div>

        <div className="card">
          <h3 className="panel-title">🎓 Ưu đãi học sinh - sinh viên</h3>
          {user.isHssv ? (
            <div className="alert alert-success">
              Tài khoản đã xác thực HSSV ({user.hssvInfo?.school}). Bạn được giảm 5% (tối đa 500.000đ) mỗi đơn hàng.
            </div>
          ) : (
            <form onSubmit={verifyHssv}>
              <p className="muted" style={{ fontSize: 13 }}>Xác thực để được giảm 5% (tối đa 500.000đ) cho mỗi đơn hàng.</p>
              <div className="form-group">
                <label>Trường đang học</label>
                <input className="form-control" value={hssv.school} onChange={(e) => setHssv((h) => ({ ...h, school: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Mã số học sinh/sinh viên</label>
                <input className="form-control" value={hssv.studentId} onChange={(e) => setHssv((h) => ({ ...h, studentId: e.target.value }))} required />
              </div>
              {errors.hssv && <div className="alert alert-error">{errors.hssv}</div>}
              <button className="btn btn-primary btn-block" disabled={loading.hssv}>{loading.hssv ? "Đang xác thực…" : "Xác thực ngay"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
