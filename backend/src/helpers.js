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

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, resetToken, resetExpires, ...rest } = u;
  return rest;
}

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

module.exports = { auditLog, sendMail, publicUser, formatVND };
