/**
 * db.js — lớp truy xuất dữ liệu đơn giản dựa trên file JSON.
 *
 * Đồ án dùng file JSON thay vì một hệ quản trị CSDL thật (MySQL/MongoDB...)
 * để sinh viên chạy được ngay bằng `npm install && npm run dev`,
 * không cần cài đặt/khởi động thêm server database nào.
 *
 * Muốn nâng cấp lên MySQL/MongoDB: chỉ cần viết lại các hàm bên dưới,
 * phần routes/ ở tầng trên không cần thay đổi vì chỉ gọi qua các hàm này.
 */
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/** Lấy toàn bộ 1 collection (vd: db("products")) */
function collection(name) {
  const data = readDB();
  return data[name] || [];
}

/** Lưu lại toàn bộ 1 collection */
function saveCollection(name, rows) {
  const data = readDB();
  data[name] = rows;
  writeDB(data);
}

/** Sinh id tự tăng cho 1 collection */
function nextId(name) {
  const data = readDB();
  data._counters = data._counters || {};
  data._counters[name] = (data._counters[name] || 0) + 1;
  writeDB(data);
  return data._counters[name];
}

module.exports = { readDB, writeDB, collection, saveCollection, nextId, DB_PATH };
