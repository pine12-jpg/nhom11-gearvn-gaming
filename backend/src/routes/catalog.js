/**
 * Epic "Trang chủ" + "Sản phẩm" + "Đánh giá"
 * US06, US07, US08, US09, US10, US11, US20
 */
const express = require("express");
const { collection, saveCollection, nextId } = require("../db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

// Bỏ dấu tiếng Việt để tìm kiếm "ban phim" vẫn ra "Bàn phím"
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

function ratingOf(productId, reviews) {
  const rs = reviews.filter((r) => r.productId === productId);
  if (!rs.length) return { avgRating: 0, reviewCount: 0 };
  const avg = rs.reduce((s, r) => s + r.rating, 0) / rs.length;
  return { avgRating: Math.round(avg * 10) / 10, reviewCount: rs.length };
}

function decorate(p, brands, categories, reviews) {
  const brand = brands.find((b) => b.id === p.brand);
  const category = categories.find((c) => c.id === p.category);
  return {
    ...p,
    brandName: brand ? brand.name : "",
    categoryName: category ? category.name : "",
    categorySlug: category ? category.slug : "",
    categoryIcon: category ? category.icon : "🎮",
    finalPrice: p.salePrice || p.price,
    discountPercent: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0,
    ...ratingOf(p.id, reviews),
  };
}

router.get("/categories", (req, res) => {
  const products = collection("products");
  const cats = collection("categories").map((c) => ({ ...c, productCount: products.filter((p) => p.category === c.id).length }));
  res.json(cats);
});

router.get("/brands", (req, res) => {
  const products = collection("products");
  res.json(collection("brands").map((b) => ({ ...b, productCount: products.filter((p) => p.brand === b.id).length })));
});

// US06 — Dữ liệu trang chủ: nổi bật, khuyến mãi, hãng, danh mục
router.get("/home", (req, res) => {
  const brands = collection("brands");
  const categories = collection("categories");
  const reviews = collection("reviews");
  const products = collection("products").map((p) => decorate(p, brands, categories, reviews));
  res.json({
    featured: products.filter((p) => p.featured).slice(0, 8),
    onSale: products.filter((p) => p.salePrice).sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 8),
    newest: [...products].sort((a, b) => b.id - a.id).slice(0, 4),
    brands: brands.map((b) => ({ ...b, productCount: products.filter((p) => p.brand === b.id).length })).filter((b) => b.productCount > 0),
    categories: categories.map((c) => ({ ...c, productCount: products.filter((p) => p.category === c.id).length })),
    news: collection("news").slice(0, 3),
  });
});

// US09 — Gợi ý từ khóa khi gõ (autocomplete)
router.get("/products/suggest", (req, res) => {
  const q = normalize(req.query.q);
  if (q.length < 1) return res.json([]);
  const brands = collection("brands");
  const categories = collection("categories");
  const reviews = collection("reviews");
  const result = collection("products")
    .filter((p) => normalize(p.name).includes(q) || normalize(brands.find((b) => b.id === p.brand)?.name).includes(q))
    .slice(0, 6)
    .map((p) => decorate(p, brands, categories, reviews))
    .map((p) => ({ id: p.id, name: p.name, finalPrice: p.finalPrice, categorySlug: p.categorySlug, brandName: p.brandName }));
  res.json(result);
});

// US11 — So sánh 2-3 sản phẩm
router.get("/products/compare", (req, res) => {
  const ids = (req.query.ids || "").split(",").map(Number).filter(Boolean).slice(0, 3);
  if (ids.length < 2) return res.status(400).json({ message: "Hãy chọn ít nhất 2 sản phẩm để so sánh." });
  const brands = collection("brands");
  const categories = collection("categories");
  const reviews = collection("reviews");
  const items = collection("products")
    .filter((p) => ids.includes(p.id))
    .map((p) => decorate(p, brands, categories, reviews));
  res.json(items);
});

/**
 * US07 + US10 — Danh sách sản phẩm có phân trang, tìm kiếm, lọc theo hãng / ngành hàng /
 * khoảng giá / cấu hình (CPU, GPU), sắp xếp.
 */
