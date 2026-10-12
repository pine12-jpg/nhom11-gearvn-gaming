import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { useToast } from "../context/ToastContext";
import { formatVND, formatDateTime, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "../utils/format";
import ProductImage from "../components/ProductImage";
import PaymentQR from "../components/PaymentQR";

/** US18 (chi tiết đơn) + US19 — Hủy đơn hàng khi chưa giao đi */
export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const toast = useToast();

  function load() {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => setOrder(false));
  }
  useEffect(load, [id]);

  async function cancelOrder() {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      toast.success("Đã hủy đơn hàng.");
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setCancelling(false);
    }
  }

  if (order === null) return <div className="page container center muted">Đang tải…</div>;
  if (order === false) return <div className="page container center muted">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="page container">
      <div className="breadcrumb"><Link to="/don-hang">Đơn hàng của tôi</Link> / {order.code}</div>
      <div className="flex justify-between items-center">
        <h1 style={{ fontSize: 21 }}>Đơn hàng {order.code}</h1>
        <span className={`badge badge-${order.status}`}>{ORDER_STATUS_LABEL[order.status]}</span>
      </div>

      <div className="cart-layout mt-16">
        <div className="card">
          <h3 className="panel-title">Sản phẩm</h3>
          {order.items.map((i) => (
            <div className="summary-row" key={i.id}>
              <span className="flex items-center gap-8">
                <span className="mini-thumb"><ProductImage product={i} /></span>
                {i.name} x{i.quantity}
              </span>
              <span>{formatVND(i.price * i.quantity)}</span>
            </div>
          ))}

          <h3 className="panel-title mt-24">Giao hàng</h3>
          <p>{order.shipping.name} — {order.shipping.phone}</p>
          <p>{order.shipping.address}</p>
          {order.shipping.note && <p className="muted">Ghi chú: {order.shipping.note}</p>}
          <p className="muted">{order.shippingLabel} • Đặt lúc {formatDateTime(order.createdAt)}</p>
        </div>

        <div className="card">
          <h3 className="panel-title">Thanh toán</h3>
          <div className="summary-row"><span>Phương thức</span><span>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span></div>
          <div className="summary-row"><span>Trạng thái TT</span><span className={`badge badge-${order.paymentStatus}`}>{PAYMENT_STATUS_LABEL[order.paymentStatus]}</span></div>
          {order.installment && (
            <div className="installment-box">
              Trả góp {order.installment.months} tháng — ~{formatVND(order.installment.monthlyAmount)}/tháng (lãi suất 0%)
            </div>
          )}
          <div className="summary-row mt-16"><span>Tạm tính</span><span>{formatVND(order.subtotal)}</span></div>
          <div className="summary-row"><span>Phí vận chuyển</span><span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span></div>
          {order.voucherDiscount > 0 && <div className="summary-row"><span>Mã giảm giá</span><span className="neg">-{formatVND(order.voucherDiscount)}</span></div>}
          {order.hssvDiscount > 0 && <div className="summary-row"><span>Ưu đãi HSSV</span><span className="neg">-{formatVND(order.hssvDiscount)}</span></div>}
          {order.tradeInDiscount > 0 && <div className="summary-row"><span>Thu cũ - Đổi mới</span><span className="neg">-{formatVND(order.tradeInDiscount)}</span></div>}
          <div className="summary-row total"><span>Tổng cộng</span><span>{formatVND(order.total)}</span></div>

          {order.status === "processing" && (
            <button className="btn btn-danger btn-block mt-16" onClick={cancelOrder} disabled={cancelling}>
              {cancelling ? "Đang hủy…" : "Hủy đơn hàng"}
            </button>
          )}
        </div>
      </div>

      <PaymentQR order={order} />
    </div>
  );
}
