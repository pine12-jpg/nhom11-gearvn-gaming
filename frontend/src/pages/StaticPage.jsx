import { useParams } from "react-router-dom";

/** US26 — Giới thiệu/chính sách bảo hành/đổi trả; US27 — Hướng dẫn mua hàng/thanh toán/trả góp */
const CONTENT = {
  "gioi-thieu": {
    title: "Giới thiệu GVN Gaming",
    body: (
      <>
        <p>GVN Gaming là website bán thiết bị gaming (laptop gaming, PC gaming, màn hình, bàn phím, chuột, tai nghe, ghế - bàn gaming, linh kiện PC) được xây dựng theo phong cách nền tảng GEARVN.</p>
        <h2>Vì sao chọn GVN Gaming?</h2>
        <ul>
          <li>Sản phẩm chính hãng từ các thương hiệu uy tín: ASUS ROG, MSI, Acer Predator, Logitech G, Razer, Corsair…</li>
          <li>Giá cả cạnh tranh, thường xuyên có chương trình khuyến mãi theo tháng.</li>
          <li>Hỗ trợ trả góp 0% lãi suất cho đơn hàng giá trị cao.</li>
          <li>Chương trình Thu cũ - Đổi mới giúp tiết kiệm chi phí nâng cấp dàn máy.</li>
          <li>Hệ thống showroom tại TP.HCM và Hà Nội, hỗ trợ xem và nhận hàng trực tiếp.</li>
        </ul>
        <p className="muted" style={{ fontSize: 12.5 }}>* Đây là website minh họa phục vụ đồ án môn Công Nghệ Phần Mềm Nâng Cao, không phải website thương mại thật.</p>
      </>
    ),
  },
  "bao-hanh": {
    title: "Chính sách bảo hành",
    body: (
      <>
        <ul>
          <li>Laptop gaming, PC gaming: bảo hành chính hãng 12-24 tháng tùy nhà sản xuất.</li>
          <li>Gaming gear (bàn phím, chuột, tai nghe): bảo hành 12 tháng, 1 đổi 1 trong 30 ngày đầu nếu lỗi do nhà sản xuất.</li>
          <li>Linh kiện PC: bảo hành theo chính sách của từng hãng (thường 36 tháng với RAM, VGA).</li>
          <li>Miễn phí kiểm tra, tư vấn kỹ thuật tại tất cả showroom.</li>
        </ul>
      </>
    ),
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    body: (
      <>
        <ul>
          <li>Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất, còn nguyên hộp và phụ kiện.</li>
          <li>Đổi size/mẫu mã trong 3 ngày đối với ghế - bàn gaming (nếu còn nguyên vẹn, chưa lắp ráp).</li>
          <li>Không áp dụng đổi trả với sản phẩm đã qua sử dụng, trầy xước do người dùng gây ra.</li>
          <li>Chi phí vận chuyển đổi trả do lỗi nhà sản xuất sẽ được GVN Gaming hỗ trợ 100%.</li>
        </ul>
      </>
    ),
  },
  "huong-dan": {
    title: "Hướng dẫn mua hàng, thanh toán & trả góp",
    body: (
      <>
        <h2>1. Các bước đặt hàng</h2>
        <ul>
          <li>Chọn sản phẩm → Thêm vào giỏ hàng → Vào trang Giỏ hàng để kiểm tra lại.</li>
          <li>Nhấn "Tiến hành thanh toán", điền thông tin giao hàng và chọn phương thức vận chuyển.</li>
          <li>Chọn phương thức thanh toán phù hợp và nhấn "Đặt hàng".</li>
        </ul>
        <h2>2. Phương thức thanh toán</h2>
        <ul>
          <li>Thanh toán khi nhận hàng (COD).</li>
          <li>Chuyển khoản ngân hàng.</li>
          <li>Ví điện tử MoMo / ZaloPay.</li>
          <li>Trả góp 0% lãi suất qua đối tác tài chính (áp dụng đơn từ 3.000.000đ).</li>
        </ul>
        <h2>3. Hướng dẫn trả góp 0%</h2>
        <ul>
          <li>Chọn phương thức "Trả góp 0% lãi suất" ở bước thanh toán.</li>
          <li>Chọn kỳ hạn 3, 6 hoặc 12 tháng — hệ thống hiển thị số tiền trả hàng tháng dự kiến.</li>
          <li>Đối tác tài chính sẽ liên hệ xác minh hồ sơ trong vòng 24h sau khi đặt hàng.</li>
        </ul>
      </>
    ),
  },
};

export default function StaticPage() {
  const { slug } = useParams();
  const page = CONTENT[slug] || { title: "Không tìm thấy trang", body: <p>Nội dung không tồn tại.</p> };

  return (
    <div className="page container">
      <div className="card static-content" style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontSize: 21 }}>{page.title}</h1>
        {page.body}
      </div>
    </div>
  );
}