router.get("/products", (req, res) => {
  const { q, brand, category, minPrice, maxPrice, cpu, gpu, sort, sale, featured } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 60);

  const brands = collection("brands");
  const categories = collection("categories");
  const reviews = collection("reviews");

  let list = collection("products").map((p) => decorate(p, brands, categories, reviews));

  if (q) {
    const nq = normalize(q);
    list = list.filter((p) => normalize(p.name).includes(nq) || normalize(p.brandName).includes(nq) || normalize(p.description).includes(nq));
  }
  if (brand) {
    const ids = brand.split(",").map(Number);
    list = list.filter((p) => ids.includes(p.brand));
  }
  if (category) {
    // cho phép truyền id hoặc slug
    const cat = categories.find((c) => String(c.id) === category || c.slug === category);
    if (cat) list = list.filter((p) => p.category === cat.id);
  }
  if (minPrice) list = list.filter((p) => p.finalPrice >= Number(minPrice));
  if (maxPrice) list = list.filter((p) => p.finalPrice <= Number(maxPrice));
  if (cpu) list = list.filter((p) => normalize(p.cpu).includes(normalize(cpu)));
  if (gpu) list = list.filter((p) => normalize(p.gpu).includes(normalize(gpu)));
  if (sale === "1") list = list.filter((p) => p.salePrice);
  if (featured === "1") list = list.filter((p) => p.featured);

  switch (sort) {
    case "price-asc": list.sort((a, b) => a.finalPrice - b.finalPrice); break;
    case "price-desc": list.sort((a, b) => b.finalPrice - a.finalPrice); break;
    case "name": list.sort((a, b) => a.name.localeCompare(b.name, "vi")); break;
    case "discount": list.sort((a, b) => b.discountPercent - a.discountPercent); break;
    default: list.sort((a, b) => b.id - a.id);
  }

  const total = list.length;
  res.json({
    items: list.slice((page - 1) * limit, page * limit),
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
});

// US08 — Chi tiết sản phẩm (kèm đánh giá + sản phẩm liên quan)
router.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const brands = collection("brands");
  const categories = collection("categories");
  const reviews = collection("reviews");
  const users = collection("users");
  const product = collection("products").find((p) => p.id === id);
  if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

  const detail = decorate(product, brands, categories, reviews);
  const productReviews = reviews
    .filter((r) => r.productId === id)
    .map((r) => ({ ...r, userName: users.find((u) => u.id === r.userId)?.name || "Khách hàng" }))
    .sort((a, b) => b.id - a.id);
  const related = collection("products")
    .filter((p) => p.category === product.category && p.id !== id)
    .slice(0, 4)
    .map((p) => decorate(p, brands, categories, reviews));
  res.json({ ...detail, reviews: productReviews, related });
});

// US20 — Đánh giá & bình luận (chỉ khách đã mua sản phẩm và đơn chưa bị hủy)
router.post("/products/:id/reviews", authRequired, (req, res) => {
  const productId = Number(req.params.id);
  const { rating, comment } = req.body || {};
  if (!collection("products").some((p) => p.id === productId)) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
  const r = Number(rating);
  if (!(r >= 1 && r <= 5)) return res.status(400).json({ message: "Số sao phải từ 1 đến 5." });
  if (!comment || comment.trim().length < 5) return res.status(400).json({ message: "Bình luận cần ít nhất 5 ký tự." });

  const orders = collection("orders").filter((o) => o.userId === req.user.id && o.status !== "cancelled");
  const orderIds = orders.map((o) => o.id);
  const purchased = collection("order_items").some((i) => orderIds.includes(i.orderId) && i.productId === productId);
  if (!purchased) return res.status(403).json({ message: "Bạn cần mua sản phẩm này trước khi đánh giá." });

  const reviews = collection("reviews");
  if (reviews.some((x) => x.productId === productId && x.userId === req.user.id))
    return res.status(409).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });

  const review = { id: nextId("reviews"), productId, userId: req.user.id, rating: r, comment: comment.trim(), createdAt: new Date().toISOString() };
  reviews.push(review);
  saveCollection("reviews", reviews);
  res.status(201).json({ ...review, userName: req.user.name });
});

module.exports = router;
module.exports.decorate = decorate;
