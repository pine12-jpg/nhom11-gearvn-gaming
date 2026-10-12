const jwt = require("jsonwebtoken");
const { collection } = require("../db");
const { activeLock, lockPayload } = require("../helpers");

const JWT_SECRET = process.env.JWT_SECRET || "gvn-gaming-dev-secret-change-me";

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/** Bắt buộc phải đăng nhập (customer hoặc admin đều được) */
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện thao tác này." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
  }
  // Kiểm tra khóa tài khoản ở MỌI request => khách đang đăng nhập sẵn cũng bị chặn ngay khi admin khóa
  const u = collection("users").find((x) => x.id === req.user.id);
  if (u && activeLock(u)) return res.status(403).json(lockPayload(u));
  next();
}

/** Cho phép request đi qua dù có hoặc không có token, gắn req.user nếu có */
function authOptional(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      req.user = null;
    }
  }
  next();
}

/** Bắt buộc phải là admin — dùng sau authRequired */
function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ quản trị viên mới có quyền thực hiện thao tác này." });
  }
  next();
}

module.exports = { signToken, authRequired, authOptional, adminRequired, JWT_SECRET };
