import { QRCodeSVG } from "qrcode.react";
import { buildVietQRPayload, DEMO_BANK_ACCOUNT } from "../utils/vietqr";
import { formatVND } from "../utils/format";

/**
 * PaymentQR — mã QR để thanh toán hóa đơn đơn hàng.
 *
 * - "bank" (chuyển khoản ngân hàng): sinh mã QR đúng chuẩn VietQR/EMVCo (quét được
 *   bằng app ngân hàng để tự điền số tiền + nội dung chuyển khoản), dùng tài khoản
 *   DEMO (xem src/utils/vietqr.js) — KHÔNG phải tài khoản thật.
 * - "momo" / "zalopay": do không có API đối tác thật, hiển thị mã QR minh họa
 *   (mã hoá thông tin đơn hàng ở dạng văn bản) để demo giao diện, không theo
 *   đúng định dạng độc quyền của MoMo/ZaloPay.
 * - "cod" / "installment": không cần quét QR nên không hiển thị.
 */
export default function PaymentQR({ order }) {
  if (!order || order.paymentStatus === "paid") return null;
  if (!["bank", "momo", "zalopay"].includes(order.paymentMethod)) return null;

  if (order.paymentMethod === "bank") {
    const payload = buildVietQRPayload({ amount: order.total, message: order.code });
    return (
      <div className="card mt-16">
        <h3 className="panel-title">📱 Quét mã QR để chuyển khoản thanh toán</h3>
        <div className="qr-layout">
          <div className="qr-box">
            <QRCodeSVG value={payload} size={176} level="M" marginSize={2} />
          </div>
          <div style={{ flex: 1 }}>
            <table className="spec-table">
              <tbody>
                <tr><td>Ngân hàng</td><td>{DEMO_BANK_ACCOUNT.bankName}</td></tr>
                <tr><td>Số tài khoản</td><td>{DEMO_BANK_ACCOUNT.accountNumber}</td></tr>
                <tr><td>Chủ tài khoản</td><td>{DEMO_BANK_ACCOUNT.accountName}</td></tr>
                <tr><td>Số tiền</td><td><strong style={{ color: "var(--red-600)" }}>{formatVND(order.total)}</strong></td></tr>
                <tr><td>Nội dung CK</td><td>{order.code}</td></tr>
              </tbody>
            </table>
            <p className="form-hint">Mở app ngân hàng bất kỳ → Quét QR → Kiểm tra đúng số tiền &amp; nội dung → Xác nhận chuyển khoản.</p>
          </div>
        </div>
        <div className="alert alert-info mt-16" style={{ marginBottom: 0 }}>
          ⚠️ Đây là tài khoản <strong>DEMO</strong> phục vụ đồ án, không phải tài khoản nhận tiền thật — vui lòng
          không chuyển khoản thật vào số tài khoản này. Sau khi "chuyển khoản", nhân viên cửa hàng (admin) sẽ xác
          nhận thanh toán thủ công trong trang quản trị.
        </div>
      </div>
    );
  }

  // momo / zalopay — minh họa giao diện quét mã, không theo API thật của ví điện tử
  const walletName = order.paymentMethod === "momo" ? "Ví MoMo" : "Ví ZaloPay";
  const demoValue = `GVNGAMING|${order.paymentMethod}|${order.code}|${order.total}`;
  return (
    <div className="card mt-16">
      <h3 className="panel-title">📱 Quét mã QR thanh toán qua {walletName}</h3>
      <div className="qr-layout">
        <div className="qr-box">
          <QRCodeSVG value={demoValue} size={176} level="M" marginSize={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p>Mở ứng dụng <strong>{walletName}</strong> → Quét mã QR → Xác nhận thanh toán <strong>{formatVND(order.total)}</strong> cho đơn hàng <strong>{order.code}</strong>.</p>
          <p className="form-hint">Mã QR minh họa cho mục đích demo giao diện — đồ án chưa kết nối API thanh toán thật của {walletName}.</p>
        </div>
      </div>
    </div>
  );
}
