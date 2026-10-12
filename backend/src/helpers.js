/**
 * helpers.js — các hàm dùng chung: ghi audit log (US37), gửi email giả lập (US17),
 * làm sạch dữ liệu user trước khi trả về client.
 */
const { collection, saveCollection, nextId } = require("./db");

/** US37 — Ghi lại thao tác quan trọng của admin để truy vết sự cố */
function auditLog(adminUser, action, target, detail = "") {
  const logs = collection("audit_logs");
  logs.unshift({
    id: nextId("audit_logs"),
    adminId: adminUser.id,
    adminName: adminUser.name,
    action,
    target,
    detail,
    createdAt: new Date().toISOString(),
  });
  saveCollection("audit_logs", logs.slice(0, 500));
}

/**
 * US17 — Gửi email/thông báo xác nhận đơn hàng.
 * Trong đồ án không cấu hình SMTP thật: email được in ra console và lưu vào
 * collection "mail_outbox" (xem trong data/db.json) để demo.
 * Muốn gửi mail thật: thay nội dung hàm này bằng nodemailer + SMTP (Gmail, SendGrid...).
 */
function sendMail(to, subject, body) {
  const outbox = collection("mail_outbox");
  outbox.unshift({ id: nextId("mail_outbox"), to, subject, body, sentAt: new Date().toISOString() });
  saveCollection("mail_outbox", outbox.slice(0, 200));
  console.log(`\n[MAIL] -> ${to}\n  Tiêu đề: ${subject}\n  ${body.replace(/\n/g, "\n  ")}\n`);
}

/**
 * Khóa tài khoản có thời hạn:
 *  - lockedUntil = null  => khóa vĩnh viễn (cho đến khi admin mở khóa)
 *  - lockedUntil = ngày  => tự động hết khóa khi qua ngày đó
 * Trả về null nếu tài khoản KHÔNG bị khóa (hoặc đã hết hạn khóa).
 */
function activeLock(u) {
  if (!u || !u.locked) return null;
  if (u.lockedUntil && new Date(u.lockedUntil).getTime() <= Date.now()) return null;
  return { until: u.lockedUntil || null, reason: u.lockReason || "" };
}

/** Nội dung trả về cho khách khi tài khoản bị khóa (frontend dùng để hiện bảng thông báo) */
function lockPayload(u) {
  const l = activeLock(u);
  return {
    code: "ACCOUNT_LOCKED",
    message: l && l.until ? "Tài khoản của bạn đang bị khóa tạm thời." : "Tài khoản của bạn đã bị khóa.",
    lockedUntil: l ? l.until : null,
    permanent: !!l && !l.until,
    lockReason: l ? l.reason : "",
  };
}

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, resetToken, resetExpires, ...rest } = u;
  rest.locked = !!activeLock(u); // trạng thái khóa thực tế (đã tính hạn khóa)
  return rest;
}

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

module.exports = { auditLog, sendMail, publicUser, formatVND, activeLock, lockPayload };
