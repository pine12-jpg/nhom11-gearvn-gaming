import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatVND } from "../utils/format";
import ProductImage from "../components/ProductImage";

/** US12 + US13 — Giỏ hàng: thêm/sửa số lượng/xóa, tạm tính cập nhật realtime */
export default function Cart() {
  const { items, updateQuantity, removeItem, subtotalLocal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="ico">🛒</div>
          <p>Giỏ hàng của bạn đang trống.</p>
          <Link to="/san-pham" className="btn btn-primary mt-16">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>Giỏ hàng ({items.length} sản phẩm)</h1>
      <div className="cart-layout mt-16">
        <div className="card">
          {items.map((i) => (
            <div className="cart-item" key={i.productId}>
              <div className="thumb">{i.snapshot && <ProductImage product={i.snapshot} />}</div>
              <div style={{ flex: 1 }}>
                <Link to={`/san-pham/${i.productId}`} className="name">{i.snapshot?.name}</Link>
                <div className="unit-price">{formatVND(i.snapshot?.finalPrice)} / sản phẩm</div>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQuantity(i.productId, i.quantity - 1)}>−</button>
                <input value={i.quantity} readOnly />
                <button onClick={() => updateQuantity(i.productId, i.quantity + 1)}>+</button>
              </div>
              <div style={{ width: 110, textAlign: "right", fontWeight: 700, color: "var(--red-600)" }}>
                {formatVND((i.snapshot?.finalPrice || 0) * i.quantity)}
              </div>
              <button className="btn-link" onClick={() => removeItem(i.productId)}>Xóa</button>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15 }}>Tạm tính</h3>
          <div className="summary-row">
            <span>Tạm tính</span>
            <strong>{formatVND(subtotalLocal)}</strong>
          </div>
          <p className="form-hint">Phí vận chuyển, mã giảm giá và ưu đãi HSSV sẽ được tính chính xác ở bước thanh toán.</p>
          <button className="btn btn-primary btn-block mt-16" onClick={() => navigate("/thanh-toan")}>
            Tiến hành thanh toán
          </button>
          <Link to="/san-pham" className="btn btn-ghost btn-block mt-8">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div>
  );
}
