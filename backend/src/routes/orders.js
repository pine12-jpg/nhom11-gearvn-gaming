/**
 * Epic "Đặt hàng & Thanh toán" + "Đơn hàng" + "Khuyến mãi"
 * US14, US15, US16, US17, US18, US19, US21, US22
 */
const express = require("express");
const { collection, saveCollection, nextId } = require("../db");
const { authRequired } = require("../middleware/auth");
const { sendMail, formatVND } = require("../helpers");

const router = express.Router();

const SHIPPING_METHODS = {
  standard: { label: "Giao hàng tiêu chuẩn (2-4 ngày)", fee: 30000 },
  express: { label: "Giao hàng nhanh (trong 24h nội thành)", fee: 60000 },
  pickup: { label: "Nhận tại showroom", fee: 0 },
};
const FREE_SHIP_FROM = 3000000; // miễn phí giao tiêu chuẩn từ 3 triệu
const PAYMENT_METHODS = ["cod", "bank", "momo", "zalopay", "installment"];
const INSTALLMENT_MIN = 3000000;
const INSTALLMENT_MONTHS = [3, 6, 12];

/** US21 — tính giảm giá theo voucher */
function applyVoucher(code, subtotal) {
  if (!code) return { discount: 0 };
  const v = collection("vouchers").find((x) => x.code.toLowerCase() === code.trim().toLowerCase() && x.active);
  if (!v) return { error: "Mã giảm giá không tồn tại hoặc đã hết hạn." };
  if (subtotal < v.minOrder) return { error: `Đơn hàng tối thiểu ${formatVND(v.minOrder)} để dùng mã này.` };
  let discount = v.type === "percent" ? Math.floor((subtotal * v.value) / 100) : v.value;
  discount = Math.min(discount, v.maxDiscount || discount, subtotal);
  return { discount, voucher: v };
}

