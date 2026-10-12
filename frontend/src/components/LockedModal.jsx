import { formatDate } from "../utils/format";


const CONTACT_EMAIL = "cskh@gvngaming.vn";
const CONTACT_ZALO = "1900 5301";

/** Bảng thông báo hiện ra khi tài khoản khách bị admin khóa */
export default function LockedModal({ info, onClose }) {
  const daysLeft = info.lockedUntil ? Math.max(1, Math.ceil((new Date(info.lockedUntil).getTime() - Date.now()) / 86400000)) : null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, alignItems: "center" }}>
      <div className="modal-box" style={{ maxWidth: 460, textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>🔒</div>
        <h3 style={{ fontSize: 20, margin: "6px 0 10px" }}>Tài khoản của bạn đã bị khóa</h3>

        {info.permanent || !info.lockedUntil ? (
          <p>Tài khoản bị khóa <b>vĩnh viễn</b>.</p>
        ) : (
          <p>
            Tài khoản bị khóa <b>{daysLeft} ngày</b> nữa (đến hết ngày <b>{formatDate(info.lockedUntil)}</b>). Sau thời gian này bạn có thể đăng nhập lại bình thường.
          </p>
        )}

        {info.lockReason && (
          <p style={{ background: "#fff4f4", border: "1px solid #f3c2c2", borderRadius: 8, padding: "8px 12px", margin: "10px 0" }}>
            <b>Lý do:</b> {info.lockReason}
          </p>
        )}

        <p style={{ fontSize: 14, color: "#555", marginTop: 12 }}>
          Nếu bạn thấy việc khóa này chưa thỏa đáng, vui lòng liên hệ qua:
          <br />
          📧 Email: <b>{CONTACT_EMAIL}</b>
          <br />
          💬 Zalo: <b>{CONTACT_ZALO}</b>
        </p>

        <button className="btn btn-primary btn-block mt-16" onClick={onClose}>Đã hiểu</button>
      </div>
    </div>
  );
}
