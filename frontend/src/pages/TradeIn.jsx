import { useEffect, useState } from "react";
import api, { errMsg } from "../api/client";
import { useToast } from "../context/ToastContext";
import { formatDateTime, formatVND } from "../utils/format";

const CONDITIONS = [
  { value: "excellent", label: "Rất tốt (như mới, đầy đủ phụ kiện)" },
  { value: "good", label: "Tốt (còn hoạt động ổn định, ít trầy xước)" },
  { value: "fair", label: "Khá (còn dùng được, có dấu hiệu cũ)" },
  { value: "poor", label: "Kém (hư hỏng nhẹ / thiếu phụ kiện)" },
];
const STATUS_LABEL = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };

/** US23 — Khách gửi yêu cầu thu cũ - đổi mới */
export default function TradeIn() {
  const [form, setForm] = useState({ deviceType: "Laptop gaming", model: "", condition: "good", description: "" });
  const [mine, setMine] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  function load() {
    api.get("/tradein/mine").then(({ data }) => setMine(data));
  }
  useEffect(load, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/tradein", form);
      toast.success("Đã gửi yêu cầu! Đội ngũ GVN Gaming sẽ liên hệ báo giá trong 24h.");
      setForm({ deviceType: "Laptop gaming", model: "", condition: "good", description: "" });
      load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>♻️ Thu cũ - Đổi mới</h1>
      <p className="muted">Gửi thông tin laptop gaming / linh kiện cũ của bạn để được định giá và trừ trực tiếp vào giá mua sản phẩm mới.</p>

      <div className="cart-layout mt-16">
        <div className="card">
          <h3 className="panel-title">Gửi yêu cầu định giá</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Loại thiết bị</label>
              <select className="form-control" value={form.deviceType} onChange={(e) => setForm((f) => ({ ...f, deviceType: e.target.value }))}>
                <option>Laptop gaming</option>
                <option>PC / Linh kiện PC</option>
                <option>Màn hình</option>
                <option>Bàn phím / Chuột / Tai nghe</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tên / mã model</label>
              <input className="form-control" placeholder="VD: ASUS ROG Strix G15 2021" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Tình trạng máy</label>
              <select className="form-control" value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Mô tả thêm (tùy chọn)</label>
              <textarea className="form-control" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Cấu hình, lỗi (nếu có), phụ kiện đi kèm…" />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Đang gửi…" : "Gửi yêu cầu"}</button>
          </form>
        </div>

        <div className="card">
          <h3 className="panel-title">Yêu cầu của tôi</h3>
          {mine.length === 0 && <p className="muted">Bạn chưa gửi yêu cầu nào.</p>}
          {mine.map((t) => (
            <div key={t.id} className="cart-item" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div className="name">{t.model}</div>
                <div className="unit-price">{t.deviceType} • Gửi lúc {formatDateTime(t.createdAt)}</div>
                {t.status === "approved" && <div className="muted" style={{ fontSize: 12.5 }}>Giá thu: <strong>{formatVND(t.offeredPrice)}</strong> {t.used && "(đã sử dụng)"}</div>}
                {t.adminNote && <div className="muted" style={{ fontSize: 12.5 }}>Ghi chú: {t.adminNote}</div>}
              </div>
              <span className={`badge badge-${t.status}`}>{STATUS_LABEL[t.status]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
