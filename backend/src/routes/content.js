/**
 * Epic "Tin tức - Review", "Hệ thống cửa hàng", "Thu cũ - Đổi mới"
 * US23, US25, US28 (phần khách hàng; phần admin nằm trong admin.js)
 */
const express = require("express");
const { collection, saveCollection, nextId } = require("../db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

// US28 — Đọc tin tức / review
router.get("/news", (req, res) => {
  res.json([...collection("news")].sort((a, b) => b.id - a.id));
});

router.get("/news/:id", (req, res) => {
  const post = collection("news").find((n) => n.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết." });
  res.json(post);
});

// US25 — Tra cứu showroom gần nhất (lọc theo từ khóa: quận / thành phố)
router.get("/showrooms", (req, res) => {
  const q = normalize(req.query.q);
  let list = collection("showrooms");
  if (q) list = list.filter((s) => normalize(s.name + " " + s.address).includes(q));
  res.json(list);
});

// US23 — Khách gửi yêu cầu thu cũ - đổi mới
router.post("/tradein", authRequired, (req, res) => {
  const { deviceType, model, condition, description } = req.body || {};
  if (!deviceType || !model || !model.trim()) return res.status(400).json({ message: "Vui lòng nhập loại thiết bị và tên/mã model." });
  if (!["excellent", "good", "fair", "poor"].includes(condition))
    return res.status(400).json({ message: "Vui lòng chọn tình trạng máy." });
  const list = collection("tradein_requests");
  const item = {
    id: nextId("tradein_requests"),
    userId: req.user.id,
    userName: req.user.name,
    deviceType,
    model: model.trim(),
    condition,
    description: (description || "").trim(),
    status: "pending", // pending -> approved / rejected
    offeredPrice: 0,
    adminNote: "",
    used: false,
    createdAt: new Date().toISOString(),
  };
  list.push(item);
  saveCollection("tradein_requests", list);
  res.status(201).json(item);
});

router.get("/tradein/mine", authRequired, (req, res) => {
  res.json(collection("tradein_requests").filter((t) => t.userId === req.user.id).sort((a, b) => b.id - a.id));
});

module.exports = router;
