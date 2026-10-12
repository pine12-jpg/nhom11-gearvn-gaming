export function formatVND(n) {
  if (n === null || n === undefined) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN");
}

export const ORDER_STATUS_LABEL = {
  processing: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const PAYMENT_STATUS_LABEL = {
  paid: "Đã thanh toán",
  unpaid: "Chưa thanh toán",
  pending: "Chờ xác nhận",
};

export const PAYMENT_METHOD_LABEL = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank: "Chuyển khoản ngân hàng",
  momo: "Ví MoMo",
  zalopay: "Ví ZaloPay",
  installment: "Trả góp 0%",
};