/** Tính toàn bộ giá trị đơn hàng — dùng cho cả "xem trước" lẫn "đặt hàng thật" */
function priceOrder(userId, payload) {
  const { items, shippingMethod = "standard", voucherCode, tradeInId } = payload;
  if (!Array.isArray(items) || !items.length) return { error: "Giỏ hàng đang trống." };

  const products = collection("products");
  const categories = collection("categories");
  const brands = collection("brands");
  const lines = [];
  for (const it of items) {
    const p = products.find((x) => x.id === Number(it.productId));
    const qty = Math.floor(Number(it.quantity));
    if (!p) return { error: "Có sản phẩm không còn tồn tại trong hệ thống." };
    if (!(qty >= 1)) return { error: "Số lượng sản phẩm không hợp lệ." };
    if (qty > p.stock) return { error: `Sản phẩm "${p.name}" chỉ còn ${p.stock} sản phẩm trong kho.` };
    lines.push({
      productId: p.id,
      name: p.name,
      quantity: qty,
      price: p.salePrice || p.price,
      // lưu kèm để các trang lịch sử đơn hàng vẫn vẽ được hình minh họa đúng loại sản phẩm
      categorySlug: categories.find((c) => c.id === p.category)?.slug || "",
      brandName: brands.find((b) => b.id === p.brand)?.name || "",
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  const ship = SHIPPING_METHODS[shippingMethod];
  if (!ship) return { error: "Phương thức vận chuyển không hợp lệ." };
  let shippingFee = ship.fee;
  if (shippingMethod === "standard" && subtotal >= FREE_SHIP_FROM) shippingFee = 0;

  const vr = applyVoucher(voucherCode, subtotal);
  if (vr.error) return { error: vr.error };

  // US22 — ưu đãi HSSV: 5%, tối đa 500.000đ
  const user = collection("users").find((u) => u.id === userId);
  const hssvDiscount = user && user.isHssv ? Math.min(Math.floor(subtotal * 0.05), 500000) : 0;

  // US23/24 — trừ tiền thu cũ đổi mới đã được admin duyệt
  let tradeInDiscount = 0;
  let tradeIn = null;
  if (tradeInId) {
    tradeIn = collection("tradein_requests").find((t) => t.id === Number(tradeInId) && t.userId === userId);
    if (!tradeIn || tradeIn.status !== "approved" || tradeIn.used)
      return { error: "Yêu cầu thu cũ đổi mới không hợp lệ hoặc chưa được duyệt." };
    tradeInDiscount = tradeIn.offeredPrice;
  }

  const beforeShip = Math.max(subtotal - vr.discount - hssvDiscount - tradeInDiscount, 0);
  // Không để phần giảm vượt quá tiền hàng
  const totalDiscount = subtotal - beforeShip;
  const total = beforeShip + shippingFee;

  return {
    lines, subtotal, shippingFee, shippingLabel: ship.label,
    voucherDiscount: vr.discount, voucherCode: vr.voucher ? vr.voucher.code : null,
    hssvDiscount, tradeInDiscount, totalDiscount, total, tradeIn,
  };
}

// Xem trước giá (giỏ hàng / trang thanh toán gọi để hiển thị tạm tính, phí ship, giảm giá)
router.post("/orders/preview", authRequired, (req, res) => {
  const r = priceOrder(req.user.id, req.body || {});
  if (r.error) return res.status(400).json({ message: r.error });
  const { tradeIn, ...rest } = r;
  res.json(rest);
});

router.get("/shipping-methods", (req, res) => {
  res.json({
    freeShipFrom: FREE_SHIP_FROM,
    methods: Object.entries(SHIPPING_METHODS).map(([key, v]) => ({ key, ...v })),
    installment: { minTotal: INSTALLMENT_MIN, months: INSTALLMENT_MONTHS },
  });
});

router.post("/vouchers/validate", authRequired, (req, res) => {
  const { code, subtotal } = req.body || {};
  const r = applyVoucher(code, Number(subtotal) || 0);
  if (r.error) return res.status(400).json({ message: r.error });
  res.json({ code: r.voucher.code, discount: r.discount });
});

// US14 + US15 + US16 + US17 — Đặt hàng
router.post("/orders", authRequired, (req, res) => {
  const { shipping, paymentMethod, installmentMonths } = req.body || {};
  if (!shipping || !shipping.name?.trim() || !shipping.phone?.trim() || !shipping.address?.trim())
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng." });
  if (!/^(0|\+84)\d{9}$/.test(shipping.phone.trim())) return res.status(400).json({ message: "Số điện thoại nhận hàng không hợp lệ." });
  if (!PAYMENT_METHODS.includes(paymentMethod)) return res.status(400).json({ message: "Vui lòng chọn phương thức thanh toán." });

  const r = priceOrder(req.user.id, req.body);
  if (r.error) return res.status(400).json({ message: r.error });

  let installment = null;
  if (paymentMethod === "installment") {
    if (r.total < INSTALLMENT_MIN)
      return res.status(400).json({ message: `Trả góp 0% áp dụng cho đơn từ ${formatVND(INSTALLMENT_MIN)}.` });
    if (!INSTALLMENT_MONTHS.includes(Number(installmentMonths)))
      return res.status(400).json({ message: "Vui lòng chọn kỳ hạn trả góp 3, 6 hoặc 12 tháng." });
    installment = { months: Number(installmentMonths), monthlyAmount: Math.ceil(r.total / Number(installmentMonths)), interest: 0 };
  }

  // Trừ kho (US34)
  const products = collection("products");
  r.lines.forEach((l) => {
    const p = products.find((x) => x.id === l.productId);
    p.stock -= l.quantity;
  });
  saveCollection("products", products);

  // Đánh dấu thu cũ đã dùng
  if (r.tradeIn) {
    const tis = collection("tradein_requests");
    tis.find((t) => t.id === r.tradeIn.id).used = true;
    saveCollection("tradein_requests", tis);
  }

  // Thanh toán: ví điện tử mô phỏng thành công ngay; COD thu tiền khi giao; chuyển khoản/trả góp chờ xác nhận
  const paymentStatus = paymentMethod === "momo" || paymentMethod === "zalopay" ? "paid" : paymentMethod === "cod" ? "unpaid" : "pending";

  const orderId = nextId("orders");
  const orders = collection("orders");
  const order = {
    id: orderId,
    code: "GVN" + String(orderId).padStart(6, "0"),
    userId: req.user.id,
    status: "processing",
    shipping: { name: shipping.name.trim(), phone: shipping.phone.trim(), address: shipping.address.trim(), note: shipping.note || "" },
    shippingMethod: req.body.shippingMethod || "standard",
    shippingLabel: r.shippingLabel,
    paymentMethod,
    paymentStatus,
    installment,
    subtotal: r.subtotal,
    shippingFee: r.shippingFee,
    voucherCode: r.voucherCode,
    voucherDiscount: r.voucherDiscount,
    hssvDiscount: r.hssvDiscount,
    tradeInDiscount: r.tradeInDiscount,
    total: r.total,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  saveCollection("orders", orders);

  const orderItems = collection("order_items");
  r.lines.forEach((l) => orderItems.push({ id: nextId("order_items"), orderId, ...l }));
  saveCollection("order_items", orderItems);

  // US17 — gửi mail xác nhận
  const user = collection("users").find((u) => u.id === req.user.id);
  const mailTo = user.email || shipping.phone;
  sendMail(
    mailTo,
    `[GVN Gaming] Xác nhận đơn hàng ${order.code}`,
    `Cảm ơn ${shipping.name} đã đặt hàng tại GVN Gaming!\n` +
      r.lines.map((l) => `- ${l.name} x${l.quantity}: ${formatVND(l.price * l.quantity)}`).join("\n") +
      `\nPhí vận chuyển: ${formatVND(r.shippingFee)}\nTổng thanh toán: ${formatVND(r.total)}\nPhương thức: ${paymentMethod.toUpperCase()}` +
      `\nGiao đến: ${shipping.address}`
  );

  res.status(201).json({ ...order, items: r.lines });
});

function withItems(order) {
  return { ...order, items: collection("order_items").filter((i) => i.orderId === order.id) };
}

// US18 — Lịch sử đơn hàng
router.get("/orders/mine", authRequired, (req, res) => {
  const list = collection("orders")
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => b.id - a.id)
    .map(withItems);
  res.json(list);
});

router.get("/orders/:id", authRequired, (req, res) => {
  const order = collection("orders").find((o) => o.id === Number(req.params.id));
  if (!order || (order.userId !== req.user.id && req.user.role !== "admin"))
    return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
  res.json(withItems(order));
});

// US19 — Hủy đơn hàng khi chưa giao đi (và hoàn lại kho)
router.post("/orders/:id/cancel", authRequired, (req, res) => {
  const orders = collection("orders");
  const order = orders.find((o) => o.id === Number(req.params.id) && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
  if (order.status !== "processing")
    return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang ở trạng thái 'Đang xử lý' (chưa giao đi)." });

  order.status = "cancelled";
  order.cancelledAt = new Date().toISOString();
  saveCollection("orders", orders);

  const products = collection("products");
  collection("order_items")
    .filter((i) => i.orderId === order.id)
    .forEach((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (p) p.stock += i.quantity;
    });
  saveCollection("products", products);

  // hoàn lại lượt thu cũ nếu có (khách có thể dùng lại)
  if (order.tradeInDiscount) {
    const tis = collection("tradein_requests");
    const t = tis.find((x) => x.userId === order.userId && x.used && x.offeredPrice === order.tradeInDiscount);
    if (t) t.used = false;
    saveCollection("tradein_requests", tis);
  }
  res.json(withItems(order));
});

module.exports = router;
