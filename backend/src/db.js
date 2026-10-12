/**
 * db.js — lớp truy xuất dữ liệu.
 *
 * Cách hoạt động:
 *  - Toàn bộ dữ liệu nằm trong bộ nhớ (RAM) nên các route vẫn gọi đồng bộ như cũ
 *    (collection / saveCollection / nextId ...), KHÔNG cần sửa file routes.
 *  - Nếu có biến môi trường DATABASE_URL (PostgreSQL, vd Neon): mỗi khi dữ liệu thay đổi,
 *    nó được tự động sao lưu lên PostgreSQL => tài khoản, đơn hàng... KHÔNG mất khi web
 *    khởi động lại hoặc build lại. Khi khởi động, dữ liệu được nạp lại từ PostgreSQL.
 *  - Nếu KHÔNG có DATABASE_URL (chạy trên máy cá nhân): dùng file data/db.json như trước.
 */
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

let cache = null; // dữ liệu hiện tại trong RAM
let pool = null; // kết nối PostgreSQL (nếu có)
let saveTimer = null;
let saving = false;
let dirty = false;

function loadFromFile() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

/** Gọi 1 lần khi khởi động server (xem server.js) */
async function init() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = require("pg");
    const local = /localhost|127\.0\.0\.1/.test(url);
    pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false }, max: 3 });
    await pool.query(
      "CREATE TABLE IF NOT EXISTS app_data (id INT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT now())"
    );
    const r = await pool.query("SELECT data FROM app_data WHERE id = 1");
    if (r.rows.length) {
      cache = r.rows[0].data;
      console.log("✅ Đã nạp dữ liệu từ PostgreSQL.");
      return;
    }
    cache = loadFromFile(); // lần đầu: dùng dữ liệu mẫu rồi lưu lên PostgreSQL
    await saveToPg();
    console.log("✅ Đã tạo dữ liệu ban đầu trên PostgreSQL.");
    return;
  }
  console.warn("⚠️  Chưa có DATABASE_URL: dữ liệu chỉ lưu vào file db.json (trên Render sẽ mất khi build lại).");
  cache = loadFromFile();
}

async function saveToPg() {
  await pool.query(
    "INSERT INTO app_data (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()",
    [JSON.stringify(cache)]
  );
}

function schedulePersist(delay = 200) {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(flush, delay);
}

async function flush() {
  saveTimer = null;
  if (saving) return schedulePersist();
  saving = true;
  dirty = false;
  try {
    await saveToPg();
  } catch (e) {
    console.error("Lưu PostgreSQL lỗi:", e.message);
    dirty = true;
  }
  saving = false;
  if (dirty) schedulePersist(3000); // lỗi thì thử lại sau 3 giây
}

/** Lưu nốt dữ liệu còn chờ trước khi server tắt (Render gửi SIGTERM khi restart/deploy) */
async function shutdown() {
  if (!pool) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  try {
    if (dirty || saving) await saveToPg();
  } catch (e) {
    console.error("Lưu PostgreSQL lỗi khi tắt:", e.message);
  }
}
process.on("SIGTERM", () => shutdown().finally(() => process.exit(0)));

/** Trả về BẢN SAO của toàn bộ dữ liệu (như cách đọc file cũ) */
function readDB() {
  if (!cache) cache = loadFromFile();
  return structuredClone(cache);
}

function writeDB(data) {
  cache = structuredClone(data);
  if (pool) schedulePersist();
  else fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), "utf-8");
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

module.exports = { init, readDB, writeDB, collection, saveCollection, nextId, DB_PATH };
