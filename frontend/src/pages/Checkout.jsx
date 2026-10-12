import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatVND } from "../utils/format";
import ProductImage from "../components/ProductImage";

/** US14 + US15 + US16 + US21 + US22 — Đặt hàng, chọn vận chuyển/thanh toán, voucher, trả góp, HSSV */
export default function Checkout() {
  const { items, subtotalLocal, clear } = useCart();
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [shipping, setShipping] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "", note: "" });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [installmentMonths, setInstallmentMonths] = useState(6);
  const [voucherCode, setVoucherCode] = useState("");
  const [shipInfo, setShipInfo] = useState(null);
  const [tradeInOptions, setTradeInOptions] = useState([]);
  const [tradeInId, setTradeInId] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate("/gio-hang");
  }, [items, navigate]);

  useEffect(() => {
    api.get("/shipping-methods").then(({ data }) => setShipInfo(data));
    api.get("/tradein/mine").then(({ data }) => setTradeInOptions(data.filter((t) => t.status === "approved" && !t.used)));
  }, []);

  const payload = useMemo(
    () => ({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shippingMethod,
      voucherCode: voucherCode || undefined,
      tradeInId: tradeInId || undefined,
    }),
    [items, shippingMethod, voucherCode, tradeInId]
  );

  useEffect(() => {
    if (items.length === 0) return;
    setError("");
    api
      .post("/orders/preview", payload)
      .then(({ data }) => setPreview(data))
      .catch((err) => {
        setPreview(null);
        setError(errMsg(err, "Không thể tính giá đơn hàng."));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(payload)]);

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    if (paymentMethod === "installment" && (!preview || preview.total < shipInfo.installment.minTotal)) {
      setError(`Trả góp 0% chỉ áp dụng cho đơn hàng từ ${formatVND(shipInfo.installment.minTotal)}.`);
      return;
    }
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", { ...payload, shipping, paymentMethod, installmentMonths });
      clear();
      await refreshMe().catch(() => {});
      toast.success(`Đặt hàng thành công! Mã đơn: ${data.code}`);
      navigate(`/don-hang/${data.id}`);
    } catch (err) {
      setError(errMsg(err, "Đặt hàng thất bại."));
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>Thanh toán</h1>
      <form onSubmit={placeOrder}>
        <div className="cart-layout mt-16">
          <div>
            <div className="card">
              <h3 className="panel-title">Thông tin giao hàng</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên người nhận</label>
                  <input className="form-control" required value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input className="form-control" required value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <input className="form-control" required value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Ghi chú (tùy chọn)</label>
                <textarea className="form-control" value={shipping.note} onChange={(e) => setShipping((s) => ({ ...s, note: e.target.value }))} />
              </div>

              {!user?.isHssv && (
                <div className="alert alert-info">
                  🎓 Bạn là học sinh - sinh viên? <Link to="/tai-khoan">Xác thực HSSV</Link> để được giảm thêm 5% (tối đa 500.000đ).
                </div>
              )}
            </div>

            <div className="card mt-16">
              <h3 className="panel-title">Phương thức vận chuyển</h3>
              {shipInfo?.methods.map((m) => (
                <label key={m.key} className={`radio-card ${shippingMethod === m.key ? "selected" : ""}`}>
                  <input type="radio" checked={shippingMethod === m.key} onChange={() => setShippingMethod(m.key)} />
                  <div>
                    <strong>{m.label}</strong>
                    <span className="desc">{m.fee === 0 ? "Miễn phí" : formatVND(m.fee)}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="card mt-16">
              <h3 className="panel-title">Phương thức thanh toán</h3>
              {[
                ["cod", "Thanh toán khi nhận hàng (COD)", "Thanh toán tiền mặt cho nhân viên giao hàng."],
                ["bank", "Chuyển khoản ngân hàng", "Chuyển khoản trước, đơn được xử lý sau khi xác nhận."],
                ["momo", "Ví MoMo", "Thanh toán qua ví điện tử MoMo (mô phỏng demo)."],
                ["zalopay", "Ví ZaloPay", "Thanh toán qua ví điện tử ZaloPay (mô phỏng demo)."],
                ["installment", "Trả góp 0% lãi suất", `Áp dụng cho đơn từ ${shipInfo ? formatVND(shipInfo.installment.minTotal) : "3.000.000đ"}, qua đối tác tài chính.`],
              ].map(([key, label, desc]) => (
                <label key={key} className={`radio-card ${paymentMethod === key ? "selected" : ""}`}>
                  <input type="radio" checked={paymentMethod === key} onChange={() => setPaymentMethod(key)} />
                  <div>
                    <strong>{label}</strong>
                    <span className="desc">{desc}</span>
                  </div>
                </label>
              ))}
              {paymentMethod === "installment" && shipInfo && (
                <div className="form-group">
                  <label>Kỳ hạn trả góp</label>
                  <select className="form-control" value={installmentMonths} onChange={(e) => setInstallmentMonths(Number(e.target.value))}>
                    {shipInfo.installment.months.map((m) => (
                      <option key={m} value={m}>{m} tháng {preview ? `— ~${formatVND(Math.ceil(preview.total / m))}/tháng` : ""}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {tradeInOptions.length > 0 && (
              <div className="card mt-16">
                <h3 className="panel-title">Thu cũ - Đổi mới</h3>
                <label className="filter-option">
                  <input type="radio" checked={!tradeInId} onChange={() => setTradeInId("")} /> Không sử dụng
                </label>
                {tradeInOptions.map((t) => (
                  <label className="filter-option" key={t.id}>
                    <input type="radio" checked={String(tradeInId) === String(t.id)} onChange={() => setTradeInId(t.id)} />
                    Trừ {formatVND(t.offeredPrice)} — {t.model} (đã duyệt)
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15 }}>Đơn hàng của bạn</h3>
            {items.map((i) => (
              <div className="summary-row" key={i.productId}>
                <span className="flex items-center gap-8">
                  <span className="mini-thumb">{i.snapshot && <ProductImage product={i.snapshot} />}</span>
                  {i.snapshot?.name} x{i.quantity}
                </span>
                <span>{formatVND((i.snapshot?.finalPrice || 0) * i.quantity)}</span>
              </div>
            ))}
            <div className="voucher-row">
              <input className="form-control" placeholder="Mã giảm giá (VD: GVNGAME10)" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {preview && (
              <>
                <div className="summary-row"><span>Tạm tính</span><span>{formatVND(preview.subtotal)}</span></div>
                <div className="summary-row"><span>Phí vận chuyển</span><span>{preview.shippingFee === 0 ? "Miễn phí" : formatVND(preview.shippingFee)}</span></div>
                {preview.voucherDiscount > 0 && <div className="summary-row"><span>Mã giảm giá ({preview.voucherCode})</span><span className="neg">-{formatVND(preview.voucherDiscount)}</span></div>}
                {preview.hssvDiscount > 0 && <div className="summary-row"><span>Ưu đãi HSSV</span><span className="neg">-{formatVND(preview.hssvDiscount)}</span></div>}
                {preview.tradeInDiscount > 0 && <div className="summary-row"><span>Thu cũ - Đổi mới</span><span className="neg">-{formatVND(preview.tradeInDiscount)}</span></div>}
                <div className="summary-row total"><span>Tổng thanh toán</span><span>{formatVND(preview.total)}</span></div>
              </>
            )}

            <button className="btn btn-primary btn-block mt-16" disabled={placing || !preview}>
              {placing ? "Đang xử lý…" : "Đặt hàng"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
