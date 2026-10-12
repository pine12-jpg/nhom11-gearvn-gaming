/**
 * Epic "Tài khoản" — US01, US02, US03, US04, US05, US22 (xác thực HSSV), US30 (đăng nhập admin)
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const { collection, saveCollection, nextId } = require("../db");
const { signToken, authRequired } = require("../middleware/auth");
const { publicUser, sendMail, activeLock, lockPayload } = require("../helpers");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(0|\+84)\d{9}$/;

// US01 — Đăng ký bằng email hoặc số điện thoại
router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ message: "Vui lòng nhập họ tên." });
  if (!email && !phone) return res.status(400).json({ message: "Vui lòng nhập email hoặc số điện thoại." });
  if (email && !EMAIL_RE.test(email)) return res.status(400).json({ message: "Email không hợp lệ." });
  if (phone && !PHONE_RE.test(phone)) return res.status(400).json({ message: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)." });
  if (!password || password.length < 6) return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });

  const users = collection("users");
  if (email && users.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ message: "Email này đã được đăng ký." });
  if (phone && users.some((u) => u.phone === phone))
    return res.status(409).json({ message: "Số điện thoại này đã được đăng ký." });

  const user = {
    id: nextId("users"),
    name: name.trim(),
    email: email ? email.toLowerCase() : "",
    phone: phone || "",
    passwordHash: bcrypt.hashSync(password, 8),
    role: "customer",
    address: "",
    isHssv: false,
    locked: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveCollection("users", users);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// US02 — Đăng nhập bằng email hoặc số điện thoại
router.post("/login", (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu." });
  const id = identifier.trim().toLowerCase();
  const user = collection("users").find((u) => (u.email && u.email.toLowerCase() === id) || u.phone === identifier.trim());
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng." });
  if (activeLock(user)) return res.status(403).json(lockPayload(user));
  res.json({ token: signToken(user), user: publicUser(user) });
});

// US30 — Đăng nhập trang quản trị riêng (chỉ cho phép role admin)
router.post("/admin-login", (req, res) => {
  const { identifier, password } = req.body || {};
  const id = (identifier || "").trim().toLowerCase();
  const user = collection("users").find((u) => u.email && u.email.toLowerCase() === id);
  if (!user || user.role !== "admin" || !bcrypt.compareSync(password || "", user.passwordHash))
    return res.status(401).json({ message: "Thông tin đăng nhập quản trị không đúng." });
  res.json({ token: signToken(user), user: publicUser(user) });
});

/**
 * US03 — Đăng nhập nhanh bằng Google.
 * LƯU Ý: Để đăng nhập Google thật cần tạo OAuth Client ID trên Google Cloud Console,
 * dùng thư viện @react-oauth/google ở frontend rồi gửi id_token về đây để verify
 * (google-auth-library). Bản đồ án này mô phỏng luồng đó: frontend gửi email + tên
 * "giả lập" đã chọn, backend tạo/liên kết tài khoản và trả JWT.
 */
router.post("/google", (req, res) => {
  const { email, name } = req.body || {};
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ message: "Email Google không hợp lệ." });
  const users = collection("users");
  let user = users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: nextId("users"),
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      phone: "",
      passwordHash: bcrypt.hashSync(nanoid(16), 8), // không dùng mật khẩu
      role: "customer",
      address: "",
      isHssv: false,
      locked: false,
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveCollection("users", users);
  }
  if (activeLock(user)) return res.status(403).json(lockPayload(user));
  res.json({ token: signToken(user), user: publicUser(user) });
});

// US04 — Quên mật khẩu (tạo token đặt lại, gửi qua email giả lập)
router.post("/forgot-password", (req, res) => {
  const { email } = req.body || {};
  const users = collection("users");
  const user = users.find((u) => u.email && u.email.toLowerCase() === (email || "").toLowerCase());
  // Luôn trả về cùng 1 thông báo để không lộ email nào đã đăng ký
  const message = "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.";
  if (!user) return res.json({ message });
  user.resetToken = nanoid(24);
  user.resetExpires = Date.now() + 15 * 60 * 1000;
  saveCollection("users", users);
  sendMail(
    user.email,
    "[GVN Gaming] Đặt lại mật khẩu",
    `Xin chào ${user.name},\nMã đặt lại mật khẩu của bạn: ${user.resetToken}\nMã có hiệu lực trong 15 phút.`
  );
  // Chỉ để phục vụ demo (không có SMTP thật): trả token về để test nhanh
  res.json({ message, devResetToken: process.env.NODE_ENV === "production" ? undefined : user.resetToken });
});

router.post("/reset-password", (req, res) => {
  const { token, password } = req.body || {};
  if (!password || password.length < 6) return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  const users = collection("users");
  const user = users.find((u) => u.resetToken && u.resetToken === token && u.resetExpires > Date.now());
  if (!user) return res.status(400).json({ message: "Mã đặt lại không hợp lệ hoặc đã hết hạn." });
  user.passwordHash = bcrypt.hashSync(password, 8);
  delete user.resetToken;
  delete user.resetExpires;
  saveCollection("users", users);
  res.json({ message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay." });
});

// US05 — Xem / cập nhật thông tin cá nhân
router.get("/me", authRequired, (req, res) => {
  const user = collection("users").find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản." });
  res.json(publicUser(user));
});

router.put("/me", authRequired, (req, res) => {
  const { name, phone, address } = req.body || {};
  const users = collection("users");
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản." });
  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ message: "Họ tên không được để trống." });
    user.name = name.trim();
  }
  if (phone !== undefined && phone !== "") {
    if (!PHONE_RE.test(phone)) return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
    if (users.some((u) => u.id !== user.id && u.phone === phone))
      return res.status(409).json({ message: "Số điện thoại đã được dùng bởi tài khoản khác." });
    user.phone = phone;
  }
  if (address !== undefined) user.address = address;
  saveCollection("users", users);
  res.json(publicUser(user));
});

router.put("/password", authRequired, (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  const users = collection("users");
  const user = users.find((u) => u.id === req.user.id);
  if (!user || !bcrypt.compareSync(oldPassword || "", user.passwordHash))
    return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  saveCollection("users", users);
  res.json({ message: "Đổi mật khẩu thành công." });
});

// US22 — Xác thực học sinh - sinh viên (demo: kiểm tra định dạng mã thẻ, admin có thể kiểm tra thủ công)
router.post("/hssv", authRequired, (req, res) => {
  const { studentId, school } = req.body || {};
  if (!studentId || !/^[A-Za-z0-9]{6,15}$/.test(studentId) || !school || !school.trim())
    return res.status(400).json({ message: "Vui lòng nhập tên trường và mã số học sinh/sinh viên hợp lệ (6-15 ký tự chữ/số)." });
  const users = collection("users");
  const user = users.find((u) => u.id === req.user.id);
  user.isHssv = true;
  user.hssvInfo = { studentId, school: school.trim(), verifiedAt: new Date().toISOString() };
  saveCollection("users", users);
  res.json({ message: "Xác thực HSSV thành công! Bạn được giảm 5% (tối đa 500.000đ) cho mỗi đơn hàng.", user: publicUser(user) });
});

module.exports = router;
