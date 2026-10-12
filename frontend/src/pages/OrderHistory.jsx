import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { formatVND, formatDateTime, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from "../utils/format";
import ProductImage from "../components/ProductImage";

/** US18 — Xem lịch sử đơn hàng kèm trạng thái */
export default function OrderHistory() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders/mine").then(({ data }) => setOrders(data));
  }, []);

  if (!orders) return <div className="page container center muted">Đang tải đơn hàng…</div>;

  if (orders.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="ico">📦</div>
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/san-pham" className="btn btn-primary mt-16">Mua sắm ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>Đơn hàng của tôi</h1>
      <div className="card mt-16">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.code}</strong></td>
                  <td>{formatDateTime(o.createdAt)}</td>
                  <td className="flex items-center gap-8">
                    <span className="mini-thumb">{o.items[0] && <ProductImage product={o.items[0]} />}</span>
                    {o.items.length} sản phẩm
                  </td>
                  <td>{PAYMENT_METHOD_LABEL[o.paymentMethod]}</td>
                  <td>{formatVND(o.total)}</td>
                  <td><span className={`badge badge-${o.status}`}>{ORDER_STATUS_LABEL[o.status]}</span></td>
                  <td><Link className="btn-link" to={`/don-hang/${o.id}`}>Chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
